<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

use App\Models\Pharmacy;
use App\Models\PharmacistProfile;
use App\Models\User;

echo "=== Pharmacy Assignment Test ===\n";

// Check pharmacies
$pharmacies = Pharmacy::all(['id', 'name']);
echo "Available Pharmacies:\n";
foreach ($pharmacies as $pharmacy) {
    echo "- ID: {$pharmacy->id}, Name: {$pharmacy->name}\n";
}

// Check a pharmacist profile
$profile = PharmacistProfile::with('pharmacy')->first();
if ($profile) {
    echo "\nSample Pharmacist Profile:\n";
    echo "- User ID: {$profile->user_id}\n";
    echo "- Pharmacy ID: " . ($profile->pharmacy_id ?: 'none') . "\n";
    echo "- Pharmacy Name: " . ($profile->pharmacy ? $profile->pharmacy->name : 'No pharmacy assigned') . "\n";
} else {
    echo "\nNo pharmacist profiles found.\n";
}

// Test the 'none' value handling
echo "\nTesting 'none' value handling:\n";
$testValue = 'none';
$convertedValue = ($testValue === 'none') ? null : (is_numeric($testValue) ? (int) $testValue : null);
echo "- Input: '{$testValue}' -> Converted: " . ($convertedValue === null ? 'NULL' : $convertedValue) . "\n";

$testValue = '1';
$convertedValue = ($testValue === 'none') ? null : (is_numeric($testValue) ? (int) $testValue : null);
echo "- Input: '{$testValue}' -> Converted: " . ($convertedValue === null ? 'NULL' : $convertedValue) . "\n";

echo "\n=== Test Complete ===\n";
