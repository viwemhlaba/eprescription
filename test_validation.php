<?php

// Simple test to verify the stock report endpoint
echo "Testing Stock Report API...\n\n";

// Test data
$testParams = [
    'group_by' => 'dosage_form',
    'stock_filter' => 'all',
    'include_zero_stock' => 'false',
    'sort_by' => 'name',
    'sort_direction' => 'asc'
];

echo "Testing parameters:\n";
foreach ($testParams as $key => $value) {
    echo "  $key: $value\n";
}
echo "\n";

// Validation test
echo "Testing validation rules:\n";

$validationRules = [
    'group_by' => 'required|in:dosage_form,schedule,supplier',
    'include_zero_stock' => 'nullable|in:true,false,1,0',
    'stock_filter' => 'required|in:all,low_stock,out_of_stock',
    'sort_by' => 'required|in:name,quantity_on_hand,reorder_level',
    'sort_direction' => 'required|in:asc,desc'
];

foreach ($validationRules as $field => $rule) {
    $value = $testParams[$field] ?? 'null';
    echo "  $field ($value): ";
    
    if ($field === 'group_by') {
        echo in_array($value, ['dosage_form', 'schedule', 'supplier']) ? 'PASS' : 'FAIL';
    } elseif ($field === 'include_zero_stock') {
        echo in_array($value, ['true', 'false', '1', '0']) || is_null($value) ? 'PASS' : 'FAIL';
    } elseif ($field === 'stock_filter') {
        echo in_array($value, ['all', 'low_stock', 'out_of_stock']) ? 'PASS' : 'FAIL';
    } elseif ($field === 'sort_by') {
        echo in_array($value, ['name', 'quantity_on_hand', 'reorder_level']) ? 'PASS' : 'FAIL';
    } elseif ($field === 'sort_direction') {
        echo in_array($value, ['asc', 'desc']) ? 'PASS' : 'FAIL';
    }
    echo "\n";
}

echo "\nTest completed. All parameters should show 'PASS' for the validation to succeed.\n";
echo "If you still get 'Invalid report parameters provided', the issue might be in:\n";
echo "1. Route middleware (authentication required)\n";
echo "2. Database connection or data availability\n";
echo "3. CSRF token handling (but we switched to GET to avoid this)\n";
echo "4. Frontend parameter construction\n\n";

echo "URL that would be generated:\n";
echo "http://127.0.0.1:8000/manager/reports/stock-pdf?" . http_build_query($testParams) . "\n";
