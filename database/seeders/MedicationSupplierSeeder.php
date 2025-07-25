<?php

namespace Database\Seeders;

use App\Models\MedicationSupplier;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MedicationSupplierSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $suppliers = [
            [
                'name' => 'MediCorp Pharmaceuticals',
                'contact_person' => 'John Smith',
                'email' => 'john.smith@medicorp.com',
            ],
            [
                'name' => 'HealthPlus Suppliers',
                'contact_person' => 'Sarah Johnson',
                'email' => 'sarah.johnson@healthplus.com',
            ],
            [
                'name' => 'Global Medical Supply',
                'contact_person' => 'Michael Brown',
                'email' => 'michael.brown@globalmed.com',
            ],
            [
                'name' => 'PharmaCare Distribution',
                'contact_person' => 'Emily Davis',
                'email' => 'emily.davis@pharmacare.com',
            ],
            [
                'name' => 'Medical Solutions Inc',
                'contact_person' => 'David Wilson',
                'email' => 'david.wilson@medsolutions.com',
            ],
        ];

        foreach ($suppliers as $supplier) {
            MedicationSupplier::create($supplier);
        }

        $this->command->info('Medication suppliers seeded successfully!');
    }
}
