<?php

namespace App\Http\Requests\Customer;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UpdateCustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $customerId = Auth::user()->customer->id ?? null;

        return [
            'id_number' => 'required|string|max:255|unique:customers,id_number,' . $customerId,
            'cellphone_number' => 'nullable|string|max:20',
            'allergies' => 'nullable|string',
            'state' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'street' => 'nullable|string|max:255',
            'house_number' => 'nullable|string|max:20',
            'postal_code' => 'nullable|string|max:20',
        ];
    }
}
