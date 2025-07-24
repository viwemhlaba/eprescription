<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Models\Medication\Medication;
use App\Models\StockOrder;
use App\Models\User;
use App\Models\Customer\Prescription;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class ManagerDashboardController extends Controller
{
    public function index()
    {
        // Get low stock medications (within reorder level + 10)
        $lowStockMedications = Medication::with('supplier')
            ->whereRaw('quantity_on_hand <= reorder_level + 10')
            ->orderBy('quantity_on_hand', 'asc')
            ->limit(10)
            ->get();

        // Get critical stock medications (at or below reorder level)
        $criticalStockCount = Medication::whereColumn('quantity_on_hand', '<=', 'reorder_level')->count();
        
        // Get out of stock medications
        $outOfStockCount = Medication::where('quantity_on_hand', 0)->count();
        
        // Get pending orders
        $pendingOrders = StockOrder::where('status', 'Pending')->count();
        
        // Get total pharmacists
        $totalPharmacists = User::where('role', 'pharmacist')->count();
        
        // Get total medications
        $totalMedications = Medication::count();
        
        // Get recent orders (last 5)
        $recentOrders = StockOrder::with('supplier')
            ->latest()
            ->limit(5)
            ->get();
            
        // Get prescriptions needing attention
        $pendingPrescriptions = Prescription::where('status', 'pending')->count();
        
        // Get alerts for dashboard
        $alerts = [];
        
        // Add low stock alerts
        foreach ($lowStockMedications->take(5) as $medication) {
            if ($medication->quantity_on_hand <= $medication->reorder_level) {
                $alerts[] = [
                    'type' => 'Low Stock',
                    'description' => "{$medication->name} - {$medication->quantity_on_hand} units remaining (Reorder level: {$medication->reorder_level})",
                    'priority' => 'High',
                    'date' => 'Today',
                    'medication_id' => $medication->id,
                    'action_type' => 'reorder'
                ];
            }
        }
        
        // Add pending orders alerts
        if ($pendingOrders > 0) {
            $alerts[] = [
                'type' => 'Pending Orders',
                'description' => "{$pendingOrders} stock orders awaiting delivery",
                'priority' => 'Medium',
                'date' => 'Various',
                'action_type' => 'view_orders'
            ];
        }

        return Inertia::render('Manager/Dashboard', [
            'stats' => [
                'total_medications' => $totalMedications,
                'total_pharmacists' => $totalPharmacists,
                'critical_stock_count' => $criticalStockCount,
                'out_of_stock_count' => $outOfStockCount,
                'pending_orders' => $pendingOrders,
                'pending_prescriptions' => $pendingPrescriptions,
            ],
            'low_stock_medications' => $lowStockMedications,
            'recent_orders' => $recentOrders,
            'alerts' => $alerts,
        ]);
    }
}
