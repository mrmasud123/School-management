<?php

namespace App\Http\Controllers\Admin\Exam;

use App\Http\Controllers\Controller;
use App\Models\ExamSchedule;
use App\Models\SchoolClass;
use App\Models\Teacher;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\StoreExamScheduleRequest;
use App\Models\ExamType;

class ExamTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $examTypes = ExamType::all();
        return Inertia::render('exam/exam_type/Index', compact('examTypes'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('exam/exam_type/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:255|unique:exam_types,code',
            'description' => 'nullable|string',
            'is_active' => 'required|boolean',
        ]);

        ExamType::create($validated);

        return redirect()->route('admin.exam.types.index')
            ->with('success', 'Exam Type created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {


    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ExamType $examType)
    {
        return Inertia::render('exam/exam_type/Edit', [
            'examType' => $examType
        ]);
    }

    public function update(Request $request, ExamType $examType)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:255|unique:exam_types,code,' . $examType->id,
            'description' => 'nullable|string',
            'is_active' => 'required|boolean',
        ]);

        $examType->update($validated);

        return redirect()
            ->route('admin.exam.types.index')
            ->with('success', 'Exam Type updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function assignExamSchedule(string $id)
    {
        $examType = ExamType::find($id);
        $classes = SchoolClass::all();
        // $exams = ExamType::orderBy('id', 'desc')->get();
        $teachers = Teacher::all();
        return Inertia::render('exam/exam_type/AssignExamSchedule', compact('examType', 'classes', 'teachers'));
    }

    public function assignExamScheduleStore(StoreExamScheduleRequest $request)
    {
        DB::beginTransaction();

        try {

            $exists = ExamSchedule::where('exam_id', $request->exam_id)
                ->where('class_id', $request->class_id)
                ->where('subject_id', $request->subject_id)
                ->where('section_id', $request->section_id)
                ->exists();

            if ($exists) {
                return response()->json([
                    'message' => 'Exam schedule already exists for this exam, class, subject and section.'
                ], 422);
            }

            $schedule = ExamSchedule::create([
                'exam_id' => $request->exam_id,
                'class_id' => $request->class_id,
                'subject_id' => $request->subject_id,
                'section_id' => $request->section_id,

                'exam_date' => $request->exam_date,
                'start_time' => $request->start_time,
                'end_time' => $request->end_time,
                'duration_minutes' => $request->duration_minutes,

                'room_id' => $request->room_id,
                'invigilator_id' => $request->invigilator_id,

                'total_marks' => $request->total_marks,
                'passing_marks' => $request->passing_marks,

                'instructions' => $request->instructions,
                'status' => $request->status,
                'is_mark_entry_locked' => $request->is_mark_entry_locked,
                'mark_entry_deadline' => $request->mark_entry_deadline,
            ]);

            DB::commit();

            return redirect()->route('admin.exam.types.index')
                ->with('success', 'Exam Schedule created successfully.');

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'message' => 'Something went wrong',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function examTypeSubjects($id)
    {
        $examSubjects = ExamType::find($id);
        // $examType = ExamType::find($id);

        return Inertia::render('exam/exam_type/ExamSubjects', compact('examSubjects'));
    }

}
