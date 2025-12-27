<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StudentAdmissionRequest;
use App\Http\Requests\StudentAdmissionUpdateRequest;
use App\Models\SchoolClass;
use App\Models\Section;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;


class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $students= Student::with('studentClass','section')->orderByDesc('id')->get();
        return Inertia::render('students/Students',['students' =>$students]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $classes= SchoolClass::all();
        $sections= Section::all();
        return Inertia::render('students/AdmitStudent', ['classes' => $classes, 'sections' => $sections]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StudentAdmissionRequest $request)
    {
        $data = $request->validated();
        $uploadedImagePath = null;

        try {
            DB::beginTransaction();
            if ($request->hasFile('photo')) {
                $uploadedImagePath = $request->file('photo')->store('uploads/students', 'public');
                $data['photo'] = $uploadedImagePath;
            }

            if (empty($data['admission_no'])) {
                $data['admission_no'] = 'ADM' . time();
            }

            $studentData = [
                'admission_no'       => $data['admission_no'],
                'first_name'         => $data['first_name'],
                'last_name'          => $data['last_name'],
                'dob'                => $data['dob'],
                'blood_group'        => $data['blood_group'] ?? null,
                'gender'             => $data['gender'],
                'email'              => $data['email'] ?? null,
                'father_name'        => $data['father_name'],
                'mother_name'        => $data['mother_name'],
                'father_occupation'  => $data['father_occupation'],
                'mother_occupation'  => $data['mother_occupation'],
                'nationality'        => $data['nationality'],
                'guardian_phone'     => $data['guardian_phone'],
                'class_id'           => $data['class_id'],
                'section_id'         => $data['section_id'],
                'admission_date'     => $data['admission_date'],
                'academic_year'      => $data['academic_year'],
                'previous_school'    => $data['previous_school'] ?? null,
                'address' => $data['current_address'] ?? null,
                'photo'              => $data['photo'] ?? null,
                'status'             => $data['status'],
            ];

            Student::create($studentData);

            DB::commit();

            return redirect()
                ->back()
                ->with('success', 'Student admitted successfully!');

        }  catch (\Exception $e) {
            DB::rollBack();

            if ($uploadedImagePath && Storage::disk('public')->exists($uploadedImagePath)) {
            Storage::disk('public')->delete($uploadedImagePath);
            }

            Log::error('Student Admission Error', [
                'message' => $e->getMessage(),
                'file'    => $e->getFile(),
                'line'    => $e->getLine(),
                'trace'   => $e->getTraceAsString(),
            ]);

            return back()->with('error', 'Failed to admit student');
        }

    }



    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $code = "ADM" . $id;

        // Find the student by admission number
        $student = Student::with('studentClass','section')->where('admission_no', $code)->first();

        if (!$student) {
            return response()->json([
                'message' => 'Student not found'
            ], 404);
        }

        return response()->json($student);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $classes= SchoolClass::all();
        $sections= Section::withCount('students')->get();
        $student= Student::with('studentClass','section')->find($id);
        return Inertia::render('students/EditStudent', [
            'student' => $student,
            'classes' =>$classes,
            'all_section'=>$sections
            ]
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StudentAdmissionUpdateRequest $request, string $id)
    {
        $data = $request->validated();
        $uploadedImagePath = null;

        try {
            DB::beginTransaction();

            $student = Student::findOrFail($id); // Fetch the existing student

            // Handle photo upload
            if ($request->hasFile('photo')) {
                // Delete old photo if exists
                if ($student->photo && Storage::disk('public')->exists($student->photo)) {
                    Storage::disk('public')->delete($student->photo);
                }

                $uploadedImagePath = $request->file('photo')->store('uploads/students', 'public');
                $data['photo'] = $uploadedImagePath;
            }

            // Map data for update
            $studentData = [
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'dob' => $data['dob'],
                'blood_group' => $data['blood_group'] ?? null,
                'gender' => $data['gender'],
                'email' => $data['email'] ?? null,
                'father_name' => $data['father_name'],
                'mother_name' => $data['mother_name'],
                'father_occupation' => $data['father_occupation'],
                'mother_occupation' => $data['mother_occupation'],
                'nationality' => $data['nationality'],
                'guardian_phone' => $data['guardian_phone'],
                'class_id' => $data['class_id'],
                'section_id' => $data['section_id'],
                'admission_date' => $data['admission_date'],
                'academic_year' => $data['academic_year'],
                'previous_school' => $data['previous_school'] ?? null,
                'address' => $data['current_address'] ?? null,
                'photo' => $data['photo'] ?? $student->photo,
                'status' => $data['status'],
            ];

            $student->update($studentData); // Update existing student

            DB::commit();

            return redirect()
                ->back()
                ->with('success', 'Student updated successfully!');

        } catch (\Exception $e) {
            DB::rollBack();

            if ($uploadedImagePath && Storage::disk('public')->exists($uploadedImagePath)) {
                Storage::disk('public')->delete($uploadedImagePath);
            }
        }
    }

                /**
     * Remove the specified resource from storage.
     */
    public function destroy(Student $student)
    {
        $student->delete();

        // return redirect()->route('admin.students.index')->with('success', 'User deleted.');
        return redirect()
        ->route('admin.students.index')
        ->setStatusCode(303);
    }

    public function migrate(){
        $classes= SchoolClass::all();
        $sections= Section::all();
        return Inertia::render('students/MigrateStudent', [
            'classes' =>$classes,
            'sections' =>$sections
        ]);
    }

    public function migrateStudent(Request $request)
    {
        $validated = $request->validate([
            'student_id'           => 'required|numeric|exists:students,id',
            'from_class_id'        => 'required|numeric',
            'from_section_id'      => 'required|numeric',
            'to_class_id'          => 'required|numeric|exists:classes,id',
            'to_section_id'        => 'required|numeric|exists:sections,id',
        ]);

        $student = Student::find($validated['student_id']);

        if (
            $student->class_id != $validated['from_class_id'] ||
            $student->section_id != $validated['from_section_id']
        ) {
            throw ValidationException::withMessages([
                'from_section_id' => 'The provided FROM class/section does not match student record.'
            ]);
        }

        if (
            $validated['from_class_id'] == $validated['to_class_id'] &&
            $validated['from_section_id'] == $validated['to_section_id']
        ) {
            throw ValidationException::withMessages([
                'to_section_id' => 'Cannot migrate to the same class and section.'
            ]);
        }

        $targetSection = Section::findOrFail($validated['to_section_id']);

        $remaining = $targetSection->capacity - $targetSection->students_count;
        if ($remaining <= 0) {
            throw ValidationException::withMessages([
                'to_section_id' => 'Selected section is full.'
            ]);
        }
        DB::beginTransaction();

        try {

            $student->class_id   = $validated['to_class_id'];
            $student->section_id = $validated['to_section_id'];
            $student->save();

            DB::commit();

            return response()->json([
                'message' => 'Student migrated successfully',
                'student' => $student
            ], 200);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'message' => 'Migration failed',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function trashed(){
        $students= Student::with('studentClass','section')->orderByDesc('deleted_at')->onlyTrashed()->get();
        return Inertia::render('students/Trashed', ['students'=>$students]);
    }

    public function restore($id)
    {
        Student::onlyTrashed()->findOrFail($id)->restore();

        return redirect()->back()->with('success', 'Student restored.');
    }

    public function forceDelete($id)
    {
        Student::onlyTrashed()->findOrFail($id)->forceDelete();

        return redirect()->back()->with('success', 'Student permanently deleted.');
    }
    
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:approved,pending,rejected'
        ]);

        $student = Student::findOrFail($id);
        $student->status = $request->input('status');
        $student->save();

        return redirect()->back()->with('success', 'Student status updated.');
    }



}
