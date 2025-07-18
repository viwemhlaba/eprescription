<?php

// Test script to verify PDF generation works
// Run this from the terminal: php test_pdf_generation.php

require_once 'bootstrap/app.php';

use App\Models\Customer\Prescription;
use Barryvdh\DomPDF\Facade\Pdf;

try {
    // Get a sample prescription for testing
    $prescription = Prescription::with([
        'user.customer',
        'doctor',
        'items.medication.activeIngredients',
    ])->first();
    
    if (!$prescription) {
        echo "No prescriptions found in database.\n";
        exit(1);
    }
    
    echo "Testing PDF generation for prescription ID: {$prescription->id}\n";
    
    // Get dispensed items history for this prescription
    $dispensedHistory = \App\Models\DispensedItem::where('prescription_id', $prescription->id)
        ->with(['pharmacist.pharmacistProfile.pharmacy', 'medication'])
        ->orderBy('dispensed_at', 'desc')
        ->get();

    // Get current pharmacist info (for testing, we'll use a sample)
    $currentPharmacist = \App\Models\PharmacistProfile::with('pharmacy')->first();

    // Calculate totals
    $totalCost = $dispensedHistory->sum('cost');
    $totalItemsDispensed = $dispensedHistory->sum('quantity_dispensed');

    // Generate PDF using DomPDF
    $pdf = Pdf::loadView('pdf.prescription-detailed', [
        'prescription' => $prescription,
        'patient' => $prescription->user,
        'customer' => $prescription->user->customer,
        'doctor' => $prescription->doctor,
        'items' => $prescription->items,
        'dispensed_history' => $dispensedHistory,
        'totals' => [
            'total_cost' => $totalCost,
            'total_items_dispensed' => $totalItemsDispensed,
            'prescription_total_value' => $prescription->items->sum('price'),
        ],
        'current_pharmacist' => $currentPharmacist,
        'generated_at' => now(),
    ]);

    // Set paper size and orientation
    $pdf->setPaper('A4', 'portrait');

    // Save to test file
    $filename = 'test_prescription_' . $prescription->id . '.pdf';
    file_put_contents($filename, $pdf->output());
    
    echo "PDF generated successfully: {$filename}\n";
    echo "File size: " . number_format(filesize($filename) / 1024, 2) . " KB\n";
    
} catch (Exception $e) {
    echo "Error generating PDF: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
    exit(1);
}
