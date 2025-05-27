<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Customer\OrderItem;
use App\Models\Customer\Prescription;
use App\Models\Customer\Order;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Customer\OrderItem>
 */
class OrderItemFactory extends Factory
{
    /** ✅ Binds factory to correct model */
    protected $model = OrderItem::class;

    public function definition(): array
    {
        return [
            'order_id' => Order::factory(),
            'prescription_id' => Prescription::inRandomOrder()->first()?->id,
        ];
    }
}
