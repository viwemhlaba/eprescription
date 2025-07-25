<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Customer;
use App\Models\Medication\Medication;
use App\Models\Medication\ActiveIngredient;
use App\Models\Medication\DosageForm;
use App\Models\MedicationSupplier;
use App\Models\Customer\Prescription;
use App\Models\Customer\PrescriptionItem;
use App\Models\DispensedItem;
use App\Models\StockOrder;
use App\Models\StockOrderItem;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class ComprehensiveDemoSeeder extends Seeder
{
    /**
     * Run the database seeds for a comprehensive demo
     */
    public function run(): void
    {
        $this->command->info('🚀 Creating comprehensive demo data...');

        // Create additional medications with real-world examples
        $this->createRealWorldMedications();
        
        // Create realistic customer data
        $this->createRealisticCustomers();
        
        // Create prescription scenarios
        $this->createPrescriptionScenarios();
        
        // Create stock management scenarios
        $this->createStockScenarios();

        $this->command->info('✅ Comprehensive demo data created successfully!');
    }

    private function createRealWorldMedications()
    {
        $tablet = DosageForm::firstOrCreate(['name' => 'Tablet']);
        $capsule = DosageForm::firstOrCreate(['name' => 'Capsule']);
        $syrup = DosageForm::firstOrCreate(['name' => 'Syrup']);
        $cream = DosageForm::firstOrCreate(['name' => 'Cream']);

        $supplier1 = MedicationSupplier::first() ?? MedicationSupplier::factory()->create();

        $medications = [
            [
                'name' => 'Panado 500mg',
                'schedule' => '2',
                'quantity_on_hand' => 500,
                'reorder_level' => 100,
                'current_sale_price' => 25.99,
                'dosage_form_id' => $tablet->id,
                'supplier_id' => $supplier1->id,
                'active_ingredient' => 'Paracetamol',
                'strength' => '500mg'
            ],
            [
                'name' => 'Brufen 400mg',
                'schedule' => '2',
                'quantity_on_hand' => 200,
                'reorder_level' => 50,
                'current_sale_price' => 45.50,
                'dosage_form_id' => $tablet->id,
                'supplier_id' => $supplier1->id,
                'active_ingredient' => 'Ibuprofen',
                'strength' => '400mg'
            ],
            [
                'name' => 'Amoxil 250mg',
                'schedule' => '4',
                'quantity_on_hand' => 150,
                'reorder_level' => 30,
                'current_sale_price' => 85.00,
                'dosage_form_id' => $capsule->id,
                'supplier_id' => $supplier1->id,
                'active_ingredient' => 'Amoxicillin',
                'strength' => '250mg'
            ],
            [
                'name' => 'Calpol Syrup',
                'schedule' => '2',
                'quantity_on_hand' => 75,
                'reorder_level' => 20,
                'current_sale_price' => 35.99,
                'dosage_form_id' => $syrup->id,
                'supplier_id' => $supplier1->id,
                'active_ingredient' => 'Paracetamol',
                'strength' => '120mg/5ml'
            ],
            [
                'name' => 'Voltaren Emulgel',
                'schedule' => '2',
                'quantity_on_hand' => 80,
                'reorder_level' => 25,
                'current_sale_price' => 125.00,
                'dosage_form_id' => $cream->id,
                'supplier_id' => $supplier1->id,
                'active_ingredient' => 'Diclofenac',
                'strength' => '1%'
            ]
        ];

        foreach ($medications as $medData) {
            $activeIngredientName = $medData['active_ingredient'];
            $strength = $medData['strength'];
            unset($medData['active_ingredient'], $medData['strength']);

            $medication = Medication::firstOrCreate(
                ['name' => $medData['name']],
                $medData
            );

            // Create or get active ingredient
            $activeIngredient = ActiveIngredient::firstOrCreate([
                'name' => $activeIngredientName
            ]);

            // Attach with strength
            $medication->activeIngredients()->syncWithoutDetaching([
                $activeIngredient->id => ['strength' => $strength]
            ]);

            $this->command->info("✓ Created medication: {$medication->name}");
        }
    }

    private function createRealisticCustomers()
    {
        $customerRole = Role::firstOrCreate(['name' => 'customer']);
        
        $customers = [
            [
                'name' => 'John',
                'surname' => 'Smith',
                'email' => 'john.smith@example.com',
                'id_number' => '8501015678901',
                'contact_number' => '+27821234567'
            ],
            [
                'name' => 'Sarah',
                'surname' => 'Johnson',
                'email' => 'sarah.johnson@example.com',
                'id_number' => '9203087654321',
                'contact_number' => '+27829876543'
            ],
            [
                'name' => 'Michael',
                'surname' => 'Brown',
                'email' => 'michael.brown@example.com',
                'id_number' => '7508123456789',
                'contact_number' => '+27835551234'
            ],
            [
                'name' => 'Emma',
                'surname' => 'Davis',
                'email' => 'emma.davis@example.com',
                'id_number' => '8812095432167',
                'contact_number' => '+27847778888'
            ]
        ];

        foreach ($customers as $customerData) {
            $user = User::firstOrCreate([
                'email' => $customerData['email']
            ], [
                'name' => $customerData['name'],
                'surname' => $customerData['surname'],
                'password' => Hash::make('password123'),
                'role' => 'customer',
                'email_verified_at' => now(),
            ]);

            $user->assignRole($customerRole);

            Customer::firstOrCreate([
                'user_id' => $user->id
            ], [
                'id_number' => $customerData['id_number'],
                'cellphone_number' => $customerData['contact_number'],
                'street' => '123 Example Street',
                'city' => 'Example City',
                'state' => 'Example Province',
                'postal_code' => '1234',
            ]);

            $this->command->info("✓ Created customer: {$user->name} {$user->surname}");
        }
    }

    private function createPrescriptionScenarios()
    {
        $customers = User::where('role', 'customer')->take(4)->get();
        $medications = Medication::take(5)->get();

        foreach ($customers as $customer) {
            // Create 1-2 prescriptions per customer
            for ($i = 0; $i < rand(1, 2); $i++) {
                $prescription = Prescription::create([
                    'user_id' => $customer->id,
                    'status' => collect(['active', 'completed', 'pending'])->random(),
                    'name' => 'Prescription ' . ($i + 1) . ' for ' . $customer->name,
                    'repeats_total' => rand(0, 3),
                    'repeats_used' => 0,
                    'next_repeat_date' => now()->addDays(rand(7, 30)),
                    'is_manual' => rand(0, 1),
                    'patient_id_number' => optional($customer->customer)->id_number,
                ]);

                // Add 1-3 medications to each prescription
                $prescriptionMeds = $medications->random(rand(1, 3));
                foreach ($prescriptionMeds as $medication) {
                    PrescriptionItem::create([
                        'prescription_id' => $prescription->id,
                        'medication_id' => $medication->id,
                        'quantity' => rand(10, 60),
                        'instructions' => $this->getRandomInstructions(),
                        'repeats' => $prescription->repeats_total,
                        'repeats_used' => 0,
                        'price' => $medication->current_sale_price * rand(1, 3),
                    ]);
                }

                $this->command->info("✓ Created prescription for {$customer->name}");
            }
        }
    }

    private function createStockScenarios()
    {
        $medications = Medication::take(10)->get();
        $suppliers = MedicationSupplier::take(3)->get();

        // Create some stock orders
        for ($i = 0; $i < 5; $i++) {
            $stockOrder = StockOrder::create([
                'supplier_id' => $suppliers->random()->id,
                'order_number' => StockOrder::generateOrderNumber(),
                'status' => collect(['Pending', 'Received'])->random(),
            ]);

            $orderMeds = $medications->random(rand(2, 5));
            
            foreach ($orderMeds as $medication) {
                $quantity = rand(50, 200);

                StockOrderItem::create([
                    'stock_order_id' => $stockOrder->id,
                    'medication_id' => $medication->id,
                    'quantity' => $quantity,
                ]);
            }

            $this->command->info("✓ Created stock order: {$stockOrder->order_number}");
        }
    }

    private function getRandomInstructions()
    {
        $instructions = [
            'Take one tablet twice daily with food',
            'Take two tablets daily, morning and evening',
            'Take one tablet when needed for pain',
            'Apply thin layer to affected area twice daily',
            'Take 5ml three times daily before meals',
            'Take one capsule daily with plenty of water',
            'Use as directed by doctor',
            'Take one tablet at bedtime',
        ];

        return $instructions[array_rand($instructions)];
    }
}
