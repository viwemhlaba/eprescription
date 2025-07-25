<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Medication\DosageForm;

class DosageFormSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $dosageForms = [
            'Tablet',
            'Capsule',
            'Syrup',
            'Suspension',
            'Cream',
            'Ointment',
            'Drops',
            'Injection',
            'Inhaler',
            'Spray',
            'Gel',
            'Patch',
            'Suppository',
            'Lotion',
            'Solution'
        ];

        foreach ($dosageForms as $form) {
            DosageForm::firstOrCreate([
                'name' => $form
            ]);
        }

        $this->command->info('Dosage forms seeded successfully!');
    }
}
