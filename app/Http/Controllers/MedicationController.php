<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Medication\Medication;
use App\Models\Medication\DosageForm;
use App\Models\Medication\ActiveIngredient;
use App\Models\MedicationSupplier;
use App\Http\Requests\StoreMedicationRequest;
use App\Http\Requests\UpdateMedicationRequest;
use App\Http\Requests\Medication\SetMedicationStockRequest;
use App\Http\Requests\Medication\AddMedicationStockRequest;
use Inertia\Inertia;

class MedicationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $medications = Medication::with(['dosageForm', 'supplier', 'activeIngredients'])->paginate(15);
        return Inertia::render('Manager/Medication/Index', [
            'medications' => $medications
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $dosageForms = DosageForm::all();
        $suppliers = MedicationSupplier::all();
        $activeIngredients = ActiveIngredient::all();
        return Inertia::render('Manager/Medication/Create', [
            'dosageForms' => $dosageForms,
            'suppliers' => $suppliers,
            'activeIngredients' => $activeIngredients
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMedicationRequest $request)
    {
        $data = $request->validated();
        $activeIngredients = $request->input('active_ingredients', []); // array of ['id' => ..., 'strength' => ...]
        $medication = Medication::create($data);
        if (!empty($activeIngredients)) {
            $syncData = collect($activeIngredients)->mapWithKeys(fn($item) => [
                $item['id'] => ['strength' => $item['strength']]
            ])->toArray();
            $medication->activeIngredients()->sync($syncData);
        }
        // Redirect to medications index with success message (Inertia response)
        return redirect()->route('manager.medications.index')->with('success', 'Medication added successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $medication = Medication::with(['dosageForm', 'supplier', 'activeIngredients'])->findOrFail($id);
        return response()->json($medication);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $medication = Medication::with(['dosageForm', 'supplier', 'activeIngredients'])->findOrFail($id);
        $dosageForms = DosageForm::all();
        $suppliers = MedicationSupplier::all();
        $activeIngredients = ActiveIngredient::all();
        return Inertia::render('Manager/Medication/Edit', [
            'medication' => $medication,
            'dosageForms' => $dosageForms,
            'suppliers' => $suppliers,
            'activeIngredients' => $activeIngredients
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMedicationRequest $request, $id)
    {
        $medication = Medication::findOrFail($id);
        $data = $request->validated();
        $activeIngredients = $request->input('active_ingredients', []); // array of ['id' => ..., 'strength' => ...]
        $medication->update($data);
        if (!empty($activeIngredients)) {
            $syncData = collect($activeIngredients)->mapWithKeys(fn($item) => [
                $item['id'] => ['strength' => $item['strength']]
            ])->toArray();
            $medication->activeIngredients()->sync($syncData);
        }
        return response()->json($medication->load(['dosageForm', 'supplier', 'activeIngredients']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $medication = Medication::findOrFail($id);
        $medication->delete();
        return response()->json(null, 204);
    }

    public function setStock(SetMedicationStockRequest $request, Medication $medication)
    {
        $medication->update([
            'quantity_on_hand' => $request->validated()['quantity'],
        ]);

        return redirect()->back()->with('success', 'Stock quantity set successfully.');
    }

    public function addStock(AddMedicationStockRequest $request, Medication $medication)
    {
        $medication->increment('quantity_on_hand', $request->validated()['quantity']);

        return redirect()->back()->with('success', 'Stock quantity added successfully.');
    }
}
