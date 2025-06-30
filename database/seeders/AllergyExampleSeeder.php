<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\CustomerAllergy;
use App\Models\Medication\ActiveIngredient;
use App\Models\Medication\Medication;

class AllergyExampleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 
     * This seeder demonstrates how to add allergies to customers
     */
    public function run(): void
    {
        $this->command->info('Starting to seed customer allergies...');

        // Get some common active ingredients
        $activeIngredients = ActiveIngredient::take(10)->get();
        
        if ($activeIngredients->isEmpty()) {
            $this->command->error('No active ingredients found. Please seed active ingredients first.');
            return;
        }

        // Get customers (users with customer role)
        $customers = User::where('role', 'customer')->get();
        
        if ($customers->isEmpty()) {
            $this->command->info('No customers found. Creating sample customers...');
            
            // Create sample customers
            $customers = collect([
                User::firstOrCreate([
                    'email' => 'john.doe@example.com'
                ], [
                    'name' => 'John Doe',
                    'password' => bcrypt('password123'),
                    'role' => 'customer',
                    'email_verified_at' => now()
                ]),
                User::firstOrCreate([
                    'email' => 'jane.smith@example.com'
                ], [
                    'name' => 'Jane Smith',
                    'password' => bcrypt('password123'),
                    'role' => 'customer',
                    'email_verified_at' => now()
                ]),
                User::firstOrCreate([
                    'email' => 'bob.johnson@example.com'
                ], [
                    'name' => 'Bob Johnson',
                    'password' => bcrypt('password123'),
                    'role' => 'customer',
                    'email_verified_at' => now()
                ]),
                User::firstOrCreate([
                    'email' => 'alice.williams@example.com'
                ], [
                    'name' => 'Alice Williams',
                    'password' => bcrypt('password123'),
                    'role' => 'customer',
                    'email_verified_at' => now()
                ]),
                User::firstOrCreate([
                    'email' => 'charlie.brown@example.com'
                ], [
                    'name' => 'Charlie Brown',
                    'password' => bcrypt('password123'),
                    'role' => 'customer',
                    'email_verified_at' => now()
                ])
            ]);
        }

        $this->command->info("Found {$customers->count()} customers and {$activeIngredients->count()} active ingredients.");

        // Clear existing allergies
        CustomerAllergy::truncate();

        $allergiesCreated = 0;

        // Assign allergies to customers
        foreach ($customers as $index => $customer) {
            // Give each customer 1-3 random allergies
            $numberOfAllergies = rand(1, 3);
            $selectedIngredients = $activeIngredients->random($numberOfAllergies);
            
            foreach ($selectedIngredients as $ingredient) {
                CustomerAllergy::create([
                    'user_id' => $customer->id,
                    'active_ingredient_id' => $ingredient->id
                ]);
                
                $allergiesCreated++;
                $this->command->info("✓ Added allergy: {$customer->name} is allergic to {$ingredient->name}");
            }
        }

        $this->command->info("Created {$allergiesCreated} allergy records for {$customers->count()} customers.");

        // Also create some medications with these active ingredients for testing
        $this->createTestMedicationsWithIngredients($activeIngredients);

        $this->command->info('✅ Allergy seeding completed successfully!');
        $this->command->info('');
        $this->command->info('Testing suggestions:');
        $this->command->info('1. Try adding medications to prescriptions for the seeded customers');
        $this->command->info('2. Use the API endpoints:');
        $this->command->info('   POST /api/check-medication-allergy');
        $this->command->info('   GET /api/user-allergies/{user_id}');
        $this->command->info('3. Check the allergy alerts in the pharmacist prescription interface');
    }

    /**
     * Create test medications with active ingredients for easier testing
     */
    private function createTestMedicationsWithIngredients($activeIngredients)
    {
        $this->command->info('Creating test medications with active ingredients...');

        // Get some existing medications
        $medications = Medication::take(5)->get();

        if ($medications->isEmpty()) {
            $this->command->info('No medications found to associate with active ingredients.');
            return;
        }

        foreach ($medications as $index => $medication) {
            // Clear existing associations
            $medication->activeIngredients()->detach();
            
            // Add 1-2 active ingredients to each medication
            $numberOfIngredients = rand(1, 2);
            $selectedIngredients = $activeIngredients->random($numberOfIngredients);
            
            foreach ($selectedIngredients as $ingredient) {
                $medication->activeIngredients()->attach($ingredient->id, [
                    'strength' => $this->getRandomStrength()
                ]);
                
                $this->command->info("✓ Added {$ingredient->name} ({$this->getRandomStrength()}) to {$medication->name}");
            }
        }
    }

    /**
     * Generate random strength values for testing
     */
    private function getRandomStrength()
    {
        $strengths = ['5mg', '10mg', '25mg', '50mg', '100mg', '250mg', '500mg', '1000mg'];
        return $strengths[array_rand($strengths)];
    }
}
