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
        $orders = StockOrder::with('supplier')->latest()->paginate(10);

        return Inertia::render('Manager/Orders/Index', [
            'orders' => $orders,
        ]);
    }

    public function create()
    {
        $medicationsToReorder = Medication::whereRaw('quantity_on_hand <= reorder_level + 10')
            ->with('supplier')
            ->get()
            ->groupBy('supplier.name');

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
