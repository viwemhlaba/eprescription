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
        $pharmacies = [
            [
                'name' => 'Health Plus Pharmacy',
                'health_council_registration_number' => 'HCP123456',
                'physical_address' => '123 Main Street, Cityville, Province 12345',
                'contact_number' => '+27 11 123 4567',
                'email' => 'info@healthplus.co.za',
                'website_url' => 'https://healthplus.co.za'
            ],
            [
                'name' => 'Wellness Pharmacy',
                'health_council_registration_number' => 'HCP789012',
                'physical_address' => '456 Oak Avenue, Townsburg, Province 67890',
                'contact_number' => '+27 21 987 6543',
                'email' => 'contact@wellness-pharmacy.co.za',
                'website_url' => 'https://wellness-pharmacy.co.za'
            ],
            [
                'name' => 'Community Care Pharmacy',
                'health_council_registration_number' => 'HCP345678',
                'physical_address' => '789 Pine Road, Villagetown, Province 34567',
                'contact_number' => '+27 31 555 1234',
                'email' => 'hello@communitycare.co.za',
                'website_url' => 'https://communitycare.co.za'
            ],
            [
                'name' => 'MediCare Express',
                'health_council_registration_number' => 'HCP901234',
                'physical_address' => '321 Elm Street, Suburbia, Province 90123',
                'contact_number' => '+27 41 777 8888',
                'email' => 'service@medicare-express.co.za',
                'website_url' => 'https://medicare-express.co.za'
            ]
        ];

        foreach ($pharmacies as $pharmacyData) {
            $pharmacy = Pharmacy::firstOrCreate([
                'name' => $pharmacyData['name']
            ], $pharmacyData);

            $this->command->info("Created pharmacy: {$pharmacy->name}");
        }

        // Assign pharmacies to existing pharmacist profiles if they exist
        $pharmacistProfiles = PharmacistProfile::whereNull('pharmacy_id')->get();
        $createdPharmacies = Pharmacy::all();
        
        foreach ($pharmacistProfiles as $profile) {
            $randomPharmacy = $createdPharmacies->random();
            $profile->update(['pharmacy_id' => $randomPharmacy->id]);
            $this->command->info("Assigned pharmacist profile to {$randomPharmacy->name}");
        }

        $this->command->info('Pharmacies seeded successfully!');
    }
}
