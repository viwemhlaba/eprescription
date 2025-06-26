<?php

namespace App\Http\Controllers\Pharmacist;

use App\Http\Controllers\Controller;
use App\Models\Customer\Prescription;
use App\Models\Medication\Medication;
use App\Models\Customer\PrescriptionItem;
use App\Models\Doctor;
use App\Models\User; // <--- Ensure User model is imported
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Mail\PrescriptionApprovedMail;
use App\Mail\PrescriptionReadyCollectionMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;


// Add this import for the Allergy model if you have one, or adjust as needed
use App\Models\CustomerAllergy;
use App\Models\Medication\ActiveIngredient; // <--- ADD THIS IMPORT for ActiveIngredient
use App\Models\DispensedItem;

class PharmacistPrescriptionController extends Controller
{
    public function index()
    {
        $prescriptions = Prescription::with('user') // eager load customer
            ->where('status', 'pending')
            ->latest()
            ->get()
            ->map(function ($prescription) {
                return [
                    'id' => $prescription->id,
                    'customer_name' => $prescription->user->name ?? 'Unknown',
                    'prescription_name' => $prescription->name,
                    'upload_date' => $prescription->created_at->format('Y-m-d'),
                    'status' => $prescription->status,
                    'file_path' => $prescription->file_path,
                    'repeats_total' => $prescription->repeats_total,
                    'repeats_used' => $prescription->repeats_used,
                    'next_repeat_date' => $prescription->next_repeat_date ? Carbon::parse($prescription->next_repeat_date)->format('Y-m-d') : null,
                    'delivery_method' => $prescription->delivery_method,
                ];
            });

        return inertia('Pharmacist/Prescriptions/Index', [
            'prescriptions' => $prescriptions,
        ]);
    }

    public function load($id)
    {
        $prescription = Prescription::with([
            'user.allergies.activeIngredient', // <--- MODIFIED: Eager load user -> allergies -> activeIngredient
            'doctor:id,name',
            'items.medication:id,name,current_sale_price',
        ])->findOrFail($id);

        // Fetch all doctors and medications
        $doctors = Doctor::select('id', 'name')->get();
        $medications = Medication::select('id', 'name', 'current_sale_price')
            ->with('activeIngredients')
            ->get()
            ->map(function ($med) {
                return [
                    'id' => $med->id,
                    'name' => $med->name,
                    'current_sale_price' => (float) $med->current_sale_price,
                    'active_ingredients' => $med->activeIngredients->pluck('id')->toArray(),
                ];
            });

        // Fetch customer's allergies, mapping to include name
        $customerAllergies = []; // <--- MODIFIED: Renamed to customerAllergies
        if ($prescription->user && $prescription->user->allergies) {
            $customerAllergies = $prescription->user->allergies->map(function ($allergy) {
                return [
                    'id' => $allergy->id,
                    'active_ingredient_id' => $allergy->active_ingredient_id,
                    'active_ingredient_name' => $allergy->activeIngredient->name ?? 'Unknown Active Ingredient',
                    // Add any other relevant allergy details you want to pass to the frontend
                ];
            })->toArray();
        }

        return inertia('Pharmacist/Prescriptions/LoadPrescription', [
            'prescription' => $prescription, // Pass the entire prescription object
            'doctors' => $doctors,
            'medications' => $medications,
            'customerAllergies' => $customerAllergies, // <--- MODIFIED: Pass the mapped allergies
            'existingPrescriptionItems' => $prescription->items->map(function ($item) {
                return [
                    'medication_id' => $item->medication_id,
                    'quantity' => $item->quantity,
                    'instructions' => $item->instructions,
                ];
            }),
        ]);
    }

