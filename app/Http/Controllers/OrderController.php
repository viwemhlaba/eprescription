<?php

namespace App\Http\Controllers;

use App\Models\Medication\Medication;
use App\Models\StockOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Mail\StockOrderPlaced;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $orders = StockOrder::with(['supplier', 'items'])
            ->latest()
            ->paginate(10);

        // Transform the data to include necessary fields
        $orders->getCollection()->transform(function ($order) {
            return [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'supplier_name' => $order->supplier->name ?? 'Unknown Supplier',
                'status' => $order->status,
                'total_items' => $order->items->sum('quantity'),
                'created_at' => $order->created_at,
                'received_at' => $order->received_at,
            ];
        });

        return Inertia::render('Manager/Orders/Index', [
            'orders' => $orders,
        ]);
    }

    public function create(Request $request)
    {
        // Get IDs of medications that already have pending orders
        $medicationsWithPendingOrders = DB::table('stock_order_items')
            ->join('stock_orders', 'stock_order_items.stock_order_id', '=', 'stock_orders.id')
            ->where('stock_orders.status', 'Pending')
            ->pluck('stock_order_items.medication_id')
            ->toArray();

        // If a specific medication is provided, filter for that
        $medicationId = $request->get('medication');
        
        if ($medicationId) {
            $medicationsToReorder = Medication::with('supplier')
                ->where('id', $medicationId)
                ->whereNotIn('id', $medicationsWithPendingOrders)
                ->get()
                ->groupBy('supplier.name');
        } else {
            // Get medications that are at or within 10 units of reorder level (excluding those with pending orders)
            $medicationsToReorder = Medication::whereRaw('quantity_on_hand <= reorder_level + 10')
                ->with('supplier')
                ->whereNotIn('id', $medicationsWithPendingOrders)
                ->orderBy('quantity_on_hand', 'asc')
                ->get()
                ->groupBy('supplier.name');
        }

        return Inertia::render('Manager/Orders/CreateStockOrder', [
            'medicationsToReorder' => $medicationsToReorder,
        ]);
    }

    public function show(StockOrder $order)
    {
        $order->load(['supplier', 'items.medication']);

        return Inertia::render('Manager/Orders/Show', [
            'order' => $order,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'medications' => 'required|array',
            'medications.*.id' => 'required|integer|exists:medications,id',
            'medications.*.quantity' => 'required|integer|min:1',
        ]);

        $medications = collect($validated['medications']);

        $medicationsBySupplier = Medication::with('supplier')
            ->whereIn('id', $medications->pluck('id'))
            ->get()
            ->groupBy('supplier_id');

        DB::transaction(function () use ($medicationsBySupplier, $medications) {
            foreach ($medicationsBySupplier as $supplierId => $supplierMedications) {
                $order = StockOrder::create([
                    'order_number' => StockOrder::generateOrderNumber(),
                    'supplier_id' => $supplierId,
                    'status' => 'Pending',
                ]);

                foreach ($supplierMedications as $medication) {
                    $order->items()->create([
                        'medication_id' => $medication->id,
                        'quantity' => $medications->firstWhere('id', $medication->id)['quantity'],
                    ]);
                }

                Mail::to($order->supplier->email)->send(new StockOrderPlaced($order));
            }
        });

        return redirect()->route('manager.orders.index')->with('success', 'Orders placed successfully.');
    }

    public function receive(StockOrder $order)
    {
        $order->load('items.medication');

        DB::transaction(function () use ($order) {
            foreach ($order->items as $item) {
                $medication = $item->medication;
                $medication->quantity_on_hand += $item->quantity;
                $medication->save();
            }

            $order->status = 'Received';
            $order->save();
        });

        return redirect()->route('manager.orders.index')->with('success', 'Order marked as received and stock updated.');
    }
}
