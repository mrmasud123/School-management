<?php

namespace App\Http\Controllers\Admin;

use App\Jobs\MarkAttendanceJob;
use App\Models\Attendance;
use App\Models\SchoolClass;
use App\Models\Section;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use App\Models\Student;
use Illuminate\Support\Facades\Cache;
class ManageAttendanceController extends Controller
{
    public function index(): \Inertia\Response
    {
        $allClasses = SchoolClass::all();
        return Inertia::render('ManageAttendance', [
            'all_classes' => $allClasses,
        ]);
    }

    public function checkDateWise(string $date, string $classId, string $sectionId)
    {
        $formattedDate = Carbon::parse($date)->format('Y-m-d');

        $existingDate = Attendance::where('attendance_date', $formattedDate)
            ->where('class_id', $classId)
            ->where('section_id', $sectionId)->first();
        if ($existingDate) {
            return true;
        }
        return false;
    }

    public function store(Request $request)
    {
        $request->validate([
            'class_id' => 'required',
            'section_id' => 'required',
            'date' => 'required|date',
            'students' => 'required|array',
            'students.*.id' => 'required|integer',
            'students.*.status' => 'in:present,absent',
        ]);

        $user = Auth::user();
        $attendanceDate = Carbon::parse($request->date)->format('Y-m-d');

        $rows = collect($request->students)->map(function ($student) use ($request, $user, $attendanceDate) {
            return [
                'student_id' => $student['id'],
                'class_id' => $request->class_id,
                'section_id' => $request->section_id,
                'attendance_date' => $attendanceDate,
                'status' => $student['status'],
                'remarks' => $student['remarks'] ?? null,
                'marked_by_id' => $user->teacher?->id ?? $user->id,
                'marked_by_type' => $user->teacher ? \App\Models\Teacher::class : \App\Models\User::class,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        })->toArray();

        MarkAttendanceJob::dispatch($rows);

        return redirect()->route('admin.attendance')->with('success', 'Attendance marked successfully');
    }

    public function history(Request $request)
    {

        $allClasses = SchoolClass::all();

        $perPage = $request->get('per_page', 10);
        $page = $request->get('page', 1);

        $classId = $request->get('class_id');
        $sectionId = $request->get('section_id');
        $attendanceDate = $request->get('attendance_date');


        $attendances = Attendance::with([
            'student:id,first_name,last_name,admission_no',
            'class:id,name',
            'section:id,name',
        ])
            ->when($classId, function ($q) use ($classId) {
                $q->where('class_id', $classId);
            })
            ->when($sectionId, function ($q) use ($sectionId) {
                $q->where('section_id', $sectionId);
            })
            ->when($attendanceDate, function ($q) use ($attendanceDate) {
                $q->where('attendance_date', $attendanceDate);
            })
            ->orderByDesc('attendance_date')
            ->paginate($perPage);

        return Inertia::render('ManageAttendanceHistory', [
            'attendances' => $attendances,
            'all_classes' => $allClasses,
            'class_id' => $request->get('class_id'),
            'filters' => [
                'class_id' => $classId,
                'section_id' => $sectionId,
                'attendance_date' => $attendanceDate,
                'per_page' => $perPage,
            ],
        ]);
    }


    public function editData(Request $request)
    {
        $request->validate([
            'class_id' => 'required|integer',
            'section_id' => 'required|integer',
            'attendance_date' => 'required|date',
        ]);

        $students = Student::where('class_id', $request->class_id)
            ->where('section_id', $request->section_id)
            ->with([
                'attendance' => function ($q) use ($request) {
                    $q->where('attendance_date', $request->attendance_date);
                }
            ])
            ->get()
            ->map(function ($student) {
                return [
                    'id' => $student->id,
                    'name' => $student->first_name . ' ' . $student->last_name,
                    'status' => optional($student->attendance->first())->status ?? 'absent',
                ];
            });

        return response()->json([
            'students' => $students,
        ]);
    }

    /**
     * Update attendance for a date
     */
    public function update(Request $request)
    {
        $request->validate([
            'class_id' => 'required|integer',
            'section_id' => 'required|integer',
            'attendance_date' => 'required|date',
            'students' => 'required|array',
            'students.*.id' => 'required|integer',
            'students.*.status' => 'required|in:present,absent',
        ]);

        DB::transaction(function () use ($request) {
            foreach ($request->students as $student) {
                Attendance::updateOrCreate(
                    [
                        'student_id' => $student['id'],
                        'attendance_date' => $request->attendance_date,
                    ],
                    [
                        'class_id' => $request->class_id,
                        'section_id' => $request->section_id,
                        'status' => $student['status'],
                    ]
                );
            }
        });

        return response()->json([
            'message' => 'Attendance updated successfully',
        ]);
    }




}

