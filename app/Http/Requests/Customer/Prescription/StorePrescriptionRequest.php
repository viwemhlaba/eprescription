<?php

namespace App\Http\Requests\Customer\Prescription;

use Illuminate\Foundation\Http\FormRequest;


class StorePrescriptionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'prescription_file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'delivery_method' => 'required|string|in:pickup,dispense',
        ];
    }
}
