<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SchoolClass;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class StudentClassController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $page = $request->get('page', 1);
        $search = $request->get('search');

        $cacheKey = "classes:page={$page}:perPage={$perPage}:search={$search}";

        $classes = Cache::tags(['classes'])->remember(
            $cacheKey,
            300,
            function () use ($perPage, $page, $search) {
                return SchoolClass::withCount('students')
                    ->withCount('sections')
                    ->withSum('sections', 'capacity')
                    ->when($search, function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    })
                    ->paginate($perPage, ['*'], 'page', $page);
            }
        );

        return Inertia::render('StudentClass/Classes', [
            'classes' => $classes,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
            ],
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $allClasses = SchoolClass::all();
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

    public function classWiseStudents($classId)
    {
        //        $students= Student::with('studentClass.section')->orderByDesc('id')->where('class_id', $classId)->get();
        $stdntClass = SchoolClass::with('sections')->findOrFail($classId);
        $students = Student::with('sections')->where('class_id', $classId)->get();
        return Inertia::render('StudentClass/ClassWiseStudents', ['students' => $students, 'stdntClass' => $stdntClass]);
    }
}
