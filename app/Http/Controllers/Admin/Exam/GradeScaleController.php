<?php
// app/Http/Controllers/GradeScaleController.php

namespace App\Http\Controllers\Admin\Exam;
use App\Http\Controllers\Controller;
use App\Models\GradeScale;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GradeScaleController extends Controller
{
    public function index()
    {
        return Inertia::render('exam/grade_scale/Index', [
            'gradeScales' => GradeScale::latest()->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('exam/grade_scale/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|unique:grade_scales,name',
            'grade_point' => 'required|numeric|unique:grade_scales,grade_point',
            'remarks' => 'nullable|string',
            'color_code' => 'nullable|string',
            'is_active' => 'required|boolean',
        ]);

        GradeScale::create($validated);

        return redirect()->route('admin.grade.scales.index')
            ->with('success', 'Grade scale created successfully.');
    }

    public function edit(GradeScale $gradeScale)
    {
        return Inertia::render('exam/grade_scale/Edit', [
            'gradeScale' => $gradeScale
        ]);
    }

    public function update(Request $request, GradeScale $gradeScale)
    {
        $validated = $request->validate([
            'name' => 'required|unique:grade_scales,name,' . $gradeScale->id,
            'grade_point' => 'required|numeric|unique:grade_scales,grade_point,' . $gradeScale->id,
            'remarks' => 'nullable|string',
            'color_code' => 'nullable|string',
            'is_active' => 'required|boolean',
        ]);

        $gradeScale->update($validated);

        return redirect()->route('admin.grade.scales.index')
            ->with('success', 'Grade scale updated successfully.');
    }

    public function destroy(GradeScale $gradeScale)
    {
        $gradeScale->delete();

        return back()->with('success', 'Deleted successfully.');
    }
}
