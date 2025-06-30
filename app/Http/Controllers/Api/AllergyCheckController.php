<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Medication\Medication;
use App\Services\AllergyAlertService;
use Illuminate\Http\Request;

class AllergyCheckController extends Controller
{
    public function checkMedicationAllergy(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'medication_id' => 'required|exists:medications,id'
        ]);

        $user = User::with('allergies.activeIngredient')->findOrFail($request->user_id);
        $medication = Medication::with('activeIngredients')->findOrFail($request->medication_id);

        $allergyService = new AllergyAlertService();
        $result = $allergyService->checkMedicationAllergyConflicts($user, $medication);

        return response()->json([
            'success' => true,
            'user_name' => $user->name,
            'medication_name' => $medication->name,
            'has_conflicts' => $result['has_conflicts'],
            'conflicts' => $result['conflicts']->map(function($ingredient) {
                return [
                    'id' => $ingredient->id,
                    'name' => $ingredient->name
                ];
            }),
            'alert_message' => $result['has_conflicts'] ? 
                $allergyService->generateAlertMessage($result) : null
        ]);
    }

    public function getUserAllergies(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id'
        ]);

        $user = User::with('allergies.activeIngredient')->findOrFail($request->user_id);

        return response()->json([
            'success' => true,
            'user_name' => $user->name,
            'allergies' => $user->allergies->map(function($allergy) {
                return [
                    'id' => $allergy->id,
                    'active_ingredient_id' => $allergy->active_ingredient_id,
                    'active_ingredient_name' => $allergy->activeIngredient->name ?? 'Unknown'
                ];
            })
        ]);
    }

    public function getMedicationIngredients(Request $request)
    {
        $request->validate([
            'medication_id' => 'required|exists:medications,id'
        ]);

        $medication = Medication::with('activeIngredients')->findOrFail($request->medication_id);

        return response()->json([
            'success' => true,
            'medication_name' => $medication->name,
            'active_ingredients' => $medication->activeIngredients->map(function($ingredient) {
                return [
                    'id' => $ingredient->id,
                    'name' => $ingredient->name,
                    'strength' => $ingredient->pivot->strength ?? 'Not specified'
                ];
            })
        ]);
    }
}
