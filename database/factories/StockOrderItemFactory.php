<?php

namespace Database\Factories;

use App\Models\Medication\Medication;
use App\Models\StockOrder;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \\Illuminate\\Database\\Eloquent\\Factories\\Factory<\\App\\Models\\StockOrderItem>
 */
class StockOrderItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'stock_order_id' => StockOrder::factory(),
            'medication_id' => Medication::factory(),
            'quantity' => $this->faker->numberBetween(1, 100),
        ];
    }
}
