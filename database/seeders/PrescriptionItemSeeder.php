<?php

namespace Database\Seeders;

use App\Models\Customer\Prescription;
use App\Models\Customer\PrescriptionItem;
use App\Models\Medication\Medication;
use Illuminate\Database\Seeder;

class PrescriptionItemSeeder extends Seeder
{
    public function run(): void
    {
        $prescriptions = Prescription::all();
        $medications = Medication::all();

        foreach ($prescriptions as $prescription) {
            $meds = $medications->random(rand(1, 3));

            foreach ($meds as $med) {
                PrescriptionItem::factory()->create([
                    'prescription_id' => $prescription->id,
                    'medication_id' => $med->id,
                ]);
            }
        }
    }
}
