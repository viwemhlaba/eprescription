<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Customer\Order;
use App\Models\Customer\OrderItem;

class CustomerOrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Order::factory()
        ->count(10)
        ->has(OrderItem::factory()->count(2), 'items')
        ->create();
    }
}
