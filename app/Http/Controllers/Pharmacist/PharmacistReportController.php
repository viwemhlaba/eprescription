<?php

namespace App\Http\Controllers\Pharmacist;

use App\Http\Controllers\Controller;
use App\Models\DispensedItem;
use App\Models\GeneratedReport;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;
use Inertia\Inertia;

class PharmacistReportController extends Controller
{    /**
     * Show the main reports page
     */
    public function index()
    {
        // Get the pharmacist's recent reports
        $recentReports = GeneratedReport::where('user_id', Auth::id())
            ->where('report_type', 'dispensed_medications')
            ->orderBy('generated_at', 'desc')
            ->take(10)
            ->get()
            ->map(function ($report) {
                return [
                    'id' => $report->id,
                    'title' => $report->title,
                    'generated_at' => $report->generated_at->format('Y-m-d H:i'),
                    'file_size' => $report->getFormattedFileSize(),
                    'download_count' => $report->download_count,
                    'parameters' => $report->parameters,
                    'file_exists' => $report->getFileExists(),
                    'is_expired' => $report->isExpired(),
                ];
            });

        return Inertia::render('Pharmacist/Reports', [
            'recentReports' => $recentReports
        ]);
    }

    /**
     * Show the dispensed medications report form
     */
    public function dispensedForm()
    {
        return Inertia::render('Pharmacist/Reports/DispensedReportPage');
    }    /**
     * Generate and download dispensed medications PDF report
     */
    public function dispensedPdf(Request $request)
    {
        try {
            $validated = $request->validate([
                'start_date' => 'required|date|before_or_equal:today',
                'end_date' => 'required|date|after_or_equal:start_date|before_or_equal:today',
                'group_by' => 'required|in:patient,medication,schedule'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // If request expects JSON (from AJAX), return JSON response
            if ($request->wantsJson() || $request->ajax()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid report parameters provided.',
                    'errors' => $e->errors()
                ], 422);
            }
            
            // For regular requests, redirect back with validation errors
            return redirect()->route('pharmacist.reports.dispensed')
                ->withErrors($e->errors())
                ->withInput();
        }

        $pharmacistId = Auth::id();
        $pharmacist = Auth::user();

        // Get dispensed items within date range for current pharmacist
        $dispensedItems = DispensedItem::with([
            'prescription.user', // Patient information
            'prescription.doctor', // Doctor information
            'medication' // Medication details (schedule is a field on medication)
        ])
        ->where('pharmacist_id', $pharmacistId)
        ->whereBetween('dispensed_at', [
            Carbon::parse($validated['start_date'])->startOfDay(),
            Carbon::parse($validated['end_date'])->endOfDay()
        ])
        ->orderBy('dispensed_at', 'desc')
        ->get();

        // Check if no data found
        if ($dispensedItems->isEmpty()) {
            // If request expects JSON (from AJAX), return JSON response
            if ($request->wantsJson() || $request->ajax()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No dispensed medications found for the selected date range.',
                    'details' => 'Please try a different date range or verify that you have dispensed medications during this period.',
                    'data' => [
                        'start_date' => $validated['start_date'],
                        'end_date' => $validated['end_date'],
                        'group_by' => $validated['group_by'],
                        'pharmacist_name' => $pharmacist->name . ' ' . $pharmacist->surname
                    ]
                ], 404);
            }
            
