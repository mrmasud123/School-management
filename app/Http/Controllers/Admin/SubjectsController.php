<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SubjectStoreRequest;
use App\Models\SchoolClass;
use App\Models\Section;
use App\Models\SectionTeacherSubject;
use App\Models\Subject;
use App\Models\SubjectSectionMapping;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Teacher;
use Illuminate\Validation\ValidationException;

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
        $section = Section::with([
            'subjects.teacherAssignments' => function ($q) use ($sectionId) {
                $q->where('section_id', $sectionId)->with('teacher:id,first_name,last_name');
            }
        ])->findOrFail($sectionId);
        if (!$section) {
            return redirect()->back()->withErrors(['section_id' => 'The selected section does not exist.']);
        }

        return $section;
    }

    public function subjectSectionMapping($sectionId, $subjectId)
    {
        $existing = SectionTeacherSubject::where('section_id', $sectionId)
            ->where('subject_id', $subjectId)->first();
        if ($existing) {
            return redirect()->back()->withErrors([
                'subject_id' => 'First remove the assigned teacher!'
            ]);
        }
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

    public function subjectTeacherMapping()
    {
        $classes = SchoolClass::all();
        return Inertia::render('subjects/TeacherMapping', compact('classes'));
    }

    public function sections($classId)
    {
        return Section::where('class_id', $classId)->get();
    }

    public function subjects($sectionId)
    {

        $sectionWiseData = SectionTeacherSubject::with(['teacher:id,employee_id,first_name,last_name', 'subject:id,name'])->where('section_id', $sectionId)->get();
        $sectionWiseSubject = SubjectSectionMapping::with('subject')
            ->where('section_id', $sectionId)
            ->get()
            ->pluck('subject')
            ->unique('id')
            ->values();

        return [$sectionWiseData, $sectionWiseSubject];
    }

    public function teachers()
    {
        // return SectionTeacherSubject::whereNot([
        //     'section_id' => $sectionId,
        //     'subject_id' => $subjectId,
        // ])
        //     ->with('teacher:id,first_name,last_name')
        //     ->get()
        //     ->pluck('teacher')
        //     ->unique('id')
        //     ->values();
        return Teacher::all();
    }

    public function subjectSectionTeacherMapping(Request $request)
    {
        $classId = $request->input('class_id');
        $sectionId = $request->input('section_id');
        $teacherId = $request->input('teacher_id');
        $subjectId = $request->input('subject_id');

        $request->validate([
            'class_id' => 'required|exists:classes,id',
            'section_id' => 'required|exists:sections,id',
            'teacher_id' => 'required|exists:teachers,id',
            'subject_id' => 'required|exists:subjects,id',
        ]);


        $alreadyAssigned = SectionTeacherSubject::where('class_id', $classId)
            ->where('section_id', $sectionId)
            ->where('subject_id', $subjectId)
            ->exists();

        if ($alreadyAssigned) {
            throw ValidationException::withMessages([
                'subject_id' => 'This subject is already assigned to this class and section.'
            ]);
        }


        $exists = SectionTeacherSubject::where('class_id', $classId)
            ->where('section_id', $sectionId)
            ->where('teacher_id', $teacherId)
            ->where('subject_id', $subjectId)
            ->exists();

        if ($exists) {
            throw ValidationException::withMessages([
                'duplicate' => 'This teacher is already assigned to this subject in this class and section.'
            ]);
        }

        SectionTeacherSubject::create([
            'class_id' => $classId,
            'section_id' => $sectionId,
            'teacher_id' => $teacherId,
            'subject_id' => $subjectId
        ]);

        return redirect()->back()->with('success', 'Mapping created successfully!');
    }

    public function removeSectionSubjectTeacherMapping(Request $request)
    {
        $data = $request->validate([
            'class_id' => 'required|exists:classes,id',
            'section_id' => 'required|exists:sections,id',
            'teacher_id' => 'required|exists:teachers,id',
            'subject_id' => 'required|exists:subjects,id',
        ]);

        $mapping = SectionTeacherSubject::where('class_id', $data['class_id'])
            ->where('section_id', $data['section_id'])
            ->where('teacher_id', $data['teacher_id'])
            ->where('subject_id', $data['subject_id'])
            ->first();

        if (!$mapping) {
            throw ValidationException::withMessages([
                'mapping' => 'The selected subject-teacher mapping does not exist.'
            ]);
        }

        $mapping->delete();


        return redirect()->back()->with('success', 'Subject removed successfully.');
    }

}
