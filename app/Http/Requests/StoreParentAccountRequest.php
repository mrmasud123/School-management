<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreParentAccountRequest extends FormRequest
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
            "first_name" => 'required|string',
            "last_name"=> 'required','string',
            'phone' => 'required|numeric|starts_with:01|unique:parent_accounts,phone',
            "email"=>'required|email|unique:parent_accounts,email',
            "nid" => 'nullable|numeric|unique:parent_accounts,nid',
            "address" => 'nullable'
        ];
    }
}
