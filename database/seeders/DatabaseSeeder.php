<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Database\Seeders\CustomerSeeder;
use Database\Seeders\Customer\PrescriptionSeeder;
use Database\Seeders\DoctorSeeder;
use Database\Seeders\MedicationSeeder;
use Database\Seeders\PrescriptionItemSeeder;
use Database\Seeders\UserSeeder; // Add this line
use Database\Seeders\MedicationSupplierSeeder; // Add this line
use Database\Seeders\StockOrderSeeder; // Add this line
use Database\Seeders\RoleSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $this->call([
            RoleSeeder::class,
            UserSeeder::class, // Add this line
            DoctorSeeder::class,
            MedicationSeeder::class,
            CustomerSeeder::class,
            PrescriptionSeeder::class,
            PrescriptionItemSeeder::class,
            StockOrderSeeder::class,
        ]);
    }
}
