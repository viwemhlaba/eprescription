<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use App\Models\PharmacistProfile;

echo "Testing PharmacistProfile updates...\n";

$user = User::first();
if (!$user) {
    echo "No users found\n";
    exit;
}

echo "User: {$user->name} (ID: {$user->id})\n";

$profile = PharmacistProfile::where('user_id', $user->id)->first();
if (!$profile) {
    echo "Creating new profile...\n";
    $profile = PharmacistProfile::create(['user_id' => $user->id]);
}

echo "Profile ID: {$profile->id}\n";
echo "Current surname: " . ($profile->surname ?? 'NULL') . "\n";
echo "Current phone: " . ($profile->phone_number ?? 'NULL') . "\n";
echo "Current bio: " . ($profile->bio ?? 'NULL') . "\n";

// Test update
echo "\nTesting update...\n";
$testData = [
    'surname' => 'TestSurname_' . time(),
    'phone_number' => '123456789',
    'bio' => 'This is a test bio from script'
];

$result = $profile->update($testData);
echo "Update result: " . ($result ? 'SUCCESS' : 'FAILED') . "\n";

$profile->refresh();
echo "After update surname: " . ($profile->surname ?? 'NULL') . "\n";
echo "After update phone: " . ($profile->phone_number ?? 'NULL') . "\n";
echo "After update bio: " . ($profile->bio ?? 'NULL') . "\n";

// Also check using fresh query
$freshProfile = PharmacistProfile::where('user_id', $user->id)->first();
echo "\nFresh query results:\n";
echo "Fresh surname: " . ($freshProfile->surname ?? 'NULL') . "\n";
echo "Fresh phone: " . ($freshProfile->phone_number ?? 'NULL') . "\n";
echo "Fresh bio: " . ($freshProfile->bio ?? 'NULL') . "\n";
