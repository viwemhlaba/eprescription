<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Customer\Prescription;
use App\Models\Medication\Medication;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Customer\PrescriptionItem>
 */
class PrescriptionItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'prescription_id' => Prescription::factory(),
            'medication_id' => Medication::inRandomOrder()->first()->id,
            'quantity' => fake()->numberBetween(1, 3),
            'instructions' => fake()->sentence(),
            'repeats' => fake()->numberBetween(0, 3),
            'price' => fake()->randomFloat(2, 20, 100),
        ];
    }
}
