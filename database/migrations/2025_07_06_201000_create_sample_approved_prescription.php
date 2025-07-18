<?php

use Illuminate\Database\Migrations\Migration;
use App\Models\Customer\Prescription;
use App\Models\Customer\PrescriptionItem;
use App\Models\Medication\Medication;
use App\Models\Doctor;
use App\Models\User;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Create a sample approved prescription for dispensing
        $customer = User::where('role', 'customer')->with('customer')->first();
        $doctor = Doctor::first();
        $medication = Medication::first();
        
        if ($customer && $doctor && $medication && $customer->customer) {
            $prescription = Prescription::create([
                'user_id' => $customer->id,
                'doctor_id' => $doctor->id,
                'name' => 'Sample Approved Prescription for Dispensing',
                'status' => 'approved',
                'repeats_total' => 3,
                'repeats_used' => 0,
                'delivery_method' => 'pickup',
                'is_manual' => true,
                'patient_id_number' => $customer->customer->id_number,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            PrescriptionItem::create([
                'prescription_id' => $prescription->id,
                'medication_id' => $medication->id,
                'quantity' => 30,
                'instructions' => 'Take one tablet daily after meals',
                'price' => $medication->current_sale_price * 30,
                'repeats' => 3,
                'repeats_used' => 0,
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove the test prescription
        Prescription::where('name', 'Sample Approved Prescription for Dispensing')->delete();
    }
};
