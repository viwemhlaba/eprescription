<?php

namespace Database\Seeders\Customer;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Customer\Prescription;
use App\Models\User;
use App\Models\Doctor;

class PrescriptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $customers = User::where('role', 'customer')->get();
         //$doctors = Doctor::all();

        foreach ($customers as $customer) {
            Prescription::factory()->count(2)->create([
                'user_id' => $customer->id,
                //'doctor_id' => $doctors->random()->id,
            ]);
        }
    }
}
