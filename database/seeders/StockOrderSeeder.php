<?php

namespace Database\Seeders;

use App\Models\StockOrder;
use App\Models\StockOrderItem;
use Illuminate\Database\Seeder;

class StockOrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 0; $i < 10; $i++) {
            StockOrder::factory()
                ->has(StockOrderItem::factory()->count(3), 'items')
                ->create();
        }
    }
}
