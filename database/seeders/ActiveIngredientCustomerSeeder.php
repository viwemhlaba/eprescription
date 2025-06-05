<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Medication\ActiveIngredient;

class ActiveIngredientCustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ingredients = ActiveIngredient::all();

        User::where('role', 'customer')->each(function ($customer) use ($ingredients) {
            $customer->activeIngredients()->sync(
                $ingredients->random(rand(0, 2))->pluck('id')->toArray()
            );
        });
    }
}
