<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SchoolClass;
use App\Models\Section;
use App\Models\SectionTeacherSubject;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class SectionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sections = Section::withCount('students')->with('allClass:id,name')->orderByDesc('id')->get()->groupBy('class_id');
        return Inertia::render('sections/Sections', ['sections' => $sections]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $classes = SchoolClass::all();
        return Inertia::render('sections/CreateSection', ['classes' => $classes]);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'section_name' => 'required|alpha_num|unique:sections,name',
            'class_id' => 'required|exists:classes,id|not_in:0',
            'capacity' => 'required|numeric'
        ]);
        Section::create([
            'class_id' => $request->input('class_id'),
            'name' => $request->input('section_name'),
            'capacity' => $request->input('capacity'),
        ]);

        return redirect()->back()->with('success', 'Section Created Successfully!');
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
        $classes = SchoolClass::all();
        $section = Section::withCount('students')->find($id);
        return Inertia::render('sections/Edit', ['classes' => $classes, 'section' => $section]);
    }


    // public function update(Request $request, string $id)
    // {
    //     $section = Section::withCount('students')->findOrFail($id);

    //     $validator = Validator::make($request->all(), [
    //         'section_name' => 'required|unique:sections,name,' . $section->id,
    //         'class_id' => 'required|exists:classes,id',
    //         'capacity' => 'required|integer|min:0',
    //     ]);
    //     $validator->after(function ($validator) use ($section, $request) {
    //         if ($section->students_count > $request->capacity) {
    //             $validator->errors()->add(
    //                 'capacity',
    //                 'Capacity cannot be less than the current student count of ' . $section->students_count
    //             );
    //         }
    //     });
 
    //     $validated = $validator->validate();
        
    //     $section->update([
    //         'name' => $validated['section_name'],
    //         'class_id' => $validated['class_id'],
    //         'capacity' => $validated['capacity'],
    //     ]);

    //     return redirect()->route('admin.sections.index')
    //         ->with('success', 'Section updated successfully!');
    // }
    
  

public function update(Request $request, string $id)
{
    $section = Section::withCount('students')->findOrFail($id);

    $validator = Validator::make($request->all(), [
        'section_name' => 'required|unique:sections,name,' . $section->id,
        'class_id'     => 'required|exists:classes,id',
        'capacity'     => 'required|integer|min:0',
    ]);

    $validator->after(function ($validator) use ($section, $request) {
        if ($section->students_count > $request->capacity) {
            $validator->errors()->add(
                'capacity',
                'Capacity cannot be less than the current student count of ' . $section->students_count
            );
        }
    });

    $validated = $validator->validate();

    DB::beginTransaction();

    try { 
        $section->update([
            'name'     => $validated['section_name'],
            'class_id' => $validated['class_id'],
            'capacity' => $validated['capacity'],
        ]); 
        $section->students()->update([
            'class_id'   => $validated['class_id'],
            'section_id' => $section->id,
        ]);

        DB::commit();

        return redirect()
            ->route('admin.sections.index')
            ->with('success', 'Section and students updated successfully!');
    } catch (\Throwable $e) {
        DB::rollBack();

        report($e);  

        return back()->withErrors([
            'error' => 'Something went wrong while updating the section.',
        ]);
    }
}



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function fetchSections($classId)
    {
        $sections = Section::withCount('students')->where('class_id', $classId)->get();
        if (empty($sections)) {
            return "No Section Found " . $classId;
        }

        return response()->json([
            'sections' => $sections
        ]);
    }

    public function sectionWiseStudents($sectionId)
    {
        $section = Section::with([
            'subjects.teacherAssignments' => function ($q) use ($sectionId) {
                $q->where('section_id', $sectionId)->with('teacher:id,first_name,last_name');
            }
        ])->findOrFail($sectionId);
        $students = Student::with('studentClass', 'section')->orderByDesc('id')->where('section_id', $sectionId)->get();
        // $section = Section::findOrFail($sectionId);
        return Inertia::render('sections/Students', ['students' => $students, 'section' => $section]);
    }
}
