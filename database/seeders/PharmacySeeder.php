<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Pharmacy;
use App\Models\PharmacistProfile;

class PharmacySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a sample pharmacy
        $pharmacy = Pharmacy::create([
            'name' => 'Health Plus Pharmacy',
            'health_council_registration_number' => 'HCP123456',
            'physical_address' => '123 Main Street, Cityville, Province 12345',
            'contact_number' => '+27 11 123 4567',
            'email' => 'info@healthplus.co.za',
            'website_url' => 'https://healthplus.co.za'
        ]);

        // Assign the pharmacy to existing pharmacist profiles
        $pharmacistProfiles = PharmacistProfile::all();
        foreach ($pharmacistProfiles as $profile) {
            $profile->update(['pharmacy_id' => $pharmacy->id]);
        }

        $this->command->info('Created pharmacy and assigned to pharmacist profiles.');
    }
}
