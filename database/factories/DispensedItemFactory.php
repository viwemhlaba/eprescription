<?php

namespace Database\Factories;

use App\Models\DispensedItem;
use App\Models\Customer\Prescription;
use App\Models\Customer\PrescriptionItem;
use App\Models\Medication\Medication;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DispensedItem>
 */
class DispensedItemFactory extends Factory
{
    protected $model = DispensedItem::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $quantity = fake()->numberBetween(1, 10);
        $unitPrice = fake()->randomFloat(2, 5, 500);
        $totalCost = $quantity * $unitPrice;

        return [
            'prescription_id' => Prescription::factory(),
            'prescription_item_id' => PrescriptionItem::factory(),
            'medication_id' => Medication::factory(),
            'pharmacist_id' => User::factory()->create(['role' => 'pharmacist']),
            'quantity_dispensed' => $quantity,
            'cost' => $totalCost,
            'notes' => fake()->optional(0.3)->sentence(),
            'dispensed_at' => fake()->dateTimeBetween('-30 days', 'now'),
        ];
    }
}
