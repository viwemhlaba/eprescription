<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Medication\ActiveIngredient;

class ActiveIngredientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ingredients = ['Amoxicillin', 'Clavulanic Acid', 'Ibuprofen', 'Paracetamol', 'Ciprofloxacin'];

        foreach ($ingredients as $name) {
            ActiveIngredient::create(['name' => $name]);
        }
    }
}