    public function create(Prescription $prescription)
    {
        // MODIFIED: Eager load user -> allergies -> activeIngredient
        $prescription->loadMissing('user.allergies.activeIngredient');

        $doctors = Doctor::select('id', 'name')->get();
        $medications = Medication::select('id', 'name', 'current_sale_price')
            ->with('activeIngredients')
            ->get()
            ->map(function ($med) {
                return [
                    'id' => $med->id,
                    'name' => $med->name,
                    'current_sale_price' => (float) $med->current_sale_price,
                    'active_ingredients' => $med->activeIngredients->pluck('id')->toArray(),
                ];
            });

        // Fetch customer's allergies, mapping to include name
        $customerAllergies = []; // <--- MODIFIED: Renamed to customerAllergies
        if ($prescription->user && $prescription->user->allergies) {
            $customerAllergies = $prescription->user->allergies->map(function ($allergy) {
                return [
                    'id' => $allergy->id,
                    'active_ingredient_id' => $allergy->active_ingredient_id,
                    'active_ingredient_name' => $allergy->activeIngredient->name ?? 'Unknown Active Ingredient',
                ];
            })->toArray();
        }

        return Inertia::render('Pharmacist/Prescriptions/LoadPrescription', [
            'prescription' => $prescription, // Pass the entire prescription object
            'doctors' => $doctors,
            'medications' => $medications,
            'customerAllergies' => $customerAllergies, // <--- MODIFIED: Pass the mapped allergies
            'existingPrescriptionItems' => $prescription->items->map(function ($item) {
                return [
                    'medication_id' => $item->medication_id,
                    'quantity' => $item->quantity,
                    'instructions' => $item->instructions,
                ];
            }),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'prescription_name' => 'required|string|max:255',
            'delivery_method' => 'required|string|in:pickup,dispense',
            'notes' => 'nullable|string',
            'file' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);

        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('prescriptions');
            $validated['file_path'] = $path;
        }

        Prescription::create($validated);

        return redirect()->route('pharmacist.prescriptions.index')
            ->with('success', 'Prescription created successfully.');
    }

