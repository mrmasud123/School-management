<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTeacherRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
           
            'first_name'        => ['required', 'string', 'max:100'],
            'last_name'         => ['required', 'string', 'max:100'],
            'gender'            => ['nullable', 'in:male,female,other'],
            'date_of_birth'     => ['nullable', 'date', 'before:today'],

           
            'joining_date'      => ['nullable', 'date'],
            'experience_years'  => ['nullable', 'integer', 'min:0', 'max:60'],
            'designation_id'    => ['nullable', 'integer'],
            'employment_type_id'=> ['nullable', 'integer'],

            'qualification_id'  => ['nullable', 'integer'],
            'specialization_ids'=> ['nullable', 'array'],
            'specialization_ids.*' => ['integer'],

            'email'             => ['nullable', 'email', 'max:255', 'unique:teacher_contacts,email'],
            'phone'             => ['required', 'string', 'unique:teacher_contacts,phone' ,'max:20'],
            'address'           => ['nullable', 'string', 'max:255'],
            
            'photo'             => ['nullable', 'image', 'max:2048'],
            'document_pdf'      => ['nullable', 'mimes:pdf', 'max:5120'],
        ];
    }

    public function messages(): array
    {
        return [
            'first_name.required' => 'First name is required.',
            'last_name.required'  => 'Last name is required.',
            'email.unique'        => 'This email is already in use.',
            'date_of_birth.before'=> 'Date of birth must be in the past.',
            'document_pdf.mimes'  => 'The document must be a PDF file.',
            'document_pdf.max'    => 'The document must be less than 5MB.',
        ];
    }

    /**
     * Data that should NOT be taken from request input
     */
    public function validatedData(): array
    {
        return collect($this->validated())
            ->except(['specialization_ids', 'email', 'phone', 'address'])
            ->toArray();
    }
}

