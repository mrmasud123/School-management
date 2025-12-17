<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StudentAdmissionUpdateRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $id = $this->route('id')
            ?? $this->route('student')
            ?? $this->student->id
            ?? null;

        return [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'dob' => 'required|date|before:today',
            'gender' => ['required', Rule::in(['male','female','other'])],
            'blood_group' => 'nullable|string|max:3',
            'nationality' => 'required|string|max:255',
            'religion' => 'nullable|string|max:255',
            'photo' => 'nullable|image|mimes:jpeg,jpg,png,gif|max:2048',

            'email' => [
                'nullable',
                'email',
                Rule::unique('students','email')->ignore($id)
            ],

            'current_address' => 'required|string',

            'class_id' => 'required|exists:classes,id',
            'section_id' => 'required|exists:sections,id',
            'previous_school' => 'nullable|string|max:255',
            'admission_date' => 'required|date|before_or_equal:today',
            'academic_year' => ['required','regex:/^\d{4}-\d{4}$/'],

            'father_name' => 'required|string|max:255',
            'father_occupation' => 'nullable|string|max:255',
            'mother_name' => 'required|string|max:255',
            'mother_occupation' => 'nullable|string|max:255',

            'guardian_relation' => 'required|string|max:100',

            'guardian_phone' => [
                'required',
                'regex:/^[0-9]{11}$/',
                Rule::unique('students','guardian_phone')->ignore($id)
            ],

            'status' => ['required', Rule::in(['pending','approved','rejected'])],

            // THIS WAS MISSING!
            'admission_no' => [
                'nullable',
                'string',
                Rule::unique('students','admission_no')->ignore($id)
            ],
        ];
    }

    public function messages()
    {
        return [
            'first_name.required' => 'Student First Name is required',
            'last_name.required' => 'Student Last Name is required',
            'dob.required' => 'Date of Birth is required',
            'dob.before' => 'Date of birth must be before today',
            'gender.required' => 'Gender is required',
            'gender.in' => 'Gender must be male, female, or other',
            'blood_group.max' => 'Blood Group must not exceed 3 characters',
            'email.email' => 'Email must be a valid email address',
            'email.unique' => 'This email is already taken',
            'guardian_phone.required' => 'Guardian phone is required',
            'guardian_phone.unique' => 'This guardian phone is already taken',
            'class_id.required' => 'Class is required',
            'class_id.exists' => 'Selected class is invalid',
            'section_id.required' => 'Section is required',
            'section_id.exists' => 'Selected section is invalid',
            'admission_date.required' => 'Admission date is required',
            'admission_date.before_or_equal' => 'Admission date cannot be in the future',
            'academic_year.required' => 'Academic year is required',
            'academic_year.regex' => 'Academic year must be in the format YYYY-YYYY',
            'status.required' => 'Status is required',
            'status.in' => 'Status must be pending, approved, or rejected',
            'admission_no.unique' => 'This admission number already exists',

        ];
    }
}


