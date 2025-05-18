<?php

namespace Database\Seeders;

use App\Models\Medication\Medication;
use Illuminate\Database\Seeder;

class MedicationSeeder extends Seeder
{

    public function run(): void
    {
        Medication::factory()->count(20)->create();
    }
}
