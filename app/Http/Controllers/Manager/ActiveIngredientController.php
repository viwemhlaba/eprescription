<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Models\Medication\ActiveIngredient; // Import the model
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class ActiveIngredientController extends Controller
{
    /**
     * Display a listing of the active ingredients.
     */
    public function index()
    {
        $activeIngredients = ActiveIngredient::paginate(10); // Paginate with 10 items per page

        return Inertia::render('Manager/ActiveIngredients/Index', [
            'activeIngredients' => $activeIngredients,
        ]);
    }

    /**
     * Show the form for creating a new active ingredient.
     */
    public function create()
    {
        return Inertia::render('Manager/ActiveIngredients/Create');
    }

    /**
     * Store a newly created active ingredient in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255|unique:active_ingredients,name', // Name must be unique
        ]);

        ActiveIngredient::create($validatedData);

        return redirect()->route('manager.activeIngredients.index')->with('success', 'Active ingredient added successfully!');
    }

    /**
     * Show the form for editing the specified active ingredient.
     */
    public function edit(ActiveIngredient $activeIngredient) // Route model binding
    {
        return Inertia::render('Manager/ActiveIngredients/Edit', [
            'activeIngredient' => $activeIngredient,
        ]);
    }

    /**
     * Update the specified active ingredient in storage.
     */
    public function update(Request $request, ActiveIngredient $activeIngredient) // Route model binding
    {
        $validatedData = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('active_ingredients')->ignore($activeIngredient->id), // Ignore current record's name
            ],
        ]);

        $activeIngredient->update($validatedData);

        return redirect()->route('manager.activeIngredients.index')->with('success', 'Active ingredient updated successfully!');
    }

    /**
     * Remove the specified active ingredient from storage.
     */
    public function destroy(ActiveIngredient $activeIngredient) // Route model binding
    {
        $activeIngredient->delete(); // Soft delete

        return redirect()->route('manager.activeIngredients.index')->with('success', 'Active ingredient deleted successfully!');
    }
}