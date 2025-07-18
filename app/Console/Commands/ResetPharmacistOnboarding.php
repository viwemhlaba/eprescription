<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\PharmacistProfile;

class ResetPharmacistOnboarding extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'pharmacist:reset-onboarding';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Reset pharmacist profile completion status for testing onboarding flow';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $profiles = PharmacistProfile::all();
        
        foreach ($profiles as $profile) {
            $profile->update(['profile_completed' => false]);
        }
        
        $this->info("Reset " . $profiles->count() . " pharmacist profiles to incomplete status.");
        
        return 0;
    }
}
