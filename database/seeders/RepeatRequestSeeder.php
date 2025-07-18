<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\Customer\Prescription;
use App\Models\Customer\PrescriptionItem;
use App\Models\User;
use App\Models\Medication\Medication;
use Carbon\Carbon;

class RepeatRequestSeeder extends Seeder
{
    public function run(): void
    {
        // Get a pharmacist and a customer
        $pharmacist = User::where('role', 'pharmacist')->first();
        $customer = User::where('role', 'customer')->first();
        $medication = Medication::first();

        // Create a prescription with repeats
        $prescription = Prescription::create([
            'user_id' => $customer->id,
            'status' => 'active',
            'name' => 'Test Repeat Prescription',
            'repeats_total' => 3,
            'repeats_used' => 1,
            'next_repeat_date' => Carbon::now()->subDays(2),
            'is_manual' => false,
            'doctor_id' => null,
            'patient_id_number' => '1234567890',
        ]);

        // Add a prescription item
        PrescriptionItem::create([
            'prescription_id' => $prescription->id,
            'medication_id' => $medication->id,
            'quantity' => 1,
            'instructions' => 'Take one daily',
            'repeats' => 3,
            'repeats_used' => 1,
            'price' => 100,
        ]);

        // Simulate a repeat request (could be a flag or a separate table in real app)
        DB::table('repeat_requests')->insert([
            'prescription_id' => $prescription->id,
            'customer_id' => $customer->id,
            'requested_at' => Carbon::now()->toDateTimeString(),
            'reason' => 'Need refill',
        ]);
    }
}
