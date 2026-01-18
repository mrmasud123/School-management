<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTeacherRequest;
use App\Models\Product;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\Teacher;
use App\Models\Designation;
use App\Models\Qualification;
use App\Models\EmployementType;
use App\Models\Specialization;
use App\Models\TeacherContact;
use App\Models\TeacherSpecialization;
use App\Http\Resources\TeacherResource;

class TeachersController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $teachers = Cache::remember('teachers', 60 * 60, fn() => TeacherResource::collection(
            Teacher::with(['designation', 'employmentType', 'qualification', 'contact', 'specializations', 'media'])->orderBy('id', 'desc')->get()
        )->resolve());

        return Inertia::render('teachers/Index', [
            'teachers' => $teachers,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $designations = Designation::all();

        $employmentTypes = EmployementType::all();

        $specializations = Specialization::all();

        $qualifications = Qualification::all();

        return Inertia::render('teachers/Create', [
            'designations' => $designations,
            'employmentTypes' => $employmentTypes,
            'specializations' => $specializations,
            'qualifications' => $qualifications,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTeacherRequest $request)
    {
        $validated = $request->validated();

        $teacher = null;

        DB::transaction(function () use ($validated, &$teacher) {

            $teacher = Teacher::create([
                'employee_id' => 'TEMP',
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'date_of_birth' => $validated['date_of_birth'],
                'gender' => $validated['gender'] ?? null,
                'joining_date' => $validated['joining_date'],
                'designation_id' => $validated['designation_id'],
                'employment_type_id' => $validated['employment_type_id'],
                'qualification_id' => $validated['qualification_id'],
                'experience_years' => $validated['experience_years'],
                'is_active' => true,
            ]);

            $teacher->update([
                'employee_id' => 'EMP-' . now()->year . '-' . str_pad($teacher->id, 4, '0', STR_PAD_LEFT),
            ]);

            TeacherContact::create([
                'teacher_id' => $teacher->id,
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'address' => $validated['address'],
            ]);

            if (!empty($validated['specialization_ids'])) {
                foreach ($validated['specialization_ids'] as $specializationId) {
                    TeacherSpecialization::create([
                        'teacher_id' => $teacher->id,
                        'specialization_id' => $specializationId,
                    ]);
                }
            }
        });

        DB::afterCommit(function () use ($request, $teacher) {

            if ($request->hasFile('photo')) {
                $teacher->addMediaFromRequest('photo')
                    ->usingFileName(
                        'teacher_photo_' . $teacher->id . '.' .
                        $request->file('photo')->extension()
                    )
                    ->toMediaCollection('images');
            }

            if ($request->hasFile('document_pdf')) {
                $teacher->addMediaFromRequest('document_pdf')
                    ->usingFileName(
                        'teacher_document_' . $teacher->id . '.' .
                        $request->file('document_pdf')->extension()
                    )
                    ->toMediaCollection('files');
            }
        });

        return redirect()
            ->route('admin.teachers.index')
            ->with('success', 'Teacher added successfully!');
    }


    /**
     * Display the specified resource.  
     */
    public function show(string $id)
    {
        $teacher = Teacher::with(['media'])->findOrFail($id);
        return Inertia::render('teachers/Show', [
            'teacher' => $teacher,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $designations = Designation::all();

        $employmentTypes = EmployementType::all();

        $specializations = Specialization::all();

        $qualifications = Qualification::all();
        $teacher = Teacher::with([
            'designation',
            'employmentType',
            'qualification',
            'contact',
            'specializations',
            'media'
        ])->find($id);
        $teacher->photo_url = $teacher->getFirstMediaUrl('images') ?: null;
        $teacher->document_url = $teacher->getFirstMediaUrl('files') ?: null;
        return Inertia::render('teachers/Edit', [
            'teacher' => $teacher,
            'designations' => $designations,
            'employmentTypes' => $employmentTypes,
            'specializations' => $specializations,
            'qualifications' => $qualifications,

        ]);
    }

    /**
     * Update the specified resource in storage.
     */


    public function update(Request $request, string $id)
    {
        // return $request->all();
        $teacher = Teacher::findOrFail($id);

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'gender' => 'nullable|string|in:male,female,other',
            'date_of_birth' => 'required|date',
            'joining_date' => 'required|date',
            'experience_years' => 'required|integer|min:0',
            'designation_id' => 'required|exists:designations,id',
            'employment_type_id' => 'required|exists:employement_types,id',
            'qualification_id' => 'required|exists:qualifications,id',
            'specialization_ids' => 'nullable|array',
            'specialization_ids.*' => 'exists:specializations,id',
            'email' => 'nullable|email',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'photo' => 'nullable|file|mimes:jpg,jpeg,png|max:5120', // 5MB
            'document_pdf' => 'nullable|file|mimes:pdf|max:10240', // 10MB
        ]);

        DB::transaction(function () use ($teacher, $validated, $request) {

            $teacher->update([
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'gender' => $validated['gender'] ?? $teacher->gender,
                'date_of_birth' => $validated['date_of_birth'],
                'joining_date' => $validated['joining_date'],
                'experience_years' => $validated['experience_years'],
                'designation_id' => $validated['designation_id'],
                'employment_type_id' => $validated['employment_type_id'],
                'qualification_id' => $validated['qualification_id'],
            ]);

            TeacherContact::updateOrCreate(
                ['teacher_id' => $teacher->id],
                [
                    'email' => $validated['email'] ?? null,
                    'phone' => $validated['phone'] ?? null,
                    'address' => $validated['address'] ?? null,
                ]
            );

            if (isset($validated['specialization_ids'])) {
                $teacher->specializations()->sync($validated['specialization_ids']);
            } else {
                $teacher->specializations()->detach();
            }
        });

        // Handle media AFTER commit
        DB::afterCommit(function () use ($teacher, $request) {

            if ($request->hasFile('photo')) {
                $teacher->clearMediaCollection('images');

                $teacher->addMediaFromRequest('photo')
                    ->usingFileName('teacher_photo_' . $teacher->id . '.' . $request->file('photo')->extension())
                    ->toMediaCollection('images');
            }
            if ($request->hasFile('document_pdf')) {
                $teacher->clearMediaCollection('files');

                $teacher->addMediaFromRequest('document_pdf')
                    ->usingFileName('teacher_document_' . $teacher->id . '.' . $request->file('document_pdf')->extension())
                    ->toMediaCollection('files');
            }
        });

        return redirect()->route('admin.teachers.index')
            ->with('success', 'Teacher updated successfully!');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Teacher $teacher)
    {
        $teacher->delete();

        return redirect()->back()->with('success', 'Teacher deleted.');
    }

    public function trashed()
    {
        $trashedTeachers = TeacherResource::collection(
            Teacher::onlyTrashed()->with(['designation', 'employmentType', 'qualification', 'contact', 'specializations', 'media'])->orderBy('id', 'desc')->get()
        )->resolve();

        return Inertia::render('teachers/Trashed', [
            'teachers' => $trashedTeachers,
        ]);
    }

    public function restore($id)
    {
        Teacher::onlyTrashed()->findOrFail($id)->restore();

        return redirect()->back()->with('success', 'Teacher restored.');
    }
}
