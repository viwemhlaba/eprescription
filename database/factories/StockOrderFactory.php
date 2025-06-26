<?php

namespace Database\Factories;

use App\Models\MedicationSupplier;
use App\Models\StockOrder;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \\Illuminate\\Database\\Eloquent\\Factories\\Factory<\\App\\Models\\StockOrder>
 */
class StockOrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_number' => StockOrder::generateOrderNumber(),
            'supplier_id' => MedicationSupplier::factory(),
            'status' => $this->faker->randomElement(['Pending', 'Received']),
        ];
    }
}
