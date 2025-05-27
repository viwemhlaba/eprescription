<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Customer\Order;
use App\Models\Customer;

class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
     protected $model = Order::class;
    public function definition(): array
    {
        return [
            'customer_id' => Customer::inRandomOrder()->first()?->id,
            'order_date' => now(),
            'status' => fake()->randomElement(['pending', 'approved', 'rejected', 'dispensed']),
            'total_amount_due' => 0,
        ];
    }
}
