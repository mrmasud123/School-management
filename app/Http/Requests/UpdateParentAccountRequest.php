<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateParentAccountRequest extends FormRequest
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
        $id = $this->route('parent_account');
        return [
            'first_name' => ['required', 'string'],
            'last_name' => ['required', 'string'],
            'phone' => [
                'required',
                'numeric',
                'starts_with:01',
                Rule::unique('parent_accounts', 'phone')->ignore($id)
            ],
            'email' => [
                'required',
                'email',
                Rule::unique('parent_accounts', 'email')->ignore($id)
            ],
            'nid' => [
                'nullable',
                'numeric',
                Rule::unique('parent_accounts', 'nid')->ignore($id)
            ],
            'address' => ['nullable'],
            'is_active' => 'in:0,1'
        ];
    }
}