            // For regular requests, redirect back with error message
            return redirect()->route('pharmacist.reports.dispensed')
                ->with('error', 'No dispensed medications found for the selected date range. Please try a different date range.');
        }

        // Group the data based on selected grouping method
        $groupedData = $this->groupDispensedData($dispensedItems, $validated['group_by']);

        // Calculate totals
        $totalItems = $dispensedItems->count();
        $totalCost = $dispensedItems->sum('cost');
        $uniquePatients = $dispensedItems->pluck('prescription.user.id')->unique()->count();
        $uniqueMedications = $dispensedItems->pluck('medication.id')->unique()->count();        // Generate PDF
        $pdf = Pdf::loadView('pdf.pharmacist.dispensed-report', [
            'pharmacist' => $pharmacist,
            'dispensedItems' => $dispensedItems,
            'groupedData' => $groupedData,
            'groupBy' => $validated['group_by'],
            'startDate' => Carbon::parse($validated['start_date'])->format('Y-m-d'),
            'endDate' => Carbon::parse($validated['end_date'])->format('Y-m-d'),
            'totals' => [
                'items' => $totalItems,
                'cost' => $totalCost,
                'patients' => $uniquePatients,
                'medications' => $uniqueMedications
            ],
            'generatedAt' => now()->format('Y-m-d H:i:s')
        ]);

        $filename = sprintf(
            'dispensed-medications-report-%s-%s-%s.pdf',
            $validated['group_by'],
            $validated['start_date'],
            $validated['end_date']
        );

        // Save the PDF to storage
        $pdfContent = $pdf->output();
        $storagePath = 'reports/pharmacist/' . Auth::id() . '/' . $filename;
        Storage::disk('public')->put($storagePath, $pdfContent);

        // Create a record in generated_reports table
        $reportTitle = sprintf(
            'Dispensed Medications Report (%s) - %s to %s',
            ucfirst($validated['group_by']),
            $validated['start_date'],
            $validated['end_date']
        );

        GeneratedReport::create([
            'user_id' => Auth::id(),
            'report_type' => 'dispensed_medications',
            'title' => $reportTitle,
            'parameters' => $validated,
            'file_path' => $storagePath,
            'original_filename' => $filename,
            'file_size' => strlen($pdfContent),
            'generated_at' => now(),
            'expires_at' => now()->addDays(30), // Reports expire after 30 days
        ]);

        return $pdf->download($filename);
    }

    /**
     * Download an existing generated report
     */
    public function downloadReport(Request $request, GeneratedReport $report)
    {
        // Ensure the report belongs to the authenticated pharmacist
        if ($report->user_id !== Auth::id()) {
            abort(403, 'You do not have permission to download this report.');
        }

        // Check if the file still exists
        if (!$report->getFileExists()) {
            return redirect()->back()->withErrors([
                'report' => 'The requested report file no longer exists. Please generate a new report.'
            ]);
        }

        // Check if the report has expired
        if ($report->isExpired()) {
            return redirect()->back()->withErrors([
                'report' => 'This report has expired. Please generate a new report.'
            ]);
        }

        // Increment download count
        $report->incrementDownloadCount();        // Return the file for download
        return response()->download(
            Storage::disk('public')->path($report->file_path),
            $report->original_filename
        );
    }

    /**
     * Delete a generated report
     */
    public function deleteReport(Request $request, GeneratedReport $report)
    {
        // Ensure the report belongs to the authenticated pharmacist
        if ($report->user_id !== Auth::id()) {
            abort(403, 'You do not have permission to delete this report.');
        }

        // Delete the file from storage
        if ($report->getFileExists()) {
            Storage::disk('public')->delete($report->file_path);
        }

        // Delete the database record
        $report->delete();

        return redirect()->back()->with('success', 'Report deleted successfully.');
    }

    /**
     * Clean up expired reports
     */
    public function cleanupExpired()
    {
        $expiredReports = GeneratedReport::where('expires_at', '<', now())
            ->orWhere('created_at', '<', now()->subDays(30))
            ->get();

        $deletedCount = 0;
        foreach ($expiredReports as $report) {
            if ($report->getFileExists()) {
                Storage::disk('public')->delete($report->file_path);
            }
            $report->delete();
            $deletedCount++;
        }

        return $deletedCount;
    }

    /**
     * Group dispensed data based on grouping method
     */
    private function groupDispensedData($dispensedItems, $groupBy)
    {
        switch ($groupBy) {
            case 'patient':
                return $dispensedItems->groupBy(function ($item) {
                    $user = $item->prescription->user;
                    return $user ? $user->name . ' ' . $user->surname : 'Unknown Patient';
                });

            case 'medication':
                return $dispensedItems->groupBy(function ($item) {
                    return $item->medication->name ?? 'Unknown Medication';
                });

            case 'schedule':
                return $dispensedItems->groupBy(function ($item) {
                    return 'Schedule ' . ($item->medication->schedule ?? 'Unknown');
                });

            default:
                return $dispensedItems->groupBy('id'); // Fallback to individual items
        }
    }
}
