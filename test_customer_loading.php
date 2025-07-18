<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;

echo "Testing Customer Loading...\n";

try {
    // Test loading customers like the controller does
    $customers = User::where('role', 'customer')
        ->with('customer:user_id,id_number')
        ->select('id', 'name', 'surname', 'email')
        ->get()
        ->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'surname' => $user->surname,
                'email' => $user->email,
                'id_number' => $user->customer->id_number ?? null,
                'full_name' => $user->name . ' ' . $user->surname,
            ];
        });
    
    echo "✓ Successfully loaded " . $customers->count() . " customers\n";
    
    if ($customers->count() > 0) {
        echo "✓ Sample customer: " . $customers->first()['full_name'] . "\n";
        echo "✓ Sample ID number: " . ($customers->first()['id_number'] ?? 'null') . "\n";
    }
    
    echo "\nCustomer loading test passed!\n";
    
} catch (Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
}
