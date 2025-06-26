<?php

namespace App\Http\Requests\Medication;

use Illuminate\Foundation\Http\FormRequest;

class SetMedicationStockRequest extends FormRequest
{    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return $this->user() && $this->user()->role === 'manager';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'quantity' => 'required|integer|min:0',
        ];
    }
}
