<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Medication\DosageForm;

class DosageFormFactory extends Factory
{
    protected $model = DosageForm::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->randomElement(['Tablet', 'Capsule', 'Syrup', 'Injection']),
        ];
    }
}
