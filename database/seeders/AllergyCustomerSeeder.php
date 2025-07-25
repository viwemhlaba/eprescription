<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Medication\ActiveIngredient;
use App\Models\CustomerAllergy;

class AllergyCustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $activeIngredients = ActiveIngredient::all();

        if ($activeIngredients->isEmpty()) {
            $this->command->warn('No active ingredients found to assign as allergies to customers.');
            return;
        }

        User::where('role', 'customer')->each(function ($customer) use ($activeIngredients) {
            // Clear existing allergies first
            CustomerAllergy::where('user_id', $customer->id)->delete();
            
            // Assign 0-2 random active ingredient allergies to each customer
            $randomIngredients = $activeIngredients->random(rand(0, 2));
            
            foreach ($randomIngredients as $ingredient) {
                CustomerAllergy::create([
                    'user_id' => $customer->id,
                    'active_ingredient_id' => $ingredient->id,
                ]);
            }
            
            $this->command->info("Assigned {$randomIngredients->count()} ingredient allergies to customer: {$customer->name}");
        });

        $this->command->info('Customer allergies seeded successfully!');
    }
}
