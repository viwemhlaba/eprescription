<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Allergy;

class AllergySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $allergies = ['Penicillin', 'Sulfa', 'Latex', 'Aspirin', 'Ibuprofen'];

        foreach ($allergies as $name) {
            Allergy::create(['name' => $name]);
        }
    }
}
