<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreStaffRequest extends FormRequest
{
    public function authorize(): bool
    {
        // RBAC already exists, so allow here
        return true;
    }

    public function rules(): array
    {
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
                Rule::unique('staffs','phone')
            ],

            'email' => [
                'nullable',
                'email',
                'max:150',
                Rule::unique('staffs','email')
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
        ];
    }

    public function messages(): array
    {
        return [
            'staff_code.required' => 'Staff code is required.',
            'staff_code.unique' => 'Staff code already exists.',

            'first_name.required' => 'First name is required.',

            'joining_date.required' => 'Joining date is required.',

            'employment_status.in' => 'Invalid employment status selected.',

            'photo.image' => 'Uploaded file must be an image.',
            'photo.max' => 'Photo size must not exceed 2MB.',
        ];
    }

    // protected function prepareForValidation(): void
    // {
    //     $this->merge([
    //         // Force staff type (support only)
    //         'staff_type' => 'support',
    //     ]);
    // }
}
