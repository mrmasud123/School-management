<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SubjectStoreRequest;
use App\Models\SchoolClass;
use App\Models\Section;
use App\Models\Subject;
use App\Models\SubjectSectionMapping;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubjectsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $subjects = Subject::all();
        return Inertia::render('subjects/Index', ['subjects' => $subjects]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('subjects/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(SubjectStoreRequest $request)
    {
        $data = $request->validated();

        Subject::create($data);

        return redirect()
            ->route('admin.subjects.index')
            ->with('success', 'Subject created successfully');
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

    public function assignSubject()
    {
        $subjects = Subject::all();
        $classes = SchoolClass::all();
        return Inertia::render('subjects/AssignSubject', ['subjects' => $subjects, 'classes' => $classes]);
    }
    public function mapSubject(Request $request)
    {
        $data = $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'class_id' => 'required|exists:classes,id',
            'section_id' => 'required|exists:sections,id',
        ]);

        $subject = Subject::find($data['subject_id']);
        $section = Section::where('id', $data['section_id'])
            ->where('class_id', $data['class_id'])
            ->first();

        if (!$section) {
            return redirect()->back()->withErrors(['section_id' => 'The selected section does not belong to the selected class.']);
        }

        if ($section->subjects()->where('subject_id', $data['subject_id'])->exists()) {
            return redirect()->back()->withErrors(['subject_id' => 'This subject is already assigned to the selected section.']);
        }

        $section->subjects()->attach($data['subject_id']);

        return redirect()
            ->route('admin.sections.index')
            ->with('success', 'Subject assigned successfully');
    }

    public function sectionsWiseSubjects($sectionId)
    {
        $section = Section::with('subjects')->find($sectionId);

        if (!$section) {
            return redirect()->back()->withErrors(['section_id' => 'The selected section does not exist.']);
        }

        return $section;
    }

    public function subjectMapping($sectionId, $subjectId)
    {
        $subject = SubjectSectionMapping::where('section_id', $sectionId)
            ->where('subject_id', $subjectId)
            ->get();

        if (!$subject) {
            return redirect()->back()->withErrors([
                'subject_id' => 'The selected subject does not exist.',
            ]);
        }
        $subject->each->delete();

        return redirect()->back()->with('success', 'Subject removed successfully.');
    }
}
