<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "Testing Routes...\n";

try {
    // Test route URL generation
    $createManualUrl = route('pharmacist.prescriptions.createManual');
    echo "✓ Create Manual URL: $createManualUrl\n";
    
    $indexUrl = route('pharmacist.prescriptions.index');
    echo "✓ Index URL: $indexUrl\n";
    
    // Test if we can access a prescription load route
    $prescription = \App\Models\Customer\Prescription::first();
    if ($prescription) {
        $loadUrl = route('pharmacist.prescriptions.load', $prescription->id);
        echo "✓ Load URL: $loadUrl\n";
        
        $loadActionUrl = route('pharmacist.prescriptions.loadAction', $prescription->id);
        echo "✓ Load Action URL: $loadActionUrl\n";
    } else {
        echo "No prescriptions found to test load route\n";
    }
    
    echo "\nAll route tests passed!\n";
    
} catch (Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
}
