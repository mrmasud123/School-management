<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StudentAdmissionRequest;
use App\Models\SchoolClass;
use App\Models\Section;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

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
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function migrate(){
        return Inertia::render('students/MigrateStudent');
    }
}
