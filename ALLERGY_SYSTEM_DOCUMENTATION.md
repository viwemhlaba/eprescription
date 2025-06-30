# Allergy Alert System Documentation

## Overview
The allergy alert system has been implemented to prevent dispensing medications that contain active ingredients a customer is allergic to. This system provides real-time alerts when pharmacists add medications to prescriptions.

## Database Structure

### Customer Allergies Table (`customer_allergies`)
- `id` - Primary key
- `user_id` - Foreign key to users table (the customer)
- `active_ingredient_id` - Foreign key to active_ingredients table
- `created_at`, `updated_at` - Timestamps

### Active Ingredient Medication Pivot Table (`active_ingredient_medication`)
- `id` - Primary key  
- `medication_id` - Foreign key to medications table
- `active_ingredient_id` - Foreign key to active_ingredients table
- `strength` - The strength/dosage of the active ingredient (e.g., "500mg")

## Model Relationships

### User Model
- `allergies()` - HasMany relationship to CustomerAllergy
- `isAllergicTo($activeIngredientId)` - Check if user is allergic to specific ingredient
- `isAllergicToMedication($medication)` - Check if user is allergic to any ingredient in medication
- `getAllergicActiveIngredients()` - Get all active ingredients user is allergic to
- `getAllergyConflicts($medication)` - Get specific conflicts between user allergies and medication

### Medication Model  
- `activeIngredients()` - BelongsToMany relationship with strength pivot
- `hasAllergyConflictsWith(User $customer)` - Check if medication conflicts with customer allergies
- `getAllergyConflictsWith(User $customer)` - Get specific allergy conflicts

### ActiveIngredient Model
- `medications()` - BelongsToMany relationship to medications 
- `allergicCustomers()` - HasMany relationship to CustomerAllergy

### CustomerAllergy Model
- `user()` - BelongsTo relationship to User
- `activeIngredient()` - BelongsTo relationship to ActiveIngredient

## Services

### AllergyAlertService
Located in `app/Services/AllergyAlertService.php`

Key Methods:
- `checkMedicationAllergyConflicts(User $customer, Medication $medication)` - Check single medication
- `checkMultipleMedicationConflicts(User $customer, array $medications)` - Check multiple medications
- `generateAlertMessage(array $conflictResult)` - Generate formatted alert message
- `checkPrescriptionAllergyConflicts(Prescription $prescription)` - Check entire prescription

## Integration Points

### PharmacistPrescriptionController
The main integration is in the `storeLoaded()` method where medications are added to prescriptions:

```php
// Check for allergy conflicts before adding medications
$allergyAlerts = [];

foreach ($validated['items'] as $item) {
    $medication = Medication::with('activeIngredients')->findOrFail($item['medication_id']);
    
    // Check for allergy conflicts using direct database query
    if ($customer) {
        $medicationIngredientIds = $medication->activeIngredients->pluck('id');
        $conflicts = $customer->allergies()
            ->whereIn('active_ingredient_id', $medicationIngredientIds)
            ->with('activeIngredient')
            ->get();
            
        if ($conflicts->isNotEmpty()) {
            $conflictNames = $conflicts->pluck('activeIngredient.name')->implode(', ');
            $allergyAlerts[] = "⚠️ ALLERGY ALERT: Patient {$customer->name} is allergic to the following active ingredient(s) in {$medication->name}: {$conflictNames}";
        }
    }
    
    // ... rest of medication processing
}

// If there are allergy alerts, return them as warnings
if (!empty($allergyAlerts)) {
    return back()->with([
        'allergy_alerts' => $allergyAlerts,
        'success' => 'Prescription updated successfully, but please review allergy alerts.'
    ]);
}
```

## API Endpoints

### Check Medication Allergy
**POST** `/api/check-medication-allergy`
- Parameters: `user_id`, `medication_id`
- Returns: Conflict status and details

### Get User Allergies  
**GET** `/api/user-allergies/{user_id}`
- Returns: List of user's allergies with active ingredient details

### Get Medication Ingredients
**GET** `/api/medication-ingredients/{medication_id}` 
- Returns: List of active ingredients in medication with strengths

## Usage Examples

### Adding Customer Allergies
```php
// Add allergy for customer
CustomerAllergy::create([
    'user_id' => $customerId,
    'active_ingredient_id' => $activeIngredientId
]);
```

### Checking for Conflicts Manually
```php
$user = User::with('allergies.activeIngredient')->find($userId);
$medication = Medication::with('activeIngredients')->find($medicationId);

// Check if user is allergic to this medication
if ($user->isAllergicToMedication($medication)) {
    $conflicts = $user->getAllergyConflicts($medication);
    // Handle conflicts...
}
```

### Using the Service
```php
$allergyService = new AllergyAlertService();
$result = $allergyService->checkMedicationAllergyConflicts($user, $medication);

if ($result['has_conflicts']) {
    $alertMessage = $allergyService->generateAlertMessage($result);
    // Display alert to pharmacist
}
```

## Frontend Integration

When pharmacists are adding medications to prescriptions, the system will:

1. Load customer allergies data in the prescription loading view
2. Check for conflicts when medications are added
3. Display prominent alerts if conflicts are found
4. Allow pharmacists to proceed with warnings (but with full awareness)

The allergy data is passed to frontend views:

```php
'customerAllergies' => $prescription->user->allergies->map(function ($allergy) {
    return [
        'id' => $allergy->id,
        'active_ingredient_id' => $allergy->active_ingredient_id,
        'active_ingredient_name' => $allergy->activeIngredient->name ?? 'Unknown Active Ingredient',
    ];
})->toArray()
```

## Security Considerations

- Only authenticated pharmacists and managers can access allergy checking APIs
- Allergy alerts are warnings, not hard stops (pharmacist can override with medical justification)
- All allergy checks are logged in the prescription processing flow

## Future Enhancements

1. **Allergy Severity Levels** - Add severity ratings (mild, moderate, severe)
2. **Allergy Logging** - Log when allergies are overridden with justification
3. **Alternative Medication Suggestions** - Suggest allergy-safe alternatives
4. **Real-time Frontend Alerts** - Add JavaScript-based real-time checking
5. **Email Notifications** - Notify doctors when allergies are detected
6. **Allergy History Tracking** - Track when allergies were added/modified

## Testing

Use the API endpoints to test the functionality:

```bash
# Test allergy checking
curl -X POST /api/check-medication-allergy \
  -H "Content-Type: application/json" \
  -d '{"user_id": 1, "medication_id": 1}'

# Get user allergies  
curl /api/user-allergies/1

# Get medication ingredients
curl /api/medication-ingredients/1
```
