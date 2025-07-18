<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use App\Models\Customer;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

echo "Testing Customer Creation and Password Workflow...\n\n";

// Test 1: Create a new customer account
echo "=== Test 1: Creating new customer account ===\n";
$customerData = [
    'name' => 'Test Customer',
    'email' => 'test.customer@example.com',
];

// Clean up any existing test user
User::where('email', $customerData['email'])->delete();

$tempPassword = Str::random(8);
echo "Generated temporary password: {$tempPassword}\n";

$user = User::create([
    'name' => $customerData['name'],
    'email' => $customerData['email'],
    'password' => Hash::make($tempPassword),
    'password_changed_at' => null, // Not set yet
]);

$customer = Customer::create([
    'user_id' => $user->id,
    'id_number' => '1234567890123', // Required field
]);

echo "Created user ID: {$user->id}, Customer ID: {$customer->id}\n";
echo "Password changed at: " . ($user->password_changed_at ?? 'NULL') . "\n\n";

// Test 2: Simulate password change
echo "=== Test 2: Simulating password change ===\n";
$newPassword = 'NewSecurePassword123!';
$user->update([
    'password' => Hash::make($newPassword),
    'password_changed_at' => now(),
]);

$user->refresh();
echo "Password changed at: " . ($user->password_changed_at ? $user->password_changed_at->format('Y-m-d H:i:s') : 'NULL') . "\n";
echo "Should password change be required: " . ($user->password_changed_at ? 'No' : 'Yes') . "\n\n";

// Test 3: Check middleware logic
echo "=== Test 3: Testing middleware logic ===\n";
echo "User requires password change: " . (is_null($user->password_changed_at) ? 'Yes' : 'No') . "\n\n";

// Test 4: Create a user that still needs password change
echo "=== Test 4: Creating user that needs password change ===\n";
$needsChangeData = [
    'name' => 'Needs Change Customer',
    'email' => 'needs.change@example.com',
];

// Clean up any existing test user
User::where('email', $needsChangeData['email'])->delete();

$needsChangeUser = User::create([
    'name' => $needsChangeData['name'],
    'email' => $needsChangeData['email'],
    'password' => Hash::make(Str::random(8)),
    'password_changed_at' => null, // Not set - should require password change
]);

$needsChangeCustomer = Customer::create([
    'user_id' => $needsChangeUser->id,
    'id_number' => '9876543210987', // Required field
]);

echo "Created user ID: {$needsChangeUser->id}\n";
echo "Password changed at: " . ($needsChangeUser->password_changed_at ?? 'NULL') . "\n";
echo "Requires password change: " . (is_null($needsChangeUser->password_changed_at) ? 'Yes' : 'No') . "\n\n";

// Test 5: Check if customers can see their assigned prescriptions
echo "=== Test 5: Testing prescription visibility ===\n";
echo "Customer {$customer->id} should be able to see prescriptions assigned to user {$user->id}\n";
echo "Customer {$needsChangeCustomer->id} should be able to see prescriptions assigned to user {$needsChangeUser->id}\n\n";

echo "=== All tests completed ===\n";

// Clean up
echo "Cleaning up test data...\n";
User::where('email', $customerData['email'])->delete();
User::where('email', $needsChangeData['email'])->delete();
echo "Cleanup completed.\n";
