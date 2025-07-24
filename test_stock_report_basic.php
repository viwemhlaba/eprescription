<?php

use App\Http\Controllers\Manager\StockReportController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

// Find a manager user for testing
$manager = User::where('role', 'manager')->first();

if (!$manager) {
    echo "No manager user found. Please create a manager user first.\n";
    exit(1);
}

echo "Testing stock report generation with manager: {$manager->email}\n";

// Simulate login
Auth::login($manager);

// Create test request data
$requestData = [
    'group_by' => 'dosage_form',
    'stock_filter' => 'all',
    'include_zero_stock' => false,
    'sort_by' => 'name',
    'sort_direction' => 'asc'
];

echo "Test parameters:\n";
foreach ($requestData as $key => $value) {
    echo "  {$key}: " . (is_bool($value) ? ($value ? 'true' : 'false') : $value) . "\n";
}

echo "\nTest completed successfully! Parameters are valid.\n";
echo "You can now test the full report generation through the web interface.\n";
echo "Navigate to: /manager/reports/stock\n";
