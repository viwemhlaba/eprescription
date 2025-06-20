<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMedicationRequest extends FormRequest
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
            'name' => 'required|string|unique:medications,name,' . $this->route('medication'),
            'dosage_form_id' => 'required|exists:dosage_forms,id',
            'schedule' => 'required|integer|min:0|max:6',
            'current_sale_price' => 'required|numeric|min:0',
            'supplier_id' => 'required|exists:medication_suppliers,id',
            'reorder_level' => 'required|integer|min:0',
            'quantity_on_hand' => 'required|integer|min:0',
            'active_ingredients' => 'required|array|min:1',
            'active_ingredients.*.id' => 'required|exists:active_ingredients,id',
            'active_ingredients.*.strength' => 'required|string',
        ];
    }
}
