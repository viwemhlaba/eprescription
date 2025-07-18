<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Customer\Prescription;
use Illuminate\Support\Facades\Hash;

echo "Testing Manual Prescription Creation Flow...\n";

try {
    // Create a temporary user first
    $tempUser = \App\Models\User::create([
        'name' => 'Test',
        'surname' => 'User',
        'email' => 'test_' . time() . '@temp.local',
        'password' => Hash::make('temporary'),
        'role' => 'customer',
    ]);
    
    echo "✓ Created temporary user with ID: {$tempUser->id}\n";
    
    // Test creating a manual prescription
    $prescription = Prescription::create([
        'user_id' => $tempUser->id,
        'name' => 'Manual Prescription - Test ' . now()->format('Y-m-d H:i:s'),
        'status' => 'draft',
        'delivery_method' => 'pickup',
        'repeats_total' => 0,
        'file_path' => '',
        'is_manual' => true,
    ]);
    
    echo "✓ Created manual prescription with ID: {$prescription->id}\n";
    echo "✓ Is manual: " . ($prescription->is_manual ? 'Yes' : 'No') . "\n";
    echo "✓ Status: {$prescription->status}\n";
    echo "✓ Name: {$prescription->name}\n";
    
    // Test updating with customer association
    $firstCustomer = \App\Models\User::where('role', 'customer')->where('id', '!=', $tempUser->id)->first();
    if ($firstCustomer) {
        $prescription->update(['user_id' => $firstCustomer->id]);
        echo "✓ Associated with customer: {$firstCustomer->name}\n";
    }
    
    // Clean up
    $prescription->delete();
    $tempUser->delete();
    echo "✓ Cleaned up test data\n";
    
    echo "\nAll tests passed! Manual prescription flow is working.\n";
    
} catch (Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
}