    public function storeLoaded(Request $request, Prescription $prescription)
    {
        $validated = $request->validate([
            'patient_id_number' => 'required|string|max:255',
            'doctor_id' => 'required|exists:doctors,id',
            'repeats_total' => 'required|integer|min:0|max:99', // Add max limit for safety
            'items' => 'required|array|min:1', // Ensure at least one item
            'items.*.medication_id' => 'required|exists:medications,id',
            'items.*.quantity' => 'required|integer|min:1|max:999', // Add max limit
            'items.*.instructions' => 'nullable|string|max:500', // Add max length
            'status' => 'required|in:approved,dispensed,rejected', // Validate status
            'notes' => 'nullable|string|max:1000', // Add notes validation
        ]);

        // Check if prescription can be updated (business logic)
        if (in_array($prescription->status, ['dispensed', 'rejected'])) {
            return back()->withErrors(['status' => 'This prescription cannot be modified.']);
        }

        $prescription->update([
            'patient_id_number' => $validated['patient_id_number'],
            'doctor_id' => $validated['doctor_id'],
            'status' => $validated['status'],
            'repeats_total' => $validated['repeats_total'],
            'repeats_used' => 0, // Reset repeats used
            'next_repeat_date' => null, // Clear next repeat date
        ]);

        // Ensure $prescription->user is loaded before trying to access its email
        $prescription->loadMissing('user');
        if ($prescription->user && $validated['status'] === 'approved') {
            Mail::to($prescription->user->email)->send(new PrescriptionApprovedMail($prescription));
        }

        // Clear existing items and re-add them if you're "loading" and updating all items
        $prescription->items()->delete();

        foreach ($validated['items'] as $item) {
            $medication = Medication::findOrFail($item['medication_id']);
            
            // Check if medication is in stock
            if ($medication->quantity_on_hand < $item['quantity']) {
                return back()->withErrors(['items' => "Insufficient stock for {$medication->name}. Available: {$medication->quantity_on_hand}"]);
            }
            
            $price = $medication->current_sale_price * $item['quantity'];

            PrescriptionItem::create([
                'prescription_id' => $prescription->id,
                'medication_id' => $item['medication_id'],
                'quantity' => $item['quantity'],
                'instructions' => $item['instructions'] ?? null,
                'price' => $price,
            ]);
            
            // Update medication stock if dispensed
            if ($validated['status'] === 'dispensed') {
                $medication->decrement('quantity_on_hand', $item['quantity']);
            }
        }

        return redirect()->route('pharmacist.prescriptions.index')
            ->with('success', 'Prescription successfully processed.');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'patient_id_number' => 'required|string|max:255',
            'doctor_id' => 'required|exists:doctors,id',
            // If you want to update items here, add validation for them too
            // 'items' => 'nullable|array',
            // 'items.*.medication_id' => 'required_with:items.*.quantity|exists:medications,id',
            // 'items.*.quantity' => 'required_with:items.*.medication_id|integer|min:1',
            // 'items.*.instructions' => 'nullable|string|max:500',
        ]);

        $prescription = Prescription::findOrFail($id);

        $prescription->update([
            'patient_id_number' => $validated['patient_id_number'],
            'doctor_id' => $validated['doctor_id'],
            'status' => 'approved', // Or whatever status is appropriate for an "update"
        ]);

        return redirect()->route('pharmacist.prescriptions.index')
            ->with('success', 'Prescription loaded successfully.');
    }

    public function showPrescription(Prescription $prescription)
    {
        $prescription->load([
            'user',
            'doctor',
            'items.medication',
        ]);

        return Inertia::render('Pharmacist/Prescriptions/Show', [
            'prescription' => $prescription,
        ]);
    }

    public function loadAction(Prescription $prescription)
    {
        // Eager load relationships if needed for the prescription overview
        $prescription->load(['user', 'doctor', 'items.medication']);

        // Fetch customer's allergies
        // Assuming the 'user' relationship on Prescription points to the customer
        $customerAllergies = collect();
        if ($prescription->user) {
            $customerAllergies = CustomerAllergy::where('customer_id', $prescription->user->id)
                                ->with('activeIngredient') // Load the active ingredient details
                                ->get()
                                ->map(function($allergy) {
                                    return [
                                        'id' => $allergy->id,
                                        'active_ingredient_id' => $allergy->active_ingredient_id,
                                        'active_ingredient_name' => $allergy->activeIngredient->name ?? 'N/A', // Assuming activeIngredient has a 'name'
                                    ];
                                });
        }


        // Prepare existing prescription items for the form if they are not already structured
        // This is important for populating the dynamic form fields
        $existingPrescriptionItems = $prescription->items->map(function ($item) {
            return [
                'medication_id' => $item->medication_id,
                'quantity' => $item->quantity,
                'instructions' => $item->instructions,
            ];
        })->toArray(); // Ensure it's an array for the Inertia form

        return Inertia::render('Pharmacist/Prescriptions/LoadPrescription', [
            'prescription' => $prescription->toArray(),
            'doctors' => Doctor::all()->map(fn($doctor) => ['id' => $doctor->id, 'name' => $doctor->name . ' ' . $doctor->surname]), // Ensure 'name' is proper
            'medications' => Medication::with('activeIngredients')->get()->map(function($med) {
                return [
                    'id' => $med->id,
                    'name' => $med->name,
                    'current_sale_price' => $med->current_sale_price,
                    // Ensure active_ingredients is an array of IDs for the frontend logic
                    'active_ingredients' => $med->activeIngredients->pluck('id')->toArray(),
                ];
            })->toArray(),
            'customerAllergies' => $customerAllergies->toArray(), // Pass the fetched allergies
            'existingPrescriptionItems' => $existingPrescriptionItems,
        ]);
    }


    public function destroy(Prescription $prescription)
    {
        $prescription->delete();

        return redirect()->route('pharmacist.prescriptions.index')
            ->with('success', 'Prescription deleted successfully.');
    }

    public function dashboard()
    {
        $user = Auth::user();

        $today = Carbon::today();

        $prescriptionsLoadedToday = Prescription::whereDate('updated_at', $today)
            ->where('status', 'approved')
            ->count();

        $prescriptionsDispensedToday = Prescription::whereDate('updated_at', $today)
            ->where('status', 'dispensed')
            ->count();

        $totalPrescriptionsPending = Prescription::where('status', 'pending')
            ->count();

        $metricsData = [
            'prescriptionsLoadedToday' => $prescriptionsLoadedToday,
            'prescriptionsDispensedToday' => $prescriptionsDispensedToday,
            'totalPrescriptionsPending' => $totalPrescriptionsPending,
        ];

        $recentPrescriptions = Prescription::with('user')
            ->whereIn('status', ['approved', 'dispensed'])
            ->latest('updated_at')
            ->take(10)
            ->get()
            ->map(function ($prescription) {
                $activityType = '';
                if ($prescription->status === 'approved') {
                    $activityType = 'Prescription Loaded';
                } elseif ($prescription->status === 'dispensed') {
                    $activityType = 'Medication Dispensed';
                }

                return [
                    'id' => $prescription->id,
                    'activity' => $activityType,
                    'prescription_name' => $prescription->name,
                    'customer_name' => $prescription->user->name ?? 'Unknown',
                    'date' => $prescription->updated_at->format('Y-m-d'),
                    'time' => $prescription->updated_at->format('h:i A'),
                ];
            })->toArray();

        return Inertia::render('Pharmacist/Dashboard', [
            'pharmacistName' => $user->name,
            'metrics' => $metricsData,
            'recentActivities' => $recentPrescriptions,
        ]);
    }

    public function profile()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $pharmacistData = [
            'name' => $user->name,
            'surname' => $user->surname ?? '',
            'idNumber' => $user->id_number ?? 'N/A',
            'cellphoneNumber' => $user->phone_number ?? 'N/A',
            'emailAddress' => $user->email,
            'healthCouncilRegistrationNumber' => $user->registration_number ?? 'N/A',
            'registrationDate' => $user->registration_date ? Carbon::parse($user->registration_date)->format('Y-m-d') : 'N/A',
        ];

        return Inertia::render('Pharmacist/Profile', [
            'pharmacist' => $pharmacistData,
        ]);
    }

    public function editProfile()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $pharmacistData = [
            'name' => $user->name,
            'surname' => $user->surname ?? '',
            'idNumber' => $user->id_number ?? 'N/A',
            'cellphoneNumber' => $user->phone_number ?? 'N/A',
            'emailAddress' => $user->email,
            'healthCouncilRegistrationNumber' => $user->registration_number ?? 'N/A',
            'registrationDate' => $user->registration_date ? Carbon::parse($user->registration_date)->format('Y-m-d') : 'N/A',
        ];

        return Inertia::render('Pharmacist/EditProfile', [
            'pharmacist' => $pharmacistData,
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'surname' => 'nullable|string|max:255',
            'idNumber' => 'nullable|string|max:255',
            'cellphoneNumber' => 'nullable|string|max:255',
            'emailAddress' => 'required|email|max:255|unique:users,email,' . $user->id,
            'healthCouncilRegistrationNumber' => 'nullable|string|max:255',
            'registrationDate' => 'nullable|date',
        ]);

        $user->name = $validatedData['name'];
        $user->surname = $validatedData['surname'] ?? null;
        $user->id_number = $validatedData['idNumber'] ?? null;
        $user->phone_number = $validatedData['cellphoneNumber'] ?? null;
        $user->email = $validatedData['emailAddress'];
        $user->registration_number = $validatedData['healthCouncilRegistrationNumber'] ?? null;
        $user->registration_date = $validatedData['registrationDate'] ?? null;

        $user->save();

        return redirect()->route('pharmacist.profile')->with('success', 'Profile updated successfully.');
    }

    /**
     * Display approved prescriptions ready for dispensing
     */
    public function dispenseIndex()
    {
        $prescriptions = Prescription::with('user', 'doctor', 'items.medication')
            ->where('status', 'approved')
            ->whereHas('items', function ($query) {
                $query->whereRaw('repeats_used < repeats');
            })
            ->orWhere(function ($query) {
                $query->where('status', 'approved')
                    ->whereRaw('repeats_used < repeats_total');
            })
            ->latest()
            ->get()
            ->map(function ($prescription) {
                return [
                    'id' => $prescription->id,
                    'customer_name' => $prescription->user->name ?? 'Unknown',
                    'prescription_name' => $prescription->name,
                    'upload_date' => $prescription->created_at->format('Y-m-d'),
                    'status' => $prescription->status,
                    'file_path' => $prescription->file_path,
                    'repeats_total' => $prescription->repeats_total,
                    'repeats_used' => $prescription->repeats_used,
                    'next_repeat_date' => $prescription->next_repeat_date ? Carbon::parse($prescription->next_repeat_date)->format('Y-m-d') : null,
                    'delivery_method' => $prescription->delivery_method,
                    'patient_id_number' => $prescription->patient_id_number,
                ];
            });

        return Inertia::render('Pharmacist/Prescriptions/Dispense', [
            'prescriptions' => $prescriptions,
        ]);
    }

    /**
     * Show detailed dispense view for a prescription
     */
    public function dispenseShow(Prescription $prescription)
    {
        // Ensure prescription is approved and has repeats available
        if ($prescription->status !== 'approved' || $prescription->repeats_used >= $prescription->repeats_total) {
            return redirect()->route('pharmacist.prescriptions.dispense')
                ->with('error', 'This prescription is not available for dispensing.');
        }

        $prescription->load([
            'user.allergies.activeIngredient',
            'doctor',
            'items.medication.activeIngredients'
        ]);

        // Calculate repeats remaining for each item
        $prescription->items = $prescription->items->map(function ($item) {
            $item->repeats_remaining = $item->repeats - $item->repeats_used;
            return $item;
        });

        // Fetch customer allergies
        $customerAllergies = [];
        if ($prescription->user && $prescription->user->allergies) {
            $customerAllergies = $prescription->user->allergies->map(function ($allergy) {
                return [
                    'id' => $allergy->id,
                    'active_ingredient_id' => $allergy->active_ingredient_id,
                    'active_ingredient_name' => $allergy->activeIngredient->name ?? 'Unknown Active Ingredient',
                ];
            })->toArray();
        }

        return Inertia::render('Pharmacist/Prescriptions/DispenseShow', [
            'prescription' => $prescription,
            'customerAllergies' => $customerAllergies,
        ]);
    }

    /**
     * Process the dispensing of prescription items
     */
    public function dispenseStore(Request $request)
    {
        $validated = $request->validate([
            'prescription_id' => 'required|exists:prescriptions,id',
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'required|exists:prescription_items,id',
            'items.*.quantity' => 'required|integer|min:1',
            'notes' => 'nullable|string|max:1000',
        ]);

        $prescription = Prescription::with(['user', 'items.medication'])->findOrFail($validated['prescription_id']);

        // Check if prescription can be dispensed
        if ($prescription->status !== 'approved') {
            return back()->withErrors(['prescription' => 'This prescription is not approved for dispensing.']);
        }

        if ($prescription->repeats_used >= $prescription->repeats_total) {
            return back()->withErrors(['prescription' => 'No more repeats available for this prescription.']);
        }

        DB::transaction(function () use ($prescription, $validated) {
            $dispensedItems = [];
            $totalCost = 0;

            // Process each selected item
            foreach ($validated['items'] as $itemData) {
                $prescriptionItem = $prescription->items->find($itemData['item_id']);
                if (!$prescriptionItem) continue;

                $medication = $prescriptionItem->medication;
                $quantity = $itemData['quantity'];

                // Check if item has repeats remaining
                if ($prescriptionItem->repeats_used >= $prescriptionItem->repeats) {
                    throw new \Exception("No more repeats available for {$medication->name}.");
                }

                // Check stock availability
                if ($medication->quantity_on_hand < $quantity) {
                    throw new \Exception("Insufficient stock for {$medication->name}. Available: {$medication->quantity_on_hand}");
                }

                // Update medication stock
                $medication->decrement('quantity_on_hand', $quantity);

                // Update item repeat usage
                $prescriptionItem->increment('repeats_used');

                // Calculate cost
                $itemCost = $medication->current_sale_price * $quantity;
                $totalCost += $itemCost;

                // Record dispensed item in the database
                DispensedItem::create([
                    'prescription_id' => $prescription->id,
                    'prescription_item_id' => $prescriptionItem->id,
                    'medication_id' => $medication->id,
                    'pharmacist_id' => Auth::id(),
                    'quantity_dispensed' => $quantity,
                    'cost' => $itemCost,
                    'dispensed_at' => now(),
                    'notes' => $validated['notes'] ?? null,
                ]);

                $dispensedItems[] = [
                    'medication_name' => $medication->name,
                    'quantity' => $quantity,
                    'cost' => $itemCost,
                ];
            }

            // Update prescription repeats
            $prescription->increment('repeats_used');

            // Check if all items are fully dispensed (no more repeats for any item)
            $prescription->refresh();
            $allItemsFullyDispensed = $prescription->items->every(function ($item) {
                return $item->repeats_used >= $item->repeats;
            });

            // If all items fully dispensed or prescription repeats exhausted, mark as fully dispensed
            if ($allItemsFullyDispensed || $prescription->repeats_used >= $prescription->repeats_total) {
                $prescription->update(['status' => 'dispensed']);
            }

            // Update next repeat date (e.g., 30 days from now)
            if ($prescription->repeats_used < $prescription->repeats_total) {
                $prescription->update(['next_repeat_date' => now()->addDays(30)]);
            }

            // Send notification email to customer (collection ready)
            if ($prescription->user) {
                Mail::to($prescription->user->email)->send(new PrescriptionReadyCollectionMail($prescription));
            }
        });

        return redirect()->route('pharmacist.prescriptions.dispense')
            ->with('success', 'Prescription items dispensed successfully. Customer has been notified.');
    }
}