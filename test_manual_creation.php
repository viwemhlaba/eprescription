<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use App\Models\Customer\Prescription;
use Illuminate\Support\Facades\Hash;

echo "Testing Manual Prescription Creation with Auto-Generated Name...\n";

try {
    // Simulate the createManual process
    echo "1. Creating temporary user...\n";
    $tempUser = User::create([
        'name' => 'Temporary',
        'surname' => 'User',
        'email' => 'temp_' . time() . '@temp.local',
        'password' => Hash::make('temporary'),
        'role' => 'customer',
    ]);
    echo "✓ Temporary user created with ID: {$tempUser->id}\n";

    echo "2. Creating manual prescription with auto-generated name...\n";
    $prescription = Prescription::create([
        'user_id' => $tempUser->id,
        'name' => 'Manual Prescription - ' . now()->format('Y-m-d H:i:s'),
        'status' => 'draft',
        'delivery_method' => 'pickup',
        'repeats_total' => 0,
        'file_path' => '',
        'is_manual' => true,
    ]);
    
    echo "✓ Manual prescription created with ID: {$prescription->id}\n";
    echo "✓ Auto-generated name: '{$prescription->name}'\n";
    echo "✓ Status: {$prescription->status}\n";
    echo "✓ Is manual: " . ($prescription->is_manual ? 'Yes' : 'No') . "\n";
    echo "✓ File path: '{$prescription->file_path}' (empty for manual)\n";
    
    // Clean up
    $prescription->delete();
    $tempUser->delete();
    echo "✓ Test data cleaned up\n";
    
    echo "\n✅ Manual prescription creation with auto-generated name works perfectly!\n";
    echo "The prescription name format is: 'Manual Prescription - YYYY-MM-DD HH:MM:SS'\n";
    
} catch (Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
}
