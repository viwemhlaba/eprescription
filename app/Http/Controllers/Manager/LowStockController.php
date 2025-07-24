<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Models\Medication\Medication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class LowStockController extends Controller
{
    public function index()
    {
        // Get IDs of medications that already have pending orders
        $medicationsWithPendingOrders = DB::table('stock_order_items')
            ->join('stock_orders', 'stock_order_items.stock_order_id', '=', 'stock_orders.id')
            ->where('stock_orders.status', 'Pending')
            ->pluck('stock_order_items.medication_id')
            ->toArray();

        // Get medications that are out of stock (excluding those with pending orders)
        $outOfStockMedications = Medication::with('supplier')
            ->where('quantity_on_hand', 0)
            ->whereNotIn('id', $medicationsWithPendingOrders)
            ->orderBy('name')
            ->get();

        // Get medications at or below reorder level (critical) (excluding those with pending orders)
        $criticalMedications = Medication::with('supplier')
            ->whereColumn('quantity_on_hand', '<=', 'reorder_level')
            ->where('quantity_on_hand', '>', 0) // Exclude out of stock items
            ->whereNotIn('id', $medicationsWithPendingOrders)
            ->orderBy('quantity_on_hand', 'asc')
            ->get();

        // Get medications that are low but not critical (within 10 units of reorder level) (excluding those with pending orders)
        $lowStockMedications = Medication::with('supplier')
            ->whereRaw('quantity_on_hand > reorder_level AND quantity_on_hand <= reorder_level + 10')
            ->whereNotIn('id', $medicationsWithPendingOrders)
            ->orderBy('quantity_on_hand', 'asc')
            ->get();

        // Get medications that have pending orders for reference
        $medicationsWithOrders = Medication::with(['supplier', 'pendingOrderItems.stockOrder'])
            ->whereIn('id', $medicationsWithPendingOrders)
            ->orderBy('name')
            ->get();

        return Inertia::render('Manager/LowStockOverview', [
            'critical_medications' => $criticalMedications,
            'low_stock_medications' => $lowStockMedications,
            'out_of_stock_medications' => $outOfStockMedications,
            'medications_with_orders' => $medicationsWithOrders,
        ]);
    }
}
