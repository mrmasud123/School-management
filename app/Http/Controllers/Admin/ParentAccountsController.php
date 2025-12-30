<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreParentAccountRequest;
use App\Http\Requests\UpdateParentAccountRequest;
use App\Models\ParentAccount;
use App\Models\ParentStudentMapping;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ParentAccountsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $parents = ParentAccount::with([
            'students.studentClass',
            'students.section'
        ])->get();

        return Inertia::render('parent/Index', compact('parents'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('parent/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreParentAccountRequest $request)
    {
        $validated = $request->validated();

        DB::transaction(function () use ($validated) {
            ParentAccount::create([
                'first_name' => $validated['first_name'],
                'last_name'  => $validated['last_name'] ?? null,
                'phone'      => $validated['phone'],
                'email'      => $validated['email'] ?? null,
                'nid'        => $validated['nid'] ?? null,
                'address'    => $validated['address'] ?? null,
            ]);
        });

        return redirect()
            ->route('admin.parent.accounts.index')
            ->with('success', 'Parent account created successfully!');
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return $id;
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $parent = ParentAccount::with([
            'students.studentClass',
            'students.section'
        ])->find($id);
        return Inertia::render('parent/Edit', compact('parent'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateParentAccountRequest $request, string $id)
    {
        $account = ParentAccount::find($id);
        $validated = $request->validated();
        if ($account) {
            $account->first_name = $validated['first_name'];
            $account->last_name = $validated['last_name'];
            $account->phone = $validated['phone'];
            $account->email = $validated['email'];
            $account->nid = $validated['nid'];
            $account->is_active = $validated['is_active'];


            $account->save();
            return redirect()->route('admin.parent.accounts.index')->with('success', 'Parent account updated.');
        }
        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function mapping($parentId)
    {
        $parent = ParentAccount::with([
            'students.studentClass',
            'students.section'
        ])->find($parentId);
        $allParents = ParentAccount::all();
        return Inertia::render('parent/Mapping', [
            'parent' => $parent,
            'allParent' => $allParents
        ]);
    }

    public function removeMapping($parentId, $studentId)
    {
        $data = ParentStudentMapping::where('parent_id', $parentId)
            ->where('student_id', $studentId)
            ->first();

        if (!$data) {
            return response()->json([
                'message' => 'Data not found'
            ]);
        }

        $data->delete();

        return redirect()->back()->with('success', 'Mapping removed!');
    }



    public function parentStudentMapping(Request $request)
    {

        $validated = $request->validate([
            'student_admission_no' => ['required', 'digits_between:5,20'],
            'student_id'           => ['required', 'integer', 'exists:students,id'],
            'from_class_id'        => ['required', 'integer', 'exists:classes,id'],
            'from_section_id'      => ['required', 'integer', 'exists:sections,id'],
            'parent_id'            => ['required', 'integer', 'exists:parent_accounts,id'],
            'relation'             => ['required', 'string', 'max:255'],
        ]);
 
        $admissionNo = 'ADM' . $validated['student_admission_no'];
 
        if (!DB::table('students')->where('admission_no', $admissionNo)->exists()) {
            return back()->withErrors([
                'student_admission_no' => 'Student with this admission number does not exist.',
            ]);
        }
        $existing = ParentStudentMapping::where('parent_id', $validated['parent_id'])
            ->where('student_id', $validated['student_id'])
            ->exists();

        if ($existing) {
            throw ValidationException::withMessages([
                'student_id' => 'This student is already mapped to the selected parent.',
            ]);
        }
        
        $alreadyMapped= parentStudentMapping::where('student_id', $validated['student_id'])->exists();
        if($alreadyMapped){
            throw ValidationException::withMessages([
                'student_id'=> 'This student is already mapped to other parent.'
            ]);
        }
        if(ParentStudentMapping::create([
            'parent_id'=> $validated['parent_id'],
            'student_id' => $validated['student_id'],
            'relation'=> $validated['relation']
        ])){
            return redirect()->route('admin.parent.accounts.index')->with('success', 'Parent account mapped.');
        }
        
        
    }
}
