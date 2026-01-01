<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class UpdateStaffRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $staffId = $this->route('staff_management') ?? $this->route('staff_management');

        return [
            'first_name' => [
                'required',
                'string',
                'max:100',
            ],

            'last_name' => [
                'nullable',
                'string',
                'max:100',
            ],

            'gender' => [
                'nullable',
                Rule::in(['male', 'female', 'other']),
            ],

            'date_of_birth' => [
                'nullable',
                'date',
                'before:today',
            ],

            'joining_date' => [
                'required',
                'date',
            ],

            'employment_status' => [
                'required',
                Rule::in(['probation', 'permanent', 'contract', 'resigned']),
            ],

            'phone' => [
                'required',
                'string',
                'max:20',
                Rule::unique('staffs', 'phone')->ignore($staffId),
            ],

            'email' => [
                'nullable',
                'email',
                'max:150',
                function ($attribute, $value, $fail) use ($staffId) {
                    $existsInStaffs = DB::table('staffs')
                        ->where('email', $value)
                        ->where('id', '!=', $staffId)
                        ->exists();
                    $existsInUsers = DB::table('users')->where('email', $value)->exists();
                    $existsInTeachers = DB::table('teacher_contacts')->where('email', $value)->exists();
                    
                    if($existsInStaffs || $existsInTeachers || $existsInUsers){
                        $fail("This email is associated with another account.");
                    }
                }
            ],

            'address' => [
                'nullable',
                'string',
                'max:1000',
            ],

            'photo' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
            ],

            'is_active' => 'boolean'
        ];
    }

    public function messages(): array
    {
        return [
            'first_name.required' => 'First name is required.',
            'joining_date.required' => 'Joining date is required.',
            'employment_status.in' => 'Invalid employment status selected.',

            'phone.unique' => 'This phone number is already in use.',
            'email.unique' => 'This email address is already in use.',

            'photo.image' => 'Uploaded file must be an image.',
            'photo.max' => 'Photo size must not exceed 2MB.',
        ];
    }
}
