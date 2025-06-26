<?php

use App\Models\DispensedItem;
use App\Models\User;

// Test the dispensed items query
$pharmacistId = 2; // Assuming user ID 2 is a pharmacist
$startDate = '2024-01-01';
$endDate = '2024-12-31';

echo "Testing dispensed items query...\n";
echo "Pharmacist ID: $pharmacistId\n";
echo "Date range: $startDate to $endDate\n\n";

$dispensedItems = DispensedItem::with([
    'prescription.user',
    'prescription.doctor',
    'medication'
])
->where('pharmacist_id', $pharmacistId)
->whereBetween('dispensed_at', [
    \Carbon\Carbon::parse($startDate)->startOfDay(),
    \Carbon\Carbon::parse($endDate)->endOfDay()
])
->orderBy('dispensed_at', 'desc')
->get();

echo "Found " . $dispensedItems->count() . " dispensed items for pharmacist $pharmacistId\n";

if ($dispensedItems->count() > 0) {
    foreach ($dispensedItems as $item) {
        echo "- Item ID: " . $item->id . "\n";
        echo "  Prescription ID: " . $item->prescription_id . "\n";
        echo "  Patient: " . ($item->prescription->user->name ?? 'Not found') . "\n";
        echo "  Medication: " . ($item->medication->name ?? 'Not found') . "\n";
        echo "  Dispensed at: " . $item->dispensed_at . "\n\n";
    }
} else {
    echo "No items found. Let's check all dispensed items:\n";
    $allItems = DispensedItem::all();
    foreach ($allItems as $item) {
        echo "- Item ID: " . $item->id . " (Pharmacist: " . $item->pharmacist_id . ", Date: " . $item->dispensed_at . ")\n";
    }
}
