<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Customer\Prescription;
use App\Models\Customer\Order;


/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Customer\OrderItem>
 */
class OrderItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_id' => Order::factory(),
            'prescription_id' => Prescription::inRandomOrder()->first()->id,
        ];
    }
}
