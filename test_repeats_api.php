<?php
// Simple test script to test the repeats API
require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

// Simulate the API request
$request = Illuminate\Http\Request::create('/api/pharmacist/requested-repeats', 'GET');
$request->headers->set('Accept', 'application/json');

try {
    $response = $kernel->handle($request);
    echo "Status: " . $response->getStatusCode() . "\n";
    echo "Content: " . $response->getContent() . "\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
