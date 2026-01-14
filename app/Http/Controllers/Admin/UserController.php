<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::with('roles')->get();
        return Inertia::render('users/User', [
            'users' => $users
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $roles = Role::all();
        return Inertia::render('users/Create', ['roles' => $roles]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'user_name' => 'required|string',
            'user_email' => [
                'required',
                'email',
                Rule::unique('users', 'email')
            ],
            'user_password' => 'required|string|min:6',
            'role.*' => 'exists:roles,id'
        ]);
        $user = User::create([
            'name' => $request->user_name,
            'email' => $request->user_email,
            'password' => Hash::make($request->user_password),
        ]);
        $user->syncRoles($request->role);
        return redirect()->back()->with('success', 'Role created successfully!');
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
    public function edit($id)
    {
        $authUser = auth()->user();

        if ($authUser->hasRole('super admin')) {
            $user = User::with('roles')->findOrFail($id);

            return Inertia::render('users/EditUser', [
                'user' => $user,
                'allRoles' => Role::all(),
            ]);
        }

        abort(403, 'Unauthorized | You do not have pemission to perform this action.');
    }




    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {

        $authUser = auth()->user();
        if ($authUser->hasRole('super admin')) {
            $user = User::findOrFail($id);

            $request->validate([
                'user_name' => 'required|string',
                'user_email' => [
                    'required',
                    'email',
                    Rule::unique('users', 'email')->ignore($id),
                ],
                'user_password' => 'nullable|string|min:6',
                'role.*' => 'exists:roles,id'
            ]);

            $user->name = $request->user_name;
            $user->email = $request->user_email;

            if (!empty($request->user_password)) {
                $user->password = Hash::make($request->user_password);
            }

            $user->save();
            $user->syncRoles($request->role);

            return redirect()->back()->with('success', 'User updated successfully!');
        }
        abort(403, 'Unauthorized | You do not have pemission to perform this action.');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $authUser = auth()->user();
        $isSuperAdmin = $authUser->roles->pluck('name')->contains('super admin');
        if ($isSuperAdmin) {
            return "Hello ";
        }

        abort(403, 'Unauthorized | You do not have pemission to perform this action.');
    }
}
