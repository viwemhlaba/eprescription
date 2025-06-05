<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Medication\ActiveIngredient;
use App\Models\Medication\DosageForm;
use App\Models\Medication\Medication;

class MedicationFactory extends Factory
{
    protected $model = Medication::class;

    public function definition(): array
    {
        return [
            'name' => fake()->unique()->word(),
            'active_ingredient_id' => ActiveIngredient::factory(),
            'dosage_form_id' => DosageForm::factory(),
            'schedule' => 'Schedule ' . fake()->numberBetween(0, 6),
            'current_sale_price' => fake()->randomFloat(2, 20, 200),
        ];
    }
}
