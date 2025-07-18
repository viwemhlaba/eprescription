<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Customer;
use App\Models\Pharmacist;
use App\Models\Customer\Prescription;
use App\Models\Customer\PrescriptionItem;
use App\Models\DispensedItem;
use App\Models\CustomerAllergy;

class CleanupTestUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cleanup:test-users {--force : Force deletion without confirmation}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Remove all test and temporary users from the database along with their related data';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting cleanup of test and temporary users...');
        
        try {
            DB::beginTransaction();
            
            // Get all users
            $users = User::all();
            $this->info("Found {$users->count()} users in database");
            
            $deletedCount = 0;
            
            foreach ($users as $user) {
                $this->line("User: {$user->id} - {$user->name} {$user->surname} ({$user->email}) - Role: {$user->role}");
                
                // Check if this is a test/temporary user
                $isTestUser = (
                    str_contains($user->email, '@example.com') ||
                    str_contains($user->email, '@test.com') ||
                    str_contains(strtolower($user->name), 'test') ||
                    str_contains(strtolower($user->surname), 'test') ||
                    $user->role === 'customer' ||
                    $user->role === 'pharmacist' ||
                    $user->role === 'manager'
                );
                
                if ($isTestUser) {
                    if (!$this->option('force')) {
                        if (!$this->confirm("Delete user: {$user->name} {$user->surname} ({$user->email})?", true)) {
                            $this->line("  → Skipped user: {$user->name} {$user->surname}");
                            continue;
                        }
                    }
                    
                    $this->line("  → Deleting test/temp user: {$user->name} {$user->surname}");
                    
                    // Delete related data
                    if ($user->role === 'customer') {
                        // Delete customer allergies
                        CustomerAllergy::where('user_id', $user->id)->delete();
                        $this->line("    - Deleted customer allergies");
                        
                        // Delete dispensed items for this customer's prescriptions
                        $prescriptions = Prescription::where('user_id', $user->id)->pluck('id');
                        if ($prescriptions->count() > 0) {
                            DispensedItem::whereIn('prescription_id', $prescriptions)->delete();
                            $this->line("    - Deleted dispensed items");
                            
                            // Delete prescription items
                            PrescriptionItem::whereIn('prescription_id', $prescriptions)->delete();
                            $this->line("    - Deleted prescription items");
                            
                            // Delete prescriptions
                            Prescription::where('user_id', $user->id)->delete();
                            $this->line("    - Deleted prescriptions");
                        }
                        
                        // Delete customer profile
                        Customer::where('user_id', $user->id)->delete();
                        $this->line("    - Deleted customer profile");
                    }
                    
                    if ($user->role === 'pharmacist') {
                        // Delete pharmacist profile
                        Pharmacist::where('user_id', $user->id)->delete();
                        $this->line("    - Deleted pharmacist profile");
                    }
                    
                    // Delete the user
                    $user->delete();
                    $this->line("    - Deleted user account");
                    $deletedCount++;
                } else {
                    $this->line("  → Keeping user: {$user->name} {$user->surname} (not a test user)");
                }
            }
            
            DB::commit();
            $this->info("\nCleanup completed successfully! Deleted {$deletedCount} users.");
            
            // Show remaining users
            $remainingUsers = User::all();
            $this->info("\nRemaining users ({$remainingUsers->count()}):");
            foreach ($remainingUsers as $user) {
                $this->line("- {$user->id}: {$user->name} {$user->surname} ({$user->email}) - Role: {$user->role}");
            }
            
        } catch (\Exception $e) {
            DB::rollBack();
            $this->error("Error during cleanup: " . $e->getMessage());
            $this->error("Transaction rolled back.");
            return 1;
        }
        
        return 0;
    }
}
