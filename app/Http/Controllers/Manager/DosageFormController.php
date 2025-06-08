<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Models\Medication\DosageForm; // IMPORTANT: Use the correct namespace for your model
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class DosageFormController extends Controller
{
    /**
     * Display a listing of the dosage forms.
     */
    public function index()
    {
        $dosageForms = DosageForm::paginate(10); // Paginate with 10 items per page

        return Inertia::render('Manager/DosageForms/Index', [
            'dosageForms' => $dosageForms,
        ]);
    }

    /**
     * Show the form for creating a new dosage form.
     */
    public function create()
    {
        return Inertia::render('Manager/DosageForms/Create');
    }

    /**
     * Store a newly created dosage form in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255|unique:dosage_forms,name', // Name must be unique
        ]);

        DosageForm::create($validatedData);

        return redirect()->route('manager.dosageForms.index')->with('success', 'Dosage form added successfully!');
    }

    /**
     * Show the form for editing the specified dosage form.
     */
    public function edit(DosageForm $dosageForm) // Route model binding
    {
        return Inertia::render('Manager/DosageForms/Edit', [
            'dosageForm' => $dosageForm,
        ]);
    }

    /**
     * Update the specified dosage form in storage.
     */
    public function update(Request $request, DosageForm $dosageForm) // Route model binding
    {
        $validatedData = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('dosage_forms')->ignore($dosageForm->id), // Ignore current record's name
            ],
        ]);

        $dosageForm->update($validatedData);

        return redirect()->route('manager.dosageForms.index')->with('success', 'Dosage form updated successfully!');
    }

    /**
     * Remove the specified dosage form from storage.
     */
    public function destroy(DosageForm $dosageForm) // Route model binding
    {
        $dosageForm->delete(); // Soft delete

        return redirect()->route('manager.dosageForms.index')->with('success', 'Dosage form deleted successfully!');
    }
}