<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Customer;
use App\Models\Customer\Prescription;
use App\Models\Doctor;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UploadedPrescriptionSeeder extends Seeder
{
    /**
     * Seed uploaded prescriptions with only customer information.
     * This seeder creates prescriptions that are ready for pharmacist processing
     * without any pre-filled medication items.
     */
    public function run(): void
    {
        $this->command->info('Creating uploaded prescriptions with customer information only...');

        // Create sample doctors if they don't exist
        $doctors = [];
        for ($i = 1; $i <= 3; $i++) {
            $doctors[] = Doctor::firstOrCreate([
                'email' => "doctor{$i}@example.com"
            ], [
                'name' => "Doctor {$i}",
                'surname' => "Smith",
                'phone' => "+27 11 123 456{$i}",
                'practice_number' => "PR00{$i}",
                'specialization' => ['General Practitioner', 'Cardiologist', 'Dermatologist'][$i - 1],
            ]);
        }

        // Create sample customers if they don't exist
        $customers = [];
        for ($i = 1; $i <= 5; $i++) {
            /** @var User $user */
            $user = User::firstOrCreate([
                'email' => "uploadcustomer{$i}@example.com"
            ], [
                'name' => "Upload Customer {$i}",
                'surname' => "Johnson",
                'password' => Hash::make('password'),
                'role' => 'customer',
                'email_verified_at' => now(),
                'password_changed_at' => now(),
            ]);

            Customer::firstOrCreate([
                'user_id' => $user->getKey()
            ], [
                'id_number' => "98765432100{$i}",
                'cellphone_number' => "+27 82 123 456{$i}",
                'address_line_1' => "{$i}0 Test Street",
                'city' => 'Test City',
                'postal_code' => "200{$i}",
            ]);

            $customers[] = $user;
        }

        // Create uploaded prescriptions without medication items
        $prescriptionNames = [
            'Chronic Medication Refill',
            'Monthly Blood Pressure Treatment',
            'Diabetes Management Prescription',
            'Pain Management Medication',
            'Cardiovascular Treatment Plan',
            'Respiratory Therapy Prescription',
            'Allergy Treatment Protocol',
            'Antibiotic Course',
            'Mental Health Medication',
            'Vitamin and Supplement Plan',
        ];

        $deliveryMethods = ['pickup', 'dispense'];
        $statuses = ['pending', 'loaded']; // Only these statuses for uploaded prescriptions awaiting pharmacist processing

        for ($i = 0; $i < 15; $i++) {
            $customer = $customers[array_rand($customers)];
            $doctor = $doctors[array_rand($doctors)];
            $prescriptionName = $prescriptionNames[array_rand($prescriptionNames)];
            
            // Generate a fake file path to simulate uploaded prescription
            $fakeFilePath = 'prescriptions/uploaded_' . Str::random(10) . '.pdf';
            
            Prescription::create([
                'user_id' => $customer->getKey(),
                'doctor_id' => $doctor->getKey(),
                'name' => $prescriptionName . ' - ' . $customer->name,
                'status' => $statuses[array_rand($statuses)],
                'delivery_method' => $deliveryMethods[array_rand($deliveryMethods)],
                'repeats_total' => rand(0, 5),
                'repeats_used' => 0,
                'file_path' => $fakeFilePath, // Simulate uploaded file
                'is_manual' => false, // This is an uploaded prescription
                'patient_id_number' => "98765432100" . (($i % 5) + 1),
                'notes' => 'Uploaded prescription awaiting pharmacist processing and medication entry.',
                'created_at' => now()->subDays(rand(1, 30)),
                'updated_at' => now()->subDays(rand(0, 15)),
            ]);
        }

        $this->command->info('✅ Created 15 uploaded prescriptions with customer information only');
        $this->command->info('📝 These prescriptions have NO medication items and are ready for pharmacist processing');
        $this->command->info('🏥 5 sample customers created for upload testing');
        $this->command->info('👨‍⚕️ 3 sample doctors available for prescription assignment');
        
        $this->command->line('');
        $this->command->info('📋 Next steps:');
        $this->command->info('1. Go to /pharmacist/prescriptions');
        $this->command->info('2. Click "Load Prescription" on any uploaded prescription');
        $this->command->info('3. Add medications manually in the Pharmacist Processing section');
        $this->command->info('4. Total prescription cost will increment as you add medications');
        $this->command->info('5. Use "Approve" and "Cancel" buttons only');
    }
}
