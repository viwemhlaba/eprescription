<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Pharmacist;
use App\Models\PharmacistProfile;
use App\Models\Pharmacy;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class PharmacistSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get or create pharmacist role
        $pharmacistRole = Role::firstOrCreate(['name' => 'pharmacist']);
        
        // Get pharmacy for assignment
        $pharmacy = Pharmacy::first();
        
        if (!$pharmacy) {
            $this->command->warn('No pharmacy found. Creating a default pharmacy...');
            $pharmacy = Pharmacy::create([
                'name' => 'Default Pharmacy',
                'health_council_registration_number' => 'HCP000000',
                'physical_address' => '123 Default Street, Default City, Default Province 00000',
                'contact_number' => '+27 11 000 0000',
                'email' => 'default@pharmacy.co.za',
                'website_url' => 'https://defaultpharmacy.co.za'
            ]);
        }

        // Create sample pharmacist users
        $pharmacists = [
            [
                'name' => 'Dr. Sarah',
                'surname' => 'Johnson',
                'email' => 'sarah.johnson@pharmacy.com',
                'id_number' => '8501015678901',
                'cellphone_number' => '+27821234567',
                'health_council_registration_number' => 'SAPC12345'
            ],
            [
                'name' => 'Dr. Michael',
                'surname' => 'Chen',
                'email' => 'michael.chen@pharmacy.com',
                'id_number' => '7809123456789',
                'cellphone_number' => '+27829876543',
                'health_council_registration_number' => 'SAPC67890'
            ],
            [
                'name' => 'Dr. Nomsa',
                'surname' => 'Mthembu',
                'email' => 'nomsa.mthembu@pharmacy.com',
                'id_number' => '9203087654321',
                'cellphone_number' => '+27835551234',
                'health_council_registration_number' => 'SAPC54321'
            ]
        ];

        foreach ($pharmacists as $pharmacistData) {
            // Create the user
            $user = User::firstOrCreate([
                'email' => $pharmacistData['email']
            ], [
                'name' => $pharmacistData['name'],
                'surname' => $pharmacistData['surname'],
                'password' => Hash::make('password'),
                'role' => 'pharmacist',
                'email_verified_at' => now(),
            ]);

            // Assign role using Spatie
            $user->assignRole($pharmacistRole);

            // Create pharmacist profile
            $pharmacist = Pharmacist::firstOrCreate([
                'user_id' => $user->id
            ], [
                'id_number' => $pharmacistData['id_number'],
                'cellphone_number' => $pharmacistData['cellphone_number'],
                'health_council_registration_number' => $pharmacistData['health_council_registration_number'],
            ]);

            // Create pharmacist profile for the pharmacy
            PharmacistProfile::firstOrCreate([
                'user_id' => $user->id
            ], [
                'pharmacy_id' => $pharmacy->id,
                'profile_completed' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $this->command->info("Created pharmacist: {$user->name} {$user->surname}");
        }

        $this->command->info('Pharmacist users and profiles seeded successfully!');
    }
}
