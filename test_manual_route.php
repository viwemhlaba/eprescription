<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "Testing Manual Prescription Route...\n";

try {
    // Test the createManual route directly
    $controller = new \App\Http\Controllers\Pharmacist\PharmacistPrescriptionController();
    
    echo "✓ Controller instantiated successfully\n";
    
    // Check if the method exists
    if (method_exists($controller, 'createManual')) {
        echo "✓ createManual method exists\n";
    } else {
        echo "✗ createManual method NOT found\n";
    }
    
    // Test route URL generation
    $url = route('pharmacist.prescriptions.createManual');
    echo "✓ Route URL: $url\n";
    
    echo "\nRoute test completed!\n";
    
} catch (Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
}
