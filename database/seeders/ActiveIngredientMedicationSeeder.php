<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Medication\Medication;
use App\Models\Medication\ActiveIngredient;

class ActiveIngredientMedicationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ingredients = ActiveIngredient::all();

        Medication::all()->each(function ($medication) use ($ingredients) {
            $attachData = [];
            foreach ($ingredients->random(rand(1, 3)) as $ingredient) {
                $attachData[$ingredient->id] = ['strength' => fake()->randomElement(['250mg', '500mg', '1g', '5mg'])];
            }
            $medication->activeIngredients()->sync($attachData);
        });
    }
}
