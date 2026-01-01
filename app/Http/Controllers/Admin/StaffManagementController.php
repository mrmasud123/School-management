<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStaffRequest;
use App\Http\Requests\UpdateStaffRequest;
use App\Http\Resources\StaffResource;
use App\Models\Staff;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class StaffManagementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $staffs = StaffResource::collection(Staff::with('media')->get())->resolve();
        return Inertia::render('staff/Index', ['staffs' => $staffs]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('staff/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStaffRequest $request)
    {
        $validated = $request->validated();

        DB::beginTransaction();

        try {
            $staff = Staff::create([
                'staff_code'        => 'TEMP',
                'first_name'        => $validated['first_name'],
                'last_name'         => $validated['last_name'],
                'gender'            => $validated['gender'] ?? null,
                'date_of_birth'     => $validated['date_of_birth'],
                'phone'             => $validated['phone'] ?? null,
                'email'             => $validated['email'],
                'address'           => $validated['address'],
                'joining_date'      => $validated['joining_date'],
                'employment_status' => $validated['employment_status'],
                'is_active'         => true,
            ]);

            $staff->update([
                'staff_code' => 'STAFF-' . now()->year . '-' . str_pad($staff->id, 4, '0', STR_PAD_LEFT),
            ]);


            if ($request->hasFile('photo')) {
                $staff->addMediaFromRequest('photo')
                    ->usingFileName(
                        'staff_photo_' . $staff->id . '.' . $request->file('photo')->extension()
                    )
                    ->toMediaCollection('staff');
            }

            DB::commit();

            return redirect()
                ->route('admin.staff.index')
                ->with('success', 'Staff added successfully!');
        } catch (\Throwable $e) {
            DB::rollBack();

            return back()
                ->withInput()
                ->withErrors(['error' => $e->getMessage()]);
        }
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
        $staff = Staff::with('media')->find($id);
        $staff->photo_url = $staff->getFirstMediaUrl('staff') ?: null;

        return Inertia::render('staff/Edit', ['staff' => $staff]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStaffRequest $request, string $id)
    {
        $validated = $request->validated();

        DB::beginTransaction();

        try {

            $staff = Staff::findOrFail($id);
            $staff->update([
                'first_name'        => $validated['first_name'],
                'last_name'         => $validated['last_name'],
                'gender'            => $validated['gender'] ?? null,
                'date_of_birth'     => $validated['date_of_birth'],
                'phone'             => $validated['phone'] ?? null,
                'email'             => $validated['email'],
                'address'           => $validated['address'],
                'joining_date'      => $validated['joining_date'],
                'employment_status' => $validated['employment_status'],
                'is_active'         => $validated['is_active'],
            ]);

            if ($request->hasFile('photo')) {
                $staff->clearMediaCollection('staff');

                $staff->addMediaFromRequest('photo')
                    ->usingFileName('staff_photo_' . $staff->id . '.' . $request->file('photo')->extension())
                    ->toMediaCollection('staff');
            }
            DB::commit();

            return redirect()
                ->route('admin.staff.index')
                ->with('success', 'Staff updated successfully!');
        } catch (\Throwable $e) {
            DB::rollBack();

            return back()
                ->withInput()
                ->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Staff $staff)
    {
        $staff->delete();

        return redirect()->back()->with('success', 'Staff deleted.');
    }

    public function trashed()
    {
        $staffs = StaffResource::collection(Staff::onlyTrashed()->with('media')->orderBy('deleted_at', 'desc')->get())->resolve();
        return Inertia::render('staff/Trashed', compact('staffs'));
    }

    public function restore($staff)
    {
        $staff = Staff::withTrashed()->findOrFail($staff)->restore();
        return redirect()->back()->with('success', 'Staff restored.');
        
    }
    
    public function forceDelete($id)
    {
        Staff::onlyTrashed()->findOrFail($id)->forceDelete();

        return redirect()->back()->with('success', 'Staff permanently deleted.');
    }
}
