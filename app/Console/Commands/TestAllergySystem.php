<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Medication\Medication;
use App\Models\CustomerAllergy;
use App\Services\AllergyAlertService;
use Illuminate\Support\Facades\DB;

class TestAllergySystem extends Command
{
    protected $signature = 'test:allergies';
    protected $description = 'Test the allergy checking system with seeded data';

    public function handle()
    {
        $this->info('🧪 Testing Allergy Alert System');
        $this->info('================================');

        // Test 1: Show customer allergies
        $this->info("\n📋 Customer Allergies Overview:");
        $customers = User::where('role', 'customer')
            ->with('allergies.activeIngredient')
            ->whereHas('allergies')
            ->take(5)
            ->get();

        foreach ($customers as $customer) {
            $this->line("👤 {$customer->name}:");
            foreach ($customer->allergies as $allergy) {
                $this->line("   ⚠️  Allergic to: {$allergy->activeIngredient->name}");
            }
        }

        // Test 2: Check medication conflicts
        $this->info("\n🔍 Testing Medication Conflict Detection:");
        
        $customer = $customers->first();
        $medications = Medication::with('activeIngredients')->take(3)->get();

        foreach ($medications as $medication) {
            $this->line("\n💊 Testing medication: {$medication->name}");
            $this->line("   Active ingredients: {$medication->activeIngredients->pluck('name')->implode(', ')}");
            
            // Check for conflicts
            $medicationIngredientIds = $medication->activeIngredients->pluck('id');
            $conflicts = $customer->allergies()
                ->whereIn('active_ingredient_id', $medicationIngredientIds)
                ->with('activeIngredient')
                ->get();
                
            if ($conflicts->isNotEmpty()) {
                $conflictNames = $conflicts->pluck('activeIngredient.name')->implode(', ');
                $this->error("   🚨 ALLERGY ALERT: {$customer->name} is allergic to: {$conflictNames}");
            } else {
                $this->info("   ✅ No allergy conflicts detected for {$customer->name}");
            }
        }

        // Test 3: Test the service
        $this->info("\n🔧 Testing AllergyAlertService:");
        try {
            $allergyService = new AllergyAlertService();
            $testMedication = $medications->first();
            
            $result = $allergyService->checkMedicationAllergyConflicts($customer, $testMedication);
            
            if ($result['has_conflicts']) {
                $message = $allergyService->generateAlertMessage($result);
                $this->error("   🚨 Service Alert: {$message}");
            } else {
                $this->info("   ✅ Service: No conflicts detected");
            }
        } catch (\Exception $e) {
            $this->error("   ❌ Service Error: {$e->getMessage()}");
        }

        // Test 4: Database statistics
        $this->info("\n📊 Database Statistics:");
        $this->line("   👥 Total customers: " . User::where('role', 'customer')->count());
        $this->line("   🏥 Total medications: " . Medication::count());
        $this->line("   🧬 Total active ingredients: " . \App\Models\Medication\ActiveIngredient::count());
        $this->line("   ⚠️  Total allergies: " . CustomerAllergy::count());
        $this->line("   🔗 Medication-ingredient associations: " . DB::table('active_ingredient_medication')->count());

        $this->info("\n✅ Allergy system testing completed!");
        $this->info("💡 You can now test the system in the pharmacist interface by:");
        $this->info("   1. Logging in as a pharmacist");
        $this->info("   2. Loading a prescription for one of the customers listed above");
        $this->info("   3. Adding medications that contain ingredients they're allergic to");
        $this->info("   4. Observing the allergy alerts in the interface");
    }
}
