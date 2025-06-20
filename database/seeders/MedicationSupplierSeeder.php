<?php

namespace Database\Seeders;

use App\Models\MedicationSupplier;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MedicationSupplierSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        MedicationSupplier::factory()->count(5)->create();
    }
}
