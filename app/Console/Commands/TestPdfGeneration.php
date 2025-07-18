<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Customer\Prescription;
use Barryvdh\DomPDF\Facade\Pdf;

class TestPdfGeneration extends Command
{
    protected $signature = 'test:pdf-generation';
    protected $description = 'Test PDF generation for prescriptions';

    public function handle()
    {
        try {
            // Get a sample prescription for testing
            $prescription = Prescription::with([
                'user.customer',
                'doctor',
                'items.medication.activeIngredients',
            ])->first();
            
            if (!$prescription) {
                $this->error("No prescriptions found in database.");
                return 1;
            }
            
            $this->info("Testing PDF generation for prescription ID: {$prescription->id}");
            
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
            $filename = storage_path('app/test_prescription_' . $prescription->id . '.pdf');
            file_put_contents($filename, $pdf->output());
            
            $this->info("PDF generated successfully: {$filename}");
            $this->info("File size: " . number_format(filesize($filename) / 1024, 2) . " KB");
            
            return 0;
            
        } catch (\Exception $e) {
            $this->error("Error generating PDF: " . $e->getMessage());
            $this->error("Stack trace:");
            $this->error($e->getTraceAsString());
            return 1;
        }
    }
}
