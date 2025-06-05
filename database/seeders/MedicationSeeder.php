<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Medication\Medication;
use App\Models\Medication\DosageForm;
use App\Models\Medication\ActiveIngredient;

class MedicationSeeder extends Seeder
{
    public function run(): void
    {
        $dosageForm = DosageForm::factory()->create();

        // Create 10 medications
        Medication::factory()
            ->count(10)
            ->create([
                'dosage_form_id' => $dosageForm->id,
            ])
            ->each(function ($medication) {
                // Attach 1–3 random active ingredients
                $ingredients = ActiveIngredient::inRandomOrder()->limit(rand(1, 3))->pluck('id');
                $medication->activeIngredients()->attach($ingredients);
            });
    }
}
