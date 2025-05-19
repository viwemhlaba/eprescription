<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Customer\Prescription;
use App\Models\Medication\Medication;
use App\Models\Customer\PrescriptionItem;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Customer\PrescriptionItem>
 */
class PrescriptionItemFactory extends Factory
{
    protected $model = PrescriptionItem::class;

    public function definition(): array
    {
        return [
            'prescription_id' => Prescription::factory(),
            'medication_id' => Medication::inRandomOrder()->first()->id,
            'quantity' => $this->faker->numberBetween(1, 3),
            'instructions' => $this->faker->sentence(),
            'repeats' => $this->faker->numberBetween(0, 3),
            'price' => $this->faker->randomFloat(2, 20, 100),
        ];
    }
}
