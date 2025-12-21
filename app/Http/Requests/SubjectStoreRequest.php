<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SubjectStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|unique:subjects,name',
            'status' => 'nullable|in:0,1',
        ];
    }


    public function messages()
    {
        return [
            'name.required' => 'Subject Name is required',
            'name.unique' => 'Subject Name is already picked. choose another'
        ];
    }
}
