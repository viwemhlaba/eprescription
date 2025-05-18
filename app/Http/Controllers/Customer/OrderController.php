<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Customer\Prescription;
use App\Models\Customer\Order;
use App\Models\Customer\OrderItem;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::withCount('items')
            ->where('customer_id', Auth::user()->customer->id)
            ->latest()
            ->get();

        return Inertia::render('Customer/Orders/Index', [
            'orders' => $orders,
        ]);
    }

    public function create()
    {
        $prescriptions = Prescription::where('user_id', Auth::id())
            ->whereIn('status', ['approved', 'dispensed'])
            ->get();

        return Inertia::render('Customer/Orders/Create', [
            'prescriptions' => $prescriptions,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'prescription_ids' => 'required|array|min:1',
            'prescription_ids.*' => 'exists:prescriptions,id',
        ]);

        $order = Order::create([
            'customer_id' => Auth::user()->customer->id,
            'order_date' => now(),
            'status' => 'pending',
            'total_amount_due' => 0, // can be calculated later
        ]);

        foreach ($request->prescription_ids as $prescriptionId) {
            OrderItem::create([
                'order_id' => $order->id,
                'prescription_id' => $prescriptionId,
            ]);
        }

        return redirect()->route('customer.orders.index')->with('success', 'Order placed successfully.');
    }

    public function show(Order $order)
{
    if ($order->customer_id !== Auth::user()->customer->id) {
        abort(403);
    }

    $order->load(['items.prescription']); // eager load prescriptions

    return Inertia::render('Customer/Orders/Show', [
        'order' => $order,
    ]);
}
}
