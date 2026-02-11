<?php

namespace App\Http\Controllers\Admin\Exam;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
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
        //
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
}
