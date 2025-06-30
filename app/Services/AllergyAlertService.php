<?php

namespace App\Services;

use App\Models\User;
use App\Models\Medication\Medication;
use App\Models\Customer\Prescription;

class AllergyAlertService
{
    /**
     * Check for allergy conflicts when adding medication to a prescription
     */
    public function checkMedicationAllergyConflicts(User $customer, Medication $medication)
    {
        // Get all active ingredients in the medication
        $medicationIngredients = $medication->activeIngredients;
        
        // Get customer's allergic ingredients
        $customerAllergies = $customer->getAllergicActiveIngredients;
        
        // Find conflicts (intersection of medication ingredients and customer allergies)
        $conflicts = $medicationIngredients->intersect($customerAllergies);
        
        return [
            'has_conflicts' => $conflicts->isNotEmpty(),
            'conflicts' => $conflicts,
            'conflict_count' => $conflicts->count(),
            'medication_name' => $medication->name,
            'customer_name' => $customer->name
        ];
    }

    /**
     * Check for allergy conflicts for multiple medications
     */
    public function checkMultipleMedicationConflicts(User $customer, array $medications)
    {
        $allConflicts = collect();
        $medicationConflicts = [];

        foreach ($medications as $medication) {
            $result = $this->checkMedicationAllergyConflicts($customer, $medication);
            
            if ($result['has_conflicts']) {
                $medicationConflicts[] = $result;
                $allConflicts = $allConflicts->merge($result['conflicts']);
            }
        }

        return [
            'has_any_conflicts' => !empty($medicationConflicts),
            'medication_conflicts' => $medicationConflicts,
            'all_conflicting_ingredients' => $allConflicts->unique('id'),
            'total_conflict_count' => $allConflicts->unique('id')->count()
        ];
    }

    /**
     * Generate a formatted alert message for conflicts
     */
    public function generateAlertMessage(array $conflictResult)
    {
        if (!$conflictResult['has_conflicts']) {
            return null;
        }

        $conflictNames = $conflictResult['conflicts']->pluck('name')->toArray();
        $conflictList = implode(', ', $conflictNames);

        return "⚠️ ALLERGY ALERT: Patient {$conflictResult['customer_name']} is allergic to the following active ingredient(s) in {$conflictResult['medication_name']}: {$conflictList}";
    }

    /**
     * Generate alert messages for multiple medication conflicts
     */
    public function generateMultipleAlertMessages(array $multipleConflictResult)
    {
        if (!$multipleConflictResult['has_any_conflicts']) {
            return [];
        }

        $messages = [];
        foreach ($multipleConflictResult['medication_conflicts'] as $conflict) {
            $messages[] = $this->generateAlertMessage($conflict);
        }

        return $messages;
    }

    /**
     * Check prescription for allergy conflicts
     */
    public function checkPrescriptionAllergyConflicts(Prescription $prescription)
    {
        $customer = $prescription->user; // This returns the actual User instance
        $medications = $prescription->items()->with('medication.activeIngredients')->get()
            ->pluck('medication')->filter();

        return $this->checkMultipleMedicationConflicts($customer, $medications->all());
    }
}
