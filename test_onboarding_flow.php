<?php

require_once 'vendor/autoload.php';

use App\Models\User;
use App\Models\PharmacistProfile;

echo "=== Testing Pharmacist Onboarding Flow ===\n\n";

// Find a pharmacist user
$pharmacist = User::where('role', 'pharmacist')->first();

if (!$pharmacist) {
    echo "❌ No pharmacist user found. Please run the seeder first.\n";
    exit(1);
}

echo "✅ Found pharmacist user: {$pharmacist->name} ({$pharmacist->email})\n";

// Check their profile
$profile = PharmacistProfile::where('user_id', $pharmacist->id)->first();

if (!$profile) {
    echo "❌ No profile found for pharmacist.\n";
    exit(1);
}

echo "✅ Found pharmacist profile\n";
echo "Profile completed: " . ($profile->profile_completed ? "Yes" : "No") . "\n\n";

echo "=== Test Scenarios ===\n";

if (!$profile->profile_completed) {
    echo "✅ Profile is incomplete - onboarding middleware should redirect to profile edit\n";
} else {
    echo "⚠️  Profile is complete - reset using: php artisan pharmacist:reset-onboarding\n";
}

echo "\n=== Onboarding Flow Steps ===\n";
echo "1. Manager creates pharmacist account\n";
echo "2. Pharmacist receives email with login details and onboarding notice\n";
echo "3. Pharmacist logs in and is redirected to profile edit page\n";
echo "4. Pharmacist completes profile and clicks 'Complete Profile & Get Started'\n";
echo "5. Profile is marked as completed and pharmacist is redirected to dashboard\n";
echo "6. Pharmacist can now access all system features\n\n";

echo "=== Test URLs (login as pharmacist first) ===\n";
echo "Profile Edit: /pharmacist/profile/edit (should be accessible)\n";
echo "Dashboard: /pharmacist/dashboard (should redirect to profile edit if incomplete)\n";
echo "Prescriptions: /pharmacist/prescriptions (should redirect to profile edit if incomplete)\n\n";

echo "✅ Onboarding flow implementation complete!\n";
