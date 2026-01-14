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
use Barryvdh\DomPDF\Facade\Pdf;
use App\Exports\StudentsExport;
use Maatwebsite\Excel\Facades\Excel;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $students = Student::with('studentClass', 'section')->orderByDesc('id')->get();
        return Inertia::render('students/Students', ['students' => $students]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // $user = auth()->user();
        // return $roles= $user->getRoleNames();
        $classes = SchoolClass::all();
        $sections = Section::all();
        return Inertia::render('students/AdmitStudent', ['classes' => $classes, 'sections' => $sections]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StudentAdmissionRequest $request)
    {
        $validated = $request->validated();

        $student = null;

        DB::transaction(function () use ($validated, &$student) {

            if (empty($validated['admission_no'])) {
                $validated['admission_no'] = 'ADM' . time();
            }

            $student = Student::create([
                'admission_no' => $validated['admission_no'],

                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'dob' => $validated['dob'],
                'blood_group' => $validated['blood_group'] ?? null,
                'gender' => $validated['gender'],

                'email' => $validated['email'] ?? null,

                'father_name' => $validated['father_name'],
                'mother_name' => $validated['mother_name'],
                'father_occupation' => $validated['father_occupation'] ?? null,
                'mother_occupation' => $validated['mother_occupation'] ?? null,

                'nationality' => $validated['nationality'],
                'religion' => $validated['religion'] ?? null,

                'guardian_relation' => $validated['guardian_relation'],
                'guardian_phone' => $validated['guardian_phone'],

                'roll_no' => $validated['roll_no'] ?? null,
                'class_id' => $validated['class_id'],
                'section_id' => $validated['section_id'],
                'admission_date' => $validated['admission_date'],
                'academic_year' => $validated['academic_year'],
                'student_status' => $validated['student_status'] ?? 0,
                'status' => $validated['status'] ?? 'pending',

                'previous_school' => $validated['previous_school'] ?? null,
                'address' => $validated['address'] ?? null,
            ]);
        });

        DB::afterCommit(function () use ($request, $student) {

            if ($request->hasFile('photo')) {
                $student->addMediaFromRequest('photo')
                    ->usingFileName(
                        'student_photo_' . $student->id . '.' .
                        $request->file('photo')->extension()
                    )
                    ->toMediaCollection('students');
            }
        });

        return redirect()
            ->back()
            ->with('success', 'Student admitted successfully!');
    }




    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $code = "ADM" . $id;

        // Find the student by admission number
        $student = Student::with('studentClass', 'section')->where('admission_no', $code)->first();

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
    //    public function edit(string $id)
//    {
//        $classes = SchoolClass::all();
//        $sections = Section::withCount('students')->get();
//        $student = Student::with('studentClass', 'section')->find($id);
//        $student->photo_url = $student->getFirstMediaUrl('students') ?: null;
//        return Inertia::render(
//            'students/EditStudent',
//            [
//                'student' => $student,
//                'classes' => $classes,
//                'all_section' => $sections
//            ]
//        );
//    }

    public function edit(string $id)
    {
        $classes = SchoolClass::all();
        $sections = Section::withCount('students')->get();

        $student = Student::with([
            'studentClass',
            'section',
            'media', // MUST be here
        ])->findOrFail($id);

        return Inertia::render('students/EditStudent', [
            'student' => $student,
            'classes' => $classes,
            'all_section' => $sections,
        ]);
    }


    /**
     * Update the specified resource in storage.
     */
    //    public function update(StudentAdmissionUpdateRequest $request, string $id)
//    {
//        $data = $request->validated();
//        $uploadedImagePath = null;
//
//        try {
//            DB::beginTransaction();
//
//            $student = Student::findOrFail($id); // Fetch the existing student
//
//            // Handle photo upload
//            if ($request->hasFile('photo')) {
//                // Delete old photo if exists
//                if ($student->photo && Storage::disk('public')->exists($student->photo)) {
//                    Storage::disk('public')->delete($student->photo);
//                }
//
//                $uploadedImagePath = $request->file('photo')->store('uploads/students', 'public');
//                $data['photo'] = $uploadedImagePath;
//            }
//
//            // Map data for update
//            $studentData = [
//                'first_name' => $data['first_name'],
//                'last_name' => $data['last_name'],
//                'dob' => $data['dob'],
//                'blood_group' => $data['blood_group'] ?? null,
//                'gender' => $data['gender'],
//                'email' => $data['email'] ?? null,
//                'father_name' => $data['father_name'],
//                'mother_name' => $data['mother_name'],
//                'father_occupation' => $data['father_occupation'],
//                'mother_occupation' => $data['mother_occupation'],
//                'nationality' => $data['nationality'],
//                'guardian_phone' => $data['guardian_phone'],
//                'class_id' => $data['class_id'],
//                'section_id' => $data['section_id'],
//                'admission_date' => $data['admission_date'],
//                'academic_year' => $data['academic_year'],
//                'previous_school' => $data['previous_school'] ?? null,
//                'address' => $data['current_address'] ?? null,
//                'photo' => $data['photo'] ?? $student->photo,
//                'status' => $data['status'],
//            ];
//
//            $student->update($studentData); // Update existing student
//
//            DB::commit();
//
//            return redirect()
//                ->back()
//                ->with('success', 'Student updated successfully!');
//        } catch (\Exception $e) {
//            DB::rollBack();
//
//            if ($uploadedImagePath && Storage::disk('public')->exists($uploadedImagePath)) {
//                Storage::disk('public')->delete($uploadedImagePath);
//            }
//        }
//    }

    public function update(StudentAdmissionUpdateRequest $request, string $id)
    {
        $validated = $request->validated();

        $student = Student::findOrFail($id);

        DB::transaction(function () use ($student, $validated) {

            $student->update([
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'dob' => $validated['dob'],
                'blood_group' => $validated['blood_group'] ?? null,
                'gender' => $validated['gender'],
                'email' => $validated['email'] ?? null,
                'father_name' => $validated['father_name'],
                'mother_name' => $validated['mother_name'],
                'father_occupation' => $validated['father_occupation'] ?? null,
                'mother_occupation' => $validated['mother_occupation'] ?? null,
                'nationality' => $validated['nationality'],
                'guardian_phone' => $validated['guardian_phone'],
                'class_id' => $validated['class_id'],
                'section_id' => $validated['section_id'],
                'admission_date' => $validated['admission_date'],
                'academic_year' => $validated['academic_year'],
                'previous_school' => $validated['previous_school'] ?? null,
                'address' => $validated['address'] ?? null,
                'status' => $validated['status'],
            ]);
        });

        DB::afterCommit(function () use ($request, $student) {

            if ($request->hasFile('photo')) {

                $student->clearMediaCollection('students');

                $student->addMediaFromRequest('photo')
                    ->usingFileName(
                        'student_photo_' . $student->id . '.' .
                        $request->file('photo')->extension()
                    )
                    ->toMediaCollection('students');
            }
        });

        return redirect()->back()->with('success', 'Student updated successfully!');
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

    public function migrate()
    {
        $classes = SchoolClass::all();
        $sections = Section::all();
        return Inertia::render('students/MigrateStudent', [
            'classes' => $classes,
            'sections' => $sections
        ]);
    }

    public function migrateStudent(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|numeric|exists:students,id',
            'from_class_id' => 'required|numeric',
            'from_section_id' => 'required|numeric',
            'to_class_id' => 'required|numeric|exists:classes,id',
            'to_section_id' => 'required|numeric|exists:sections,id',
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

            $student->class_id = $validated['to_class_id'];
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
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function trashed()
    {
        $students = Student::with('studentClass', 'section')->orderByDesc('deleted_at')->onlyTrashed()->get();
        return Inertia::render('students/Trashed', ['students' => $students]);
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



    public function export(Request $request)
    {
        return Excel::download(
            new StudentsExport(
                $request->query('search'),
                $request->query('page', 1),
                $request->query('per_page', 10)
            ),
            'students_page_' . $request->page . '.xlsx'
        );
    }

    public function exportPdf(Request $request)
    {
        $search = $request->query('search');
        $page = (int) $request->query('page', 1);
        $perPage = (int) $request->query('per_page', 10);

        $students = Student::query()
            ->with(['studentClass', 'section'])
            ->when($search, function ($q) use ($search) {
                $q->where('id', 'like', "%{$search}%")
                    ->orWhere('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%");
            })
            ->offset(($page - 1) * $perPage)
            ->limit($perPage)
            ->get();

        $pdf = Pdf::loadView('pdf.students', [
            'students' => $students,
            'page' => $page,
        ])->setPaper('a4', 'landscape');
        return $pdf->download("students_page_{$page}.pdf");
    }
}
