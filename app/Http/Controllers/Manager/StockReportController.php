<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Models\Medication\Medication;
use App\Models\GeneratedReport;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;
use Inertia\Inertia;

class StockReportController extends Controller
{
    /**
     * Show the stock report form
     */
    public function index()
    {
        // Get recent stock reports
        $recentReports = GeneratedReport::where('user_id', Auth::id())
            ->where('report_type', 'stock_report')
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

        return Inertia::render('Manager/Reports/StockReport', [
            'recentReports' => $recentReports
        ]);
    }

    /**
     * Generate stock report PDF
     */
    public function generatePdf(Request $request)
    {
        try {
            $validated = $request->validate([
                'group_by' => 'required|in:dosage_form,schedule,supplier',
                'include_zero_stock' => 'nullable|in:true,false,1,0',
                'stock_filter' => 'required|in:all,low_stock,out_of_stock',
                'sort_by' => 'required|in:name,quantity_on_hand,reorder_level',
                'sort_direction' => 'required|in:asc,desc'
            ]);
            
            // Convert include_zero_stock to boolean
            $validated['include_zero_stock'] = filter_var($validated['include_zero_stock'] ?? false, FILTER_VALIDATE_BOOLEAN);
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
            return redirect()->route('manager.reports.stock')
                ->withErrors($e->errors())
                ->withInput();
        }

        $manager = Auth::user();

        // Build query for medications with relationships
        $query = Medication::with(['dosageForm', 'supplier', 'activeIngredients']);

        // Apply stock filters
        switch ($validated['stock_filter']) {
            case 'low_stock':
                $query->whereColumn('quantity_on_hand', '<=', 'reorder_level');
                break;
            case 'out_of_stock':
                $query->where('quantity_on_hand', 0);
                break;
            case 'all':
            default:
                if (!($validated['include_zero_stock'] ?? false)) {
                    $query->where('quantity_on_hand', '>', 0);
                }
                break;
        }

        // Apply sorting
        $query->orderBy($validated['sort_by'], $validated['sort_direction']);

        $medications = $query->get();

        // Check if no data found
        if ($medications->isEmpty()) {
            // If request expects JSON (from AJAX), return JSON response
            if ($request->wantsJson() || $request->ajax()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No medications found matching the specified criteria.',
                    'details' => 'Please try adjusting your filter settings or verify that you have medications in inventory.',
                    'data' => [
                        'group_by' => $validated['group_by'],
                        'stock_filter' => $validated['stock_filter'],
                        'include_zero_stock' => $validated['include_zero_stock'] ?? false,
                        'sort_by' => $validated['sort_by'],
                        'sort_direction' => $validated['sort_direction'],
                        'manager_name' => $manager->name . ' ' . $manager->surname
                    ]
                ], 404);
            }
            
            // For regular requests, redirect back with error message
            return redirect()->route('manager.reports.stock')
                ->with('error', 'No medications found matching the specified criteria. Please try adjusting your filter settings.');
        }

        // Group the data based on selected grouping method
        $groupedData = $this->groupStockData($medications, $validated['group_by']);

        // Calculate totals and statistics
        $totalMedications = $medications->count();
        $totalStockValue = $medications->sum(function ($med) {
            return $med->quantity_on_hand * $med->current_sale_price;
        });
        $lowStockCount = $medications->filter(function ($med) {
            return $med->quantity_on_hand <= $med->reorder_level;
        })->count();
        $outOfStockCount = $medications->where('quantity_on_hand', 0)->count();

        // Generate PDF
        $pdf = Pdf::loadView('pdf.manager.stock-report', [
            'manager' => $manager,
            'medications' => $medications,
            'groupedData' => $groupedData,
            'groupBy' => $validated['group_by'],
            'stockFilter' => $validated['stock_filter'],
            'includeZeroStock' => $validated['include_zero_stock'] ?? false,
            'sortBy' => $validated['sort_by'],
            'sortDirection' => $validated['sort_direction'],
            'totals' => [
                'medications' => $totalMedications,
                'stock_value' => $totalStockValue,
                'low_stock' => $lowStockCount,
                'out_of_stock' => $outOfStockCount
            ],
            'generatedAt' => now()->format('Y-m-d H:i:s')
        ]);

        $pdf->setPaper('A4', 'portrait');

        $filename = sprintf(
            'stock-report-%s-%s-%s.pdf',
            $validated['group_by'],
            $validated['stock_filter'],
            now()->format('Y-m-d-His')
        );

        // Save the PDF to storage
        $pdfContent = $pdf->output();
        $filePath = "reports/stock/{$filename}";
        Storage::disk('local')->put($filePath, $pdfContent);

        // Create report record
        $reportTitle = sprintf(
            'Stock Report (%s) - %s',
            ucfirst(str_replace('_', ' ', $validated['group_by'])),
            now()->format('Y-m-d H:i')
        );

        $report = GeneratedReport::create([
            'user_id' => Auth::id(),
            'report_type' => 'stock_report',
            'title' => $reportTitle,
            'file_path' => $filePath,
            'file_size' => strlen($pdfContent),
            'generated_at' => now(),
            'parameters' => $validated,
        ]);

        // For regular requests, download the PDF directly
        return response($pdfContent)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');
    }

    /**
     * Download a previously generated report
     */
    public function download($reportId)
    {
        $report = GeneratedReport::where('id', $reportId)
            ->where('user_id', Auth::id())
            ->where('report_type', 'stock_report')
            ->firstOrFail();

        if (!Storage::disk('local')->exists($report->file_path)) {
            return redirect()->route('manager.reports.stock')
                ->with('error', 'Report file no longer exists. Please generate a new report.');
        }

        // Increment download count
        $report->increment('download_count');

        $content = Storage::disk('local')->get($report->file_path);
        $filename = basename($report->file_path);

        return response($content)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');
    }

    /**
     * Group stock data by the specified method
     */
    private function groupStockData($medications, $groupBy)
    {
        switch ($groupBy) {
            case 'dosage_form':
                return $medications->groupBy(function ($medication) {
                    return $medication->dosageForm ? $medication->dosageForm->name : 'No Dosage Form';
                })->map(function ($group, $key) {
                    return [
                        'name' => $key,
                        'items' => $group,
                        'count' => $group->count(),
                        'total_value' => $group->sum(function ($med) {
                            return $med->quantity_on_hand * $med->current_sale_price;
                        }),
                        'low_stock_count' => $group->filter(function ($med) {
                            return $med->quantity_on_hand <= $med->reorder_level;
                        })->count()
                    ];
                });

            case 'schedule':
                return $medications->groupBy('schedule')->map(function ($group, $key) {
                    return [
                        'name' => $key ?: 'Unscheduled',
                        'items' => $group,
                        'count' => $group->count(),
                        'total_value' => $group->sum(function ($med) {
                            return $med->quantity_on_hand * $med->current_sale_price;
                        }),
                        'low_stock_count' => $group->filter(function ($med) {
                            return $med->quantity_on_hand <= $med->reorder_level;
                        })->count()
                    ];
                });

            case 'supplier':
                return $medications->groupBy(function ($medication) {
                    return $medication->supplier ? $medication->supplier->name : 'No Supplier';
                })->map(function ($group, $key) {
                    return [
                        'name' => $key,
                        'items' => $group,
                        'count' => $group->count(),
                        'total_value' => $group->sum(function ($med) {
                            return $med->quantity_on_hand * $med->current_sale_price;
                        }),
                        'low_stock_count' => $group->filter(function ($med) {
                            return $med->quantity_on_hand <= $med->reorder_level;
                        })->count()
                    ];
                });

            default:
                return collect();
        }
    }
}
