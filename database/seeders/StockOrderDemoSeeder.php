<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MedicationSupplier;
use App\Models\Medication\Medication;
use App\Models\Medication\DosageForm;
use App\Models\Medication\ActiveIngredient;
use App\Models\User;

class StockOrderDemoSeeder extends Seeder
{
    public function run()
    {
        // Create suppliers
        $supplier1 = MedicationSupplier::firstOrCreate([
            'name' => 'PharmaCorp Ltd'
        ], [
            'contact_person' => 'John Smith',
            'email' => 'orders@pharmacorp.com'
        ]);

        $supplier2 = MedicationSupplier::firstOrCreate([
            'name' => 'MediSupply Inc'
        ], [
            'contact_person' => 'Sarah Johnson',
            'email' => 'procurement@medisupply.com'
        ]);

        // Create dosage forms
        $tablet = DosageForm::firstOrCreate(['name' => 'Tablet']);
        $capsule = DosageForm::firstOrCreate(['name' => 'Capsule']);
        $syrup = DosageForm::firstOrCreate(['name' => 'Syrup']);

        // Create active ingredients
        $paracetamol = ActiveIngredient::firstOrCreate(['name' => 'Paracetamol']);
        $ibuprofen = ActiveIngredient::firstOrCreate(['name' => 'Ibuprofen']);
        $amoxicillin = ActiveIngredient::firstOrCreate(['name' => 'Amoxicillin']);

        // Create medications with different stock levels
        $medications = [
            [
                'name' => 'Paracetamol 500mg',
                'schedule' => '2',
                'quantity_on_hand' => 5, // Critical stock
                'reorder_level' => 20,
                'current_sale_price' => 15.50,
                'supplier_id' => $supplier1->id,
                'dosage_form_id' => $tablet->id,
                'active_ingredient' => $paracetamol
            ],
            [
                'name' => 'Ibuprofen 400mg',
                'schedule' => '2',
                'quantity_on_hand' => 0, // Out of stock
                'reorder_level' => 15,
                'current_sale_price' => 22.00,
                'supplier_id' => $supplier1->id,
                'dosage_form_id' => $tablet->id,
                'active_ingredient' => $ibuprofen
            ],
            [
                'name' => 'Amoxicillin 250mg',
                'schedule' => '4',
                'quantity_on_hand' => 25, // Low stock (reorder_level + 5)
                'reorder_level' => 20,
                'current_sale_price' => 45.75,
                'supplier_id' => $supplier2->id,
                'dosage_form_id' => $capsule->id,
                'active_ingredient' => $amoxicillin
            ],
            [
                'name' => 'Paracetamol Syrup 120mg/5ml',
                'schedule' => '2',
                'quantity_on_hand' => 100, // Good stock
                'reorder_level' => 30,
                'current_sale_price' => 28.90,
                'supplier_id' => $supplier1->id,
                'dosage_form_id' => $syrup->id,
                'active_ingredient' => $paracetamol
            ]
        ];

        foreach ($medications as $medData) {
            $activeIngredient = $medData['active_ingredient'];
            unset($medData['active_ingredient']);

            $medication = Medication::firstOrCreate(
                ['name' => $medData['name']],
                $medData
            );

            // Attach active ingredient
            $medication->activeIngredients()->syncWithoutDetaching([$activeIngredient->id => ['strength' => '1x']]);
        }

        // Create a manager user if one doesn't exist
        User::firstOrCreate([
            'email' => 'manager@eprescription.com'
        ], [
            'name' => 'Test Manager',
            'role' => 'manager',
            'password' => bcrypt('password'),
            'email_verified_at' => now()
        ]);

        $this->command->info('Demo stock data created successfully!');
        $this->command->info('You can now test the stock ordering system.');
        $this->command->info('Manager login: manager@eprescription.com / password');
    }
}
