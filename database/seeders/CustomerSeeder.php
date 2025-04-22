<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Customer;
use App\Models\User;

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()
            ->count(10)
            ->has(Customer::factory())
            ->create([
                'role' => 'customer',
            ]);
    }
}