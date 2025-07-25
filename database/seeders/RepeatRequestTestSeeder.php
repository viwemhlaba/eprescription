<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Customer\Prescription;
use App\Models\Customer\PrescriptionItem;
use App\Models\Medication\Medication;
use App\Models\Doctor;
use Carbon\Carbon;

class RepeatRequestTestSeeder extends Seeder
{
    public function run(): void
    {
        // Find existing customer and doctor
        $customer = User::where('role', 'customer')->first();
        $doctor = Doctor::first();
        $medications = Medication::take(2)->get();

        if (!$customer || !$doctor || $medications->count() < 2) {
            $this->command->warn('Missing required data. Make sure you have customers, doctors, and medications.');
            return;
        }

        // Create 3 prescriptions with repeat requests pending
        for ($i = 1; $i <= 3; $i++) {
            $prescription = Prescription::create([
                'user_id' => $customer->id,
                'doctor_id' => $doctor->id,
                'name' => "Repeat Request Prescription {$i}",
                'status' => 'repeat_pending', // This is the key - setting status to repeat_pending
                'delivery_method' => 'pickup',
                'repeats_total' => 3,
                'repeats_used' => $i % 2, // Some have used repeats, some don't
                'next_repeat_date' => now()->subDays(rand(1, 7))->format('Y-m-d'),
                'is_manual' => false,
                'patient_id_number' => '9876543210',
                'created_at' => now()->subDays(rand(10, 30)),
                'updated_at' => now()->subDays(rand(1, 7)), // Recently updated (when repeat was requested)
            ]);

            // Add prescription items
            foreach ($medications as $medication) {
                PrescriptionItem::create([
                    'prescription_id' => $prescription->id,
                    'medication_id' => $medication->id,
                    'quantity' => rand(15, 30),
                    'instructions' => 'Take as prescribed',
                    'price' => $medication->current_sale_price * rand(15, 30),
                    'repeats' => 3,
                    'repeats_used' => $i % 2, // Match prescription repeat usage
                ]);
            }
        }

        $this->command->info('Created 3 prescriptions with repeat requests pending');
        $this->command->info('These will appear in the /pharmacist/repeats page');
    }
}
