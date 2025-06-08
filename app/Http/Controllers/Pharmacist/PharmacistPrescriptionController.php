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
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;


// Add this import for the Allergy model if you have one, or adjust as needed
use App\Models\Customer\CustomerAllergy;
use App\Models\Medication\ActiveIngredient; // <--- ADD THIS IMPORT for ActiveIngredient

class PharmacistPrescriptionController extends Controller
{
    public function index()
    {
        $prescriptions = Prescription::with('user') // eager load customer
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
            'items' => 'required|array',
            'items.*.medication_id' => 'required|exists:medications,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.instructions' => 'nullable|string',
            'items.*.instructions' => 'nullable|string',
        ]);

        $prescription->update([
            'patient_id_number' => $validated['patient_id_number'],
            'doctor_id' => $validated['doctor_id'],
            'status' => 'approved',
            'repeats_total' => $validated['repeats_total'] ?? 0, // Default to 0 if not provided
            'repeats_used' => 0, // Reset repeats used
            'next_repeat_date' => null, // Clear next repeat date
        ]);

        // Ensure $prescription->user is loaded before trying to access its email
        $prescription->loadMissing('user');
        if ($prescription->user) {
            Mail::to($prescription->user->email)->send(new PrescriptionApprovedMail($prescription));
        }

        // Clear existing items and re-add them if you're "loading" and updating all items
        $prescription->items()->delete();

        foreach ($validated['items'] as $item) {
            $medication = Medication::findOrFail($item['medication_id']);
            $price = $medication->current_sale_price * $item['quantity'];

            PrescriptionItem::create([
                'prescription_id' => $prescription->id,
                'medication_id' => $item['medication_id'],
                'quantity' => $item['quantity'],
                'instructions' => $item['instructions'] ?? null,
                'price' => $price,
            ]);
        }

        return redirect()->route('pharmacist.prescriptions.index')
            ->with('success', 'Prescription successfully loaded.');
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
}