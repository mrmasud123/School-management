<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SchoolClass;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentClassController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $classes= SchoolClass::withCount('students')->withCount('sections')->withSum('sections','capacity')->get();
        return Inertia::render('StudentClass/Classes',['classes' => $classes]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('StudentClass/CreateClass');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{
    $request->validate([
        'class_name' => [
            'required',
            'unique:classes,name',
            'numeric'
        ]
    ]);

    $classCode = strtoupper('CLASS' . $request->input('class_name'));


    if (SchoolClass::where('code', $classCode)->exists()) {
        return redirect()->back()->withErrors(['class_name' => 'The generated class code already exists.'])->withInput();
    }

    SchoolClass::create([
        'name' => $request->input('class_name'),
        'code' => $classCode
    ]);

    return redirect()->back()->with('success', "Class Created!");
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

    public function classWiseStudents($classId){
//        $students= Student::with('studentClass.section')->orderByDesc('id')->where('class_id', $classId)->get();
        $stdntClass= SchoolClass::findOrFail($classId);
        $students=Student::with('sections')->where('class_id', $classId)->get();
        return Inertia::render('StudentClass/ClassWiseStudents', ['students' =>$students, 'stdntClass'=>$stdntClass]);
    }
}
