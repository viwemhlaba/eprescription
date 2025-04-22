<?php

namespace App\Http\Requests\Customer;

use Illuminate\Foundation\Http\FormRequest;

class StoreCustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id_number' => 'required|string|max:255|unique:customers,id_number',
            'cellphone_number' => 'nullable|string|max:20',
            'allergies' => 'nullable|string',
            'state' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'street' => 'nullable|string|max:255',
            'house_number' => 'nullable|string|max:20',
            'postal_code' => 'nullable|string|max:20',
        ];
    }

    public function messages(): array
    {
        return [
            'id_number.required' => 'Your ID number is required.',
            'id_number.unique' => 'This ID number already exists in the system.',
        ];
    }
}
