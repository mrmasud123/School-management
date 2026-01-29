<?php

namespace App\Http\Controllers\Admin;

use App\Models\Attendance;
use App\Models\SchoolClass;
use App\Models\Section;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Carbon\Carbon;

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

        Attendance::insert($rows);

        return redirect()->route('admin.attendance')->with('success', 'Attendance marked successfully');
    }

}

