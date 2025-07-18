<?php

namespace App\Http\Controllers\Pharmacist;

use App\Http\Controllers\Controller;
use App\Models\Medication\Medication;
use App\Models\DispensedItem;
use App\Models\Customer\Prescription;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PharmacistStockController extends Controller
{
    public function index()
    {
        // Get total medications count
        $totalMedications = Medication::count();
        
        // Get low stock medications (where quantity_on_hand <= reorder_level)
        $lowStockCount = Medication::whereColumn('quantity_on_hand', '<=', 'reorder_level')->count();
        
        // Get out of stock medications (quantity_on_hand = 0)
        $outOfStockCount = Medication::where('quantity_on_hand', 0)->count();
        
        // Calculate total stock value (quantity_on_hand * current_sale_price)
        $totalStockValue = Medication::select(DB::raw('SUM(quantity_on_hand * current_sale_price) as total_value'))
            ->value('total_value') ?? 0;
            
        // Get medications dispensed today
        $dispensedToday = DispensedItem::whereDate('dispensed_at', Carbon::today())->count();
        
        // Get pending prescriptions count
        $pendingPrescriptions = Prescription::where('status', 'pending')->count();
        
        // Get total dispensed value this month
        $dispensedValueMonth = DispensedItem::whereMonth('dispensed_at', Carbon::now()->month)
            ->whereYear('dispensed_at', Carbon::now()->year)
            ->sum('cost') ?? 0;
            
        // Get critical stock medications (less than 5 units)
        $criticalStockCount = Medication::where('quantity_on_hand', '<', 5)->count();
        
        // Get expired medications (this would need an expiry_date column, for now we'll use 0)
        $expiredMedicationsCount = 0; // Placeholder since expiry_date column might not exist
        
        // Get top 5 most dispensed medications this month
        $topDispensedMedications = DispensedItem::select('medication_id', DB::raw('SUM(quantity_dispensed) as total_dispensed'))
            ->whereMonth('dispensed_at', Carbon::now()->month)
            ->whereYear('dispensed_at', Carbon::now()->year)
            ->with('medication:id,name')
            ->groupBy('medication_id')
            ->orderBy('total_dispensed', 'desc')
            ->limit(5)
            ->get();

        return Inertia::render('Pharmacist/Stock', [
            'stockData' => [
                'total_medications' => $totalMedications,
                'low_stock_count' => $lowStockCount,
                'out_of_stock_count' => $outOfStockCount,
                'total_stock_value' => round($totalStockValue, 2),
                'dispensed_today' => $dispensedToday,
                'pending_prescriptions' => $pendingPrescriptions,
                'dispensed_value_month' => round($dispensedValueMonth, 2),
                'critical_stock_count' => $criticalStockCount,
                'expired_medications_count' => $expiredMedicationsCount,
                'top_dispensed_medications' => $topDispensedMedications
            ]
        ]);
    }
}
