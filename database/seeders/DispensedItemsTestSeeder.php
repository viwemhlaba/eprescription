<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\DispensedItem;
use App\Models\User;
use App\Models\Customer\Prescription;
use App\Models\Customer\PrescriptionItem;
use App\Models\Medication\Medication;
use App\Models\Doctor;
use Carbon\Carbon;

class DispensedItemsTestSeeder extends Seeder
{
    public function run(): void
    {
        // Find or create a pharmacist user
        $pharmacist = User::where('role', 'pharmacist')->first();
        if (!$pharmacist) {
            $pharmacist = User::create([
                'name' => 'Test',
                'surname' => 'Pharmacist',
                'email' => 'pharmacist@test.com',
                'password' => bcrypt('password'),
                'role' => 'pharmacist',
                'email_verified_at' => now(),
            ]);
        }

        // Find or create a customer user
        $customer = User::where('role', 'customer')->first();
        if (!$customer) {
            $customer = User::create([
                'name' => 'Test',
                'surname' => 'Customer',
                'email' => 'customer@test.com',
                'password' => bcrypt('password'),
                'role' => 'customer',
                'email_verified_at' => now(),
            ]);
        }

        // Find or create a doctor
        $doctor = Doctor::first();
        if (!$doctor) {
            $doctor = Doctor::create([
                'name' => 'Dr. Test',
                'surname' => 'Doctor',
                'practice_number' => 'TEST001',
                'specialization' => 'General Practice',
                'phone_number' => '0123456789',
                'email' => 'doctor@test.com',
            ]);
        }

        // Find or create some medications
        $medications = Medication::take(3)->get();
        if ($medications->count() < 3) {
            $this->command->warn('Not enough medications in database. Please run medication seeders first.');
            return;
        }

        // Create test prescriptions with dispensed items
        for ($i = 1; $i <= 5; $i++) {
            // Create prescription
            $prescription = Prescription::create([
                'user_id' => $customer->id,
                'doctor_id' => $doctor->id,
                'name' => "Test Prescription {$i}",
                'status' => 'approved',
                'delivery_method' => 'pickup',
                'repeats_total' => 3,
                'repeats_used' => 1,
                'is_manual' => true,
                'patient_id_number' => '1234567890',
                'created_at' => now()->subDays(rand(1, 30)),
                'updated_at' => now()->subDays(rand(1, 30)),
            ]);

            // Create prescription items
            foreach ($medications->take(rand(1, 2)) as $medication) {
                $prescriptionItem = PrescriptionItem::create([
                    'prescription_id' => $prescription->id,
                    'medication_id' => $medication->id,
                    'quantity' => rand(10, 30),
                    'instructions' => 'Take as directed',
                    'price' => $medication->current_sale_price * rand(10, 30),
                    'repeats' => 3,
                    'repeats_used' => 1,
                ]);

                // Create dispensed item
                DispensedItem::create([
                    'prescription_id' => $prescription->id,
                    'prescription_item_id' => $prescriptionItem->id,
                    'medication_id' => $medication->id,
                    'pharmacist_id' => $pharmacist->id,
                    'quantity_dispensed' => $prescriptionItem->quantity,
                    'cost' => $prescriptionItem->price,
                    'dispensed_at' => now()->subDays(rand(1, 15)),
                    'notes' => "Dispensed by test seeder for prescription {$i}",
                ]);
            }
        }

        $this->command->info('Created 5 test prescriptions with dispensed items for pharmacist: ' . $pharmacist->email);
        $this->command->info('Total dispensed items: ' . DispensedItem::count());
    }
}
