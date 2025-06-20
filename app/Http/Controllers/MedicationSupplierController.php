<?php

namespace App\Http\Controllers;

use App\Models\MedicationSupplier;
use Illuminate\Http\Request;
use App\Http\Requests\StoreMedicationSupplierRequest;
use App\Http\Requests\UpdateMedicationSupplierRequest;
use Inertia\Inertia;

class MedicationSupplierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $suppliers = MedicationSupplier::all();
        return Inertia::render('Manager/Suppliers/Index', [
            'suppliers' => $suppliers,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Manager/Suppliers/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMedicationSupplierRequest $request)
    {
        $supplier = MedicationSupplier::create($request->validated());

        return redirect()->route('manager.suppliers.index')->with('success', 'Supplier created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $supplier = MedicationSupplier::findOrFail($id);
        return response()->json($supplier);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $supplier = MedicationSupplier::findOrFail($id);
        return Inertia::render('Manager/Suppliers/Edit', [
            'supplier' => $supplier,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMedicationSupplierRequest $request, string $id)
    {
        $supplier = MedicationSupplier::findOrFail($id);
        $supplier->update($request->validated());

        return redirect()->route('manager.suppliers.index')->with('success', 'Supplier updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $supplier = MedicationSupplier::findOrFail($id);
        $supplier->delete();

        return response()->json(null, 204);
    }
}
