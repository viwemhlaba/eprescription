<?php

namespace App\Http\Controllers\Pharmacist;

use App\Http\Controllers\Controller;
use App\Models\Customer\Prescription;
use App\Models\Medication\Medication;
use App\Models\Customer\PrescriptionItem;
use App\Models\Doctor;
use App\Models\User; // <--- Ensure User model is imported
use App\Models\PharmacistProfile; // <--- Add PharmacistProfile import
use App\Models\Pharmacy; // <--- Add Pharmacy import
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Mail\PrescriptionApprovedMail;
use App\Mail\PrescriptionReadyCollectionMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash; // <--- ADD THIS IMPORT for Hash facade
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf; // For DomPDF


// Add this import for the Allergy model if you have one, or adjust as needed
use App\Models\CustomerAllergy;
use App\Models\Medication\ActiveIngredient; // <--- ADD THIS IMPORT for ActiveIngredient
use App\Models\DispensedItem;
use App\Services\AllergyAlertService; // <--- ADD THIS IMPORT
use App\Mail\CustomerAccountCreated; // <--- ADD THIS IMPORT for customer account creation
use App\Models\Customer; // <--- ADD THIS IMPORT for Customer model

class PharmacistPrescriptionController extends Controller
{
    public function index()
    {
        // Get uploaded prescriptions (with file_path and status pending)
        $uploadedPrescriptions = Prescription::with('user.customer') // eager load customer
            ->where('status', 'pending')
            ->whereNotNull('file_path')
            ->where('is_manual', false)
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
                    'is_manual' => false,
                    'patient_id_number' => $prescription->user->customer->id_number ?? $prescription->patient_id_number ?? 'Not Available',
                ];
            });

        // Get manually created prescriptions (is_manual = true)
        $manualPrescriptions = Prescription::with(['user.customer', 'doctor']) // eager load customer and doctor
            ->where('is_manual', true)
            ->latest()
            ->get()
            ->map(function ($prescription) {
                return [
                    'id' => $prescription->id,
                    'customer_name' => $prescription->user->name ?? 'Unknown',
                    'prescription_name' => $prescription->name,
                    'created_date' => $prescription->created_at->format('Y-m-d'),
                    'status' => $prescription->status,
                    'file_path' => $prescription->file_path, // Will be null initially, populated when PDF is generated
                    'repeats_total' => $prescription->repeats_total,
                    'repeats_used' => $prescription->repeats_used,
                    'next_repeat_date' => $prescription->next_repeat_date ? Carbon::parse($prescription->next_repeat_date)->format('Y-m-d') : null,
                    'delivery_method' => $prescription->delivery_method,
                    'doctor_name' => $prescription->doctor ? "Dr. {$prescription->doctor->name} {$prescription->doctor->surname}" : 'Unknown',
                    'is_manual' => true,
                    'patient_id_number' => $prescription->user->customer->id_number ?? $prescription->patient_id_number ?? 'Not Available',
                ];
            });

        return inertia('Pharmacist/Prescriptions/Index', [
            'uploadedPrescriptions' => $uploadedPrescriptions,
            'manualPrescriptions' => $manualPrescriptions,
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

        // For manual prescriptions, also fetch all customers for selection
        $customers = [];
        if ($prescription->is_manual ?? false) {
            $customers = User::where('role', 'customer')
                ->with('customer:user_id,id_number')
                ->select('id', 'name', 'surname', 'email')
                ->get()
                ->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'surname' => $user->surname,
                        'email' => $user->email,
                        'id_number' => $user->customer->id_number ?? null,
                        'full_name' => $user->name . ' ' . $user->surname,
                    ];
                });
        }

        return inertia('Pharmacist/Prescriptions/LoadPrescription', [
            'prescription' => $prescription, // Pass the entire prescription object
            'doctors' => $doctors,
            'medications' => $medications,
            'customerAllergies' => $customerAllergies, // <--- MODIFIED: Pass the mapped allergies
            'customers' => $customers, // Pass customers for manual prescriptions
            'existingPrescriptionItems' => $prescription->file_path ? $prescription->items->map(function ($item) {
                return [
                    'medication_id' => $item->medication_id,
                    'quantity' => $item->quantity,
                    'instructions' => $item->instructions,
                ];
            }) : [], // Only pass items if prescription has a file (uploaded prescription)
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
            'customer_id' => 'nullable|exists:users,id', // For manual prescriptions
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

        // Update prescription with customer_id if it's a manual prescription
        $updateData = [
            'patient_id_number' => $validated['patient_id_number'],
            'doctor_id' => $validated['doctor_id'],
            'status' => $validated['status'],
            'repeats_total' => $validated['repeats_total'],
            'repeats_used' => 0, // Reset repeats used
            'next_repeat_date' => null, // Clear next repeat date
        ];

        // For manual prescriptions, update the customer association
        if ($prescription->is_manual && isset($validated['customer_id'])) {
            $updateData['user_id'] = $validated['customer_id'];
        }

        $prescription->update($updateData);

        // Ensure $prescription->user is loaded before trying to access its email
        $prescription->loadMissing('user.allergies.activeIngredient');
        $customer = $prescription->user;
        
        if ($customer && $validated['status'] === 'approved') {
            Mail::to($customer->email)->send(new PrescriptionApprovedMail($prescription));
        }

        // Clear existing items and re-add them if you're "loading" and updating all items
        $prescription->items()->delete();

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

        // If there are allergy alerts, return them as warnings
        if (!empty($allergyAlerts)) {
            return back()->with([
                'allergy_alerts' => $allergyAlerts,
                'success' => 'Prescription updated successfully, but please review allergy alerts.'
            ]);
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
            'user.customer',
            'doctor',
            'items.medication.activeIngredients',
        ]);

        // Get dispensed items history for this prescription
        $dispensedHistory = DispensedItem::where('prescription_id', $prescription->id)
            ->with(['pharmacist.pharmacistProfile.pharmacy', 'medication'])
            ->orderBy('dispensed_at', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'medication_name' => $item->medication->name,
                    'quantity_dispensed' => (int) $item->quantity_dispensed,
                    'cost' => (float) ($item->cost ?? 0),
                    'dispensed_at' => $item->dispensed_at->format('Y-m-d H:i:s'),
                    'dispensed_date' => $item->dispensed_at->format('M d, Y'),
                    'dispensed_time' => $item->dispensed_at->format('h:i A'),
                    'pharmacist_name' => $item->pharmacist->name ?? 'Unknown',
                    'pharmacy_name' => $item->pharmacist->pharmacistProfile->pharmacy->name ?? 'Unknown Pharmacy',
                    'notes' => $item->notes,
                ];
            });

        // Calculate totals
        $totalCost = $dispensedHistory->sum('cost');
        $totalItemsDispensed = $dispensedHistory->sum('quantity_dispensed');

        // Get current pharmacist info
        $currentPharmacist = Auth::user();
        $currentPharmacistProfile = null;
        if ($currentPharmacist && $currentPharmacist->role === 'pharmacist') {
            $currentPharmacistProfile = PharmacistProfile::with('pharmacy')
                ->where('user_id', $currentPharmacist->id)
                ->first();
        }

        return Inertia::render('Pharmacist/Prescriptions/Show', [
            'prescription' => [
                'id' => $prescription->id,
                'name' => $prescription->name,
                'status' => $prescription->status,
                'delivery_method' => $prescription->delivery_method,
                'repeats_total' => $prescription->repeats_total,
                'repeats_used' => $prescription->repeats_used,
                'next_repeat_date' => $prescription->next_repeat_date,
                'created_at' => $prescription->created_at->format('Y-m-d H:i:s'),
                'updated_at' => $prescription->updated_at->format('Y-m-d H:i:s'),
                'is_manual' => $prescription->is_manual,
                'notes' => $prescription->notes,
                'file_path' => $prescription->file_path,
                // Patient information
                'patient' => [
                    'id' => $prescription->user->id,
                    'name' => $prescription->user->name,
                    'surname' => $prescription->user->surname ?? '',
                    'email' => $prescription->user->email,
                    'id_number' => $prescription->user->customer->id_number ?? 'Not Available',
                    'cellphone_number' => $prescription->user->customer->cellphone_number ?? 'Not Available',
                    'full_address' => $this->formatAddress($prescription->user->customer),
                    'allergies' => $prescription->user->customer->allergies ?? 'None',
                ],
                // Doctor information
                'doctor' => [
                    'id' => $prescription->doctor->id,
                    'name' => "Dr. {$prescription->doctor->name} {$prescription->doctor->surname}",
                    'email' => $prescription->doctor->email,
                    'phone' => $prescription->doctor->phone,
                    'practice_number' => $prescription->doctor->practice_number,
                    'specialization' => $prescription->doctor->specialization,
                ],
                // Prescription items
                'items' => $prescription->items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'medication_name' => $item->medication->name,
                        'quantity' => (int) $item->quantity,
                        'instructions' => $item->instructions,
                        'price' => (float) ($item->price ?? 0),
                        'repeats' => (int) $item->repeats,
                        'repeats_used' => (int) $item->repeats_used,
                        'active_ingredients' => $item->medication->activeIngredients->pluck('name')->join(', '),
                    ];
                }),
            ],
            'dispensed_history' => $dispensedHistory,
            'totals' => [
                'total_cost' => (float) $totalCost,
                'total_items_dispensed' => (int) $totalItemsDispensed,
                'prescription_total_value' => (float) $prescription->items->sum('price'),
            ],
            'current_pharmacist' => $currentPharmacistProfile ? [
                'name' => $currentPharmacist->name,
                'registration_number' => $currentPharmacistProfile->registration_number,
                'pharmacy' => $currentPharmacistProfile->pharmacy ? [
                    'name' => $currentPharmacistProfile->pharmacy->name,
                    'address' => $currentPharmacistProfile->pharmacy->physical_address,
                    'phone' => $currentPharmacistProfile->pharmacy->contact_number,
                    'email' => $currentPharmacistProfile->pharmacy->email,
                    'registration_number' => $currentPharmacistProfile->pharmacy->health_council_registration_number,
                ] : null,
            ] : null,
        ]);
    }

    /**
     * Helper method to format customer address
     */
    private function formatAddress($customer)
    {
        if (!$customer) return 'Not Available';
        
        $addressParts = array_filter([
            $customer->house_number,
            $customer->street,
            $customer->city,
            $customer->state,
            $customer->postal_code,
        ]);
        
        return !empty($addressParts) ? implode(', ', $addressParts) : 'Not Available';
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

        // Get or create pharmacist profile with pharmacy information
        $profile = PharmacistProfile::with('pharmacy')->where('user_id', $user->id)->first();
        if (!$profile) {
            $profile = PharmacistProfile::create(['user_id' => $user->id]);
        }
        
        // Get prescription statistics
        $totalPrescriptionsProcessed = Prescription::whereHas('items')->count();
        $pendingPrescriptions = Prescription::where('status', 'pending')->count();
        $approvedPrescriptions = Prescription::where('status', 'approved')->count();
        $dispensedPrescriptions = Prescription::where('status', 'dispensed')->count();
        
        // Get recent activity (last 30 days)
        $recentActivity = Prescription::where('updated_at', '>=', Carbon::now()->subDays(30))
            ->whereIn('status', ['approved', 'dispensed'])
            ->count();
            
        // Get monthly prescription trends (last 6 months)
        $monthlyTrends = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $count = Prescription::whereYear('updated_at', $month->year)
                ->whereMonth('updated_at', $month->month)
                ->whereIn('status', ['approved', 'dispensed'])
                ->count();
            $monthlyTrends[] = [
                'month' => $month->format('M Y'),
                'count' => $count
            ];
        }

        $pharmacistData = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'surname' => $profile->surname ?? '',
            'id_number' => $profile->id_number ?? '',
            'phone_number' => $profile->phone_number ?? '',
            'registration_number' => $profile->registration_number ?? '',
            'registration_date' => $profile->registration_date ? Carbon::parse($profile->registration_date)->format('Y-m-d') : null,
            'bio' => $profile->bio ?? '',
            'avatar_url' => $profile->avatar_url,
            'specializations' => $profile->specializations ?? [],
            'certifications' => $profile->certifications ?? [],
            'qualification' => $profile->qualification ?? '',
            'university' => $profile->university ?? '',
            'graduation_year' => $profile->graduation_year ?? null,
            'years_experience' => $profile->years_experience ?? 0,
            'languages' => $profile->languages ?? [],
            'license_status' => $profile->license_status ?? 'active',
            'license_expiry' => $profile->license_expiry ? Carbon::parse($profile->license_expiry)->format('Y-m-d') : null,
            'license_expiring_soon' => $profile->license_expiring_soon,
            'years_since_registration' => $profile->years_since_registration,
            'created_at' => $user->created_at->format('M d, Y'),
            'pharmacy' => $profile->pharmacy ? [
                'id' => $profile->pharmacy->id,
                'name' => $profile->pharmacy->name,
                'health_council_registration_number' => $profile->pharmacy->health_council_registration_number,
                'physical_address' => $profile->pharmacy->physical_address,
                'contact_number' => $profile->pharmacy->contact_number,
                'email' => $profile->pharmacy->email,
                'website_url' => $profile->pharmacy->website_url,
            ] : null,
        ];

        $statistics = [
            'total_prescriptions' => $totalPrescriptionsProcessed,
            'pending_prescriptions' => $pendingPrescriptions,
            'approved_prescriptions' => $approvedPrescriptions,
            'dispensed_prescriptions' => $dispensedPrescriptions,
            'recent_activity' => $recentActivity,
            'monthly_trends' => $monthlyTrends,
            'approval_rate' => $totalPrescriptionsProcessed > 0 ? 
                round(($approvedPrescriptions + $dispensedPrescriptions) / $totalPrescriptionsProcessed * 100, 1) : 0,
        ];

        return Inertia::render('Pharmacist/Profile', [
            'pharmacist' => $pharmacistData,
            'statistics' => $statistics,
        ]);
    }

    public function editProfile()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        // Get or create pharmacist profile with pharmacy information
        $profile = PharmacistProfile::with('pharmacy')->where('user_id', $user->id)->first();
        if (!$profile) {
            $profile = PharmacistProfile::create(['user_id' => $user->id]);
        }

        // Get all pharmacies for selection
        $pharmacies = \App\Models\Pharmacy::select('id', 'name', 'physical_address')->get();

        $pharmacistData = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'surname' => $profile->surname ?? '',
            'id_number' => $profile->id_number ?? '',
            'phone_number' => $profile->phone_number ?? '',
            'registration_number' => $profile->registration_number ?? '',
            'registration_date' => $profile->registration_date ? Carbon::parse($profile->registration_date)->format('Y-m-d') : '',
            'bio' => $profile->bio ?? '',
            'avatar' => $profile->avatar ?? null,
            'specializations' => $profile->specializations ?? [],
            'certifications' => $profile->certifications ?? [],
            'qualification' => $profile->qualification ?? '',
            'university' => $profile->university ?? '',
            'graduation_year' => $profile->graduation_year ?? null,
            'years_experience' => $profile->years_experience ?? 0,
            'languages' => $profile->languages ?? [],
            'license_status' => $profile->license_status ?? 'active',
            'license_expiry' => $profile->license_expiry ? Carbon::parse($profile->license_expiry)->format('Y-m-d') : '',
            'pharmacy_id' => $profile->pharmacy_id ?? null,
            'profile_completed' => $profile->profile_completed ?? false,
            'pharmacy' => $profile->pharmacy ? [
                'id' => $profile->pharmacy->id,
                'name' => $profile->pharmacy->name,
                'physical_address' => $profile->pharmacy->physical_address,
            ] : null,
        ];

        return Inertia::render('Pharmacist/EditProfile', [
            'pharmacist' => $pharmacistData,
            'pharmacies' => $pharmacies,
            'specialization_options' => [
                'Clinical Pharmacy',
                'Hospital Pharmacy',
                'Community Pharmacy',
                'Industrial Pharmacy',
                'Regulatory Affairs',
                'Pharmaceutical Research',
                'Pharmacovigilance',
                'Nuclear Pharmacy',
                'Oncology Pharmacy',
                'Pediatric Pharmacy',
                'Geriatric Pharmacy',
                'Mental Health Pharmacy'
            ],
            'language_options' => [
                'English',
                'Afrikaans',
                'Zulu',
                'Xhosa',
                'Sotho',
                'Tswana',
                'Pedi',
                'Venda',
                'Tsonga',
                'Ndebele',
                'Swati'
            ],
            'license_status_options' => [
                'active',
                'expired',
                'suspended',
                'probation'
            ]
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        // Debug: Log all request data
        Log::info('All request data:', $request->all());

        $validatedData = $request->validate([
            'surname' => 'nullable|string|max:255',
            'id_number' => 'nullable|string|max:20',
            'phone_number' => 'nullable|string|max:20',
            'registration_number' => 'nullable|string|max:255',
            'registration_date' => 'nullable|date',
            'bio' => 'nullable|string|max:1000',
            'specializations' => 'nullable|array',
            'specializations.*' => 'string|max:255',
            'certifications' => 'nullable|array',
            'certifications.*' => 'string|max:255',
            'qualification' => 'nullable|string|max:255',
            'university' => 'nullable|string|max:255',
            'graduation_year' => 'nullable|integer|min:1950|max:' . (date('Y') + 5),
            'years_experience' => 'nullable|integer|min:0|max:60',
            'languages' => 'nullable|array',
            'languages.*' => 'string|max:255',
            'license_status' => 'nullable|string|in:active,expired,suspended,probation',
            'license_expiry' => 'nullable|date|after:today',
            'pharmacy_id' => 'nullable|string', // Changed to string to handle 'none'
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Handle pharmacy_id conversion
        $pharmacyId = null;
        if (isset($validatedData['pharmacy_id']) && $validatedData['pharmacy_id'] !== 'none' && is_numeric($validatedData['pharmacy_id'])) {
            // Validate that the pharmacy exists
            if (Pharmacy::where('id', $validatedData['pharmacy_id'])->exists()) {
                $pharmacyId = (int) $validatedData['pharmacy_id'];
            }
        }

        // Handle avatar upload
        $avatarPath = null;
        if ($request->hasFile('avatar')) {
            $avatarPath = $request->file('avatar')->store('avatars', 'public');
        }

        // Get or create profile
        $profile = PharmacistProfile::where('user_id', $user->id)->first();
        if (!$profile) {
            $profile = PharmacistProfile::create(['user_id' => $user->id]);
        }

        // Debug: Log the validated data
        Log::info('Validated data for profile update:', $validatedData);

        // Update profile data
        $profileData = [
            'surname' => $validatedData['surname'] ?? null,
            'id_number' => $validatedData['id_number'] ?? null,
            'phone_number' => $validatedData['phone_number'] ?? null,
            'registration_number' => $validatedData['registration_number'] ?? null,
            'registration_date' => $validatedData['registration_date'] ?? null,
            'bio' => $validatedData['bio'] ?? null,
            'specializations' => $validatedData['specializations'] ?? null,
            'certifications' => $validatedData['certifications'] ?? null,
            'qualification' => $validatedData['qualification'] ?? null,
            'university' => $validatedData['university'] ?? null,
            'graduation_year' => $validatedData['graduation_year'] ?? null,
            'years_experience' => $validatedData['years_experience'] ?? null,
            'languages' => $validatedData['languages'] ?? null,
            'license_status' => $validatedData['license_status'] ?? 'active',
            'license_expiry' => $validatedData['license_expiry'] ?? null,
            'pharmacy_id' => $pharmacyId,
            'profile_completed' => true, // Mark profile as completed when updated
        ];

        if ($avatarPath) {
            $profileData['avatar'] = $avatarPath;
        }

        // Debug: Log the profile data before update
        Log::info('Profile data to update:', $profileData);
        Log::info('Profile before update:', $profile->toArray());

        $profile->update($profileData);

        // Debug: Log the profile after update
        Log::info('Profile after update:', $profile->fresh()->toArray());

        // Check if this was the first-time profile completion
        $message = $profile->wasChanged('profile_completed') && $profile->profile_completed 
            ? 'Welcome! Your profile has been completed successfully. You can now access all features.'
            : 'Profile updated successfully.';

        // Redirect to dashboard if this was first-time completion, otherwise to profile
        $redirectRoute = $profile->wasChanged('profile_completed') && $profile->profile_completed
            ? 'pharmacist.dashboard'
            : 'pharmacist.profile';

        return redirect()->route($redirectRoute)->with('success', $message);
    }

    /**
     * Display approved prescriptions ready for dispensing
     */
    public function dispenseIndex()
    {
        $prescriptions = Prescription::with('user.customer', 'doctor', 'items.medication')
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
                    'patient_id_number' => $prescription->user->customer->id_number ?? $prescription->patient_id_number ?? 'Not Available',
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

                // Validate that the quantity matches the original prescription quantity
                if ($quantity !== $prescriptionItem->quantity) {
                    throw new \Exception("Quantity modification not allowed. {$medication->name} must be dispensed in the exact prescribed quantity of {$prescriptionItem->quantity}.");
                }

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

    /**
     * Show the form to create a new customer account
     */
    public function createCustomer()
    {
        return Inertia::render('Pharmacist/Customers/Create');
    }

    /**
     * Store a newly created customer account for walk-in patients
     */
    public function storeCustomer(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'surname' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'id_number' => 'required|string|max:13|unique:customers,id_number',
            'cellphone_number' => 'required|string|max:15',
        ]);

        DB::beginTransaction();

        try {
            // Generate a temporary password for the customer
            $temporaryPassword = 'temp' . rand(1000, 9999);

            // Create the User account
            $user = User::create([
                'name' => $validated['name'],
                'surname' => $validated['surname'],
                'email' => $validated['email'],
                'password' => Hash::make($temporaryPassword),
                'role' => 'customer',
                'password_changed_at' => null, // Mark for mandatory password change on first login
            ]);

            // Create the Customer profile
            Customer::create([
                'user_id' => $user->id,
                'id_number' => $validated['id_number'],
                'cellphone_number' => $validated['cellphone_number'],
            ]);

            // Send email notification to customer with login credentials
            Mail::to($user->email)->send(
                new CustomerAccountCreated(
                    $user->name . ' ' . $user->surname,
                    $user->email,
                    $temporaryPassword,
                    route('login')
                )
            );

            DB::commit();

            return redirect()->route('pharmacist.prescriptions.createManual')
                ->with('success', 'Customer account created successfully! Customer has been notified via email. You can now select the customer from the dropdown.');

        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Failed to create customer account: ' . $e->getMessage());
            
            return back()->withErrors(['general' => 'Failed to create customer account. Please try again.']);
        }
    }

    /**
     * Create a blank prescription for manual entry and redirect to load form
     */
    public function createManual()
    {
        // Fetch all customers for selection
        $customers = User::where('role', 'customer')
            ->with('customer:user_id,id_number,cellphone_number')
            ->select('id', 'name', 'surname', 'email')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'surname' => $user->surname,
                    'email' => $user->email,
                    'cellphone_number' => $user->customer->cellphone_number ?? null,
                    'id_number' => $user->customer->id_number ?? null,
                    'full_name' => $user->name . ' ' . $user->surname,
                ];
            });

        // Fetch all doctors
        $doctors = Doctor::select('id', 'name', 'surname', 'email', 'phone', 'practice_number')->get();

        // Fetch all medications with active ingredients
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

        // Fetch all active ingredients for allergy selection
        $activeIngredients = \App\Models\Medication\ActiveIngredient::select('id', 'name')->get();

        return inertia('Pharmacist/Prescriptions/CreateManual', [
            'customers' => $customers,
            'doctors' => $doctors,
            'medications' => $medications,
            'activeIngredients' => $activeIngredients,
        ]);
    }

    /**
     * Store a manually created prescription
     */
    public function storeManual(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:users,id',
            'allergies_type' => 'required|in:none,known',
            'allergies' => 'nullable|array',
            'allergies.*' => 'exists:active_ingredients,id',
            'doctor_id' => 'required|exists:doctors,id',
            'prescription_name' => 'required|string|max:255',
            'delivery_method' => 'required|string|in:pickup,dispense',
            'repeats_total' => 'required|integer|min:0|max:5',
            'items' => 'required|array|min:1',
            'items.*.medication_id' => 'required|exists:medications,id',
            'items.*.quantity' => 'required|integer|min:1|max:999',
            'items.*.instructions' => 'nullable|string|max:500',
            'items.*.price' => 'required|numeric|min:0',
            'pharmacy_notes' => 'nullable|string|max:1000',
        ]);

        DB::beginTransaction();
        
        try {
            // Get the selected customer and doctor
            $customerId = $validated['customer_id'];
            $doctorId = $validated['doctor_id'];

            // 1. Handle customer allergies (goes to customer_allergies table)
            if ($validated['allergies_type'] === 'known' && isset($validated['allergies']) && !empty($validated['allergies'])) {
                // Remove existing allergies for this customer
                CustomerAllergy::where('user_id', $customerId)->delete();
                
                // Add new allergies to customer_allergies table
                foreach ($validated['allergies'] as $activeIngredientId) {
                    CustomerAllergy::create([
                        'user_id' => $customerId,
                        'active_ingredient_id' => $activeIngredientId,
                    ]);
                }
            } elseif ($validated['allergies_type'] === 'none') {
                // Remove all allergies if customer has no allergies
                CustomerAllergy::where('user_id', $customerId)->delete();
            }

            // 2. Create the main prescription record (goes to prescriptions table)
            $prescription = Prescription::create([
                'user_id' => $customerId,
                'doctor_id' => $doctorId,
                'name' => $validated['prescription_name'],
                'delivery_method' => $validated['delivery_method'],
                'repeats_total' => $validated['repeats_total'],
                'repeats_used' => 0,
                'status' => 'approved',
                'file_path' => null, // No file for manual prescriptions
                'is_manual' => true,
                'notes' => $validated['pharmacy_notes'] ?? null,
            ]);

            // 3. Create prescription items (goes to prescription_items table)
            foreach ($validated['items'] as $item) {
                PrescriptionItem::create([
                    'prescription_id' => $prescription->id,
                    'medication_id' => $item['medication_id'],
                    'quantity' => $item['quantity'],
                    'instructions' => $item['instructions'] ?? null,
                    'price' => $item['price'],
                    'repeats' => $validated['repeats_total'], // Each item gets same number of repeats as prescription
                    'repeats_used' => 0, // Initially no repeats used
                ]);
            }

            DB::commit();

            // 4. Send confirmation email to customer
            $customer = User::find($customerId);
            if ($customer) {
                try {
                    Mail::to($customer->email)->send(new PrescriptionApprovedMail($prescription));
                } catch (\Exception $e) {
                    // Log email error but don't fail the prescription creation
                    Log::warning('Failed to send prescription approval email: ' . $e->getMessage());
                }
            }

            return redirect()->route('pharmacist.prescriptions.dispense')
                ->with('success', 'Manual prescription created successfully! Customer has been notified via email.');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating manual prescription: ' . $e->getMessage(), [
                'request_data' => $request->all(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return back()->withErrors(['error' => 'Failed to create prescription: ' . $e->getMessage()]);
        }
    }

    /**
     * Show the form for editing a manual prescription
     */
    public function editManual(Prescription $prescription)
    {
        // Ensure it's a manual prescription
        if (!$prescription->is_manual) {
            return redirect()->route('pharmacist.prescriptions.index')
                ->with('error', 'This is not a manual prescription.');
        }

        $prescription->load(['user', 'doctor', 'items.medication']);

        $customers = User::where('role', 'customer')
            ->with('customer:user_id,id_number')
            ->select('id', 'name', 'surname', 'email')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'surname' => $user->surname,
                    'email' => $user->email,
                    'id_number' => $user->customer->id_number ?? null,
                    'full_name' => $user->name . ' ' . $user->surname,
                ];
            });

        $doctors = Doctor::select('id', 'name', 'surname', 'practice_number')->get();
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

        $activeIngredients = ActiveIngredient::select('id', 'name')->get();

        return inertia('Pharmacist/Prescriptions/EditManual', [
            'prescription' => $prescription,
            'customers' => $customers,
            'doctors' => $doctors,
            'medications' => $medications,
            'activeIngredients' => $activeIngredients,
        ]);
    }

    /**
     * Update a manual prescription
     */
    public function updateManual(Request $request, Prescription $prescription)
    {
        // Ensure it's a manual prescription
        if (!$prescription->is_manual) {
            return redirect()->route('pharmacist.prescriptions.index')
                ->with('error', 'This is not a manual prescription.');
        }

        $validated = $request->validate([
            'customer_id' => 'required|exists:users,id',
            'allergies_type' => 'required|in:none,known',
            'allergies' => 'nullable|array',
            'allergies.*' => 'exists:active_ingredients,id',
            'doctor_id' => 'required|exists:doctors,id',
            'prescription_name' => 'required|string|max:255',
            'delivery_method' => 'required|string|in:pickup,dispense',
            'repeats_total' => 'required|integer|min:0|max:5',
            'items' => 'required|array|min:1',
            'items.*.medication_id' => 'required|exists:medications,id',
            'items.*.quantity' => 'required|integer|min:1|max:999',
            'items.*.instructions' => 'nullable|string|max:500',
            'items.*.price' => 'required|numeric|min:0',
            'pharmacy_notes' => 'nullable|string|max:1000',
        ]);

        DB::beginTransaction();
        
        try {
            $customerId = $validated['customer_id'];

            // 1. Handle customer allergies (goes to customer_allergies table)
            if ($validated['allergies_type'] === 'known' && isset($validated['allergies']) && !empty($validated['allergies'])) {
                // Remove existing allergies for this customer
                CustomerAllergy::where('user_id', $customerId)->delete();
                
                // Add new allergies to customer_allergies table
                foreach ($validated['allergies'] as $activeIngredientId) {
                    CustomerAllergy::create([
                        'user_id' => $customerId,
                        'active_ingredient_id' => $activeIngredientId,
                    ]);
                }
            } elseif ($validated['allergies_type'] === 'none') {
                // Remove all allergies if customer has no allergies
                CustomerAllergy::where('user_id', $customerId)->delete();
            }

            // 2. Update the main prescription record
            $prescription->update([
                'user_id' => $customerId,
                'doctor_id' => $validated['doctor_id'],
                'name' => $validated['prescription_name'],
                'delivery_method' => $validated['delivery_method'],
                'repeats_total' => $validated['repeats_total'],
                'notes' => $validated['pharmacy_notes'] ?? null,
            ]);

            // 3. Update prescription items - delete existing and recreate
            $prescription->items()->delete();
            foreach ($validated['items'] as $item) {
                PrescriptionItem::create([
                    'prescription_id' => $prescription->id,
                    'medication_id' => $item['medication_id'],
                    'quantity' => $item['quantity'],
                    'instructions' => $item['instructions'] ?? null,
                    'price' => $item['price'],
                    'repeats' => $validated['repeats_total'],
                    'repeats_used' => 0,
                ]);
            }

            DB::commit();

            return redirect()->route('pharmacist.prescriptions.index')
                ->with('success', 'Manual prescription updated successfully!');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating manual prescription: ' . $e->getMessage(), [
                'request_data' => $request->all(),
                'prescription_id' => $prescription->id,
                'error' => $e->getMessage(),
            ]);
            
            return back()->withErrors(['error' => 'Failed to update prescription: ' . $e->getMessage()]);
        }
    }

    /**
     * Delete a manual prescription
     */
    public function destroyManual(Prescription $prescription)
    {
        // Ensure it's a manual prescription
        if (!$prescription->is_manual) {
            return redirect()->route('pharmacist.prescriptions.index')
                ->with('error', 'This is not a manual prescription.');
        }

        try {
            DB::beginTransaction();

            // Delete prescription items first (due to foreign key constraints)
            $prescription->items()->delete();
            
            // Delete the prescription
            $prescription->delete();

            DB::commit();

            return redirect()->route('pharmacist.prescriptions.index')
                ->with('success', 'Manual prescription deleted successfully!');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error deleting manual prescription: ' . $e->getMessage(), [
                'prescription_id' => $prescription->id,
            ]);
            
            return redirect()->route('pharmacist.prescriptions.index')
                ->with('error', 'Failed to delete prescription.');
        }
    }

    /**
     * Generate and download PDF for a manual prescription
     */
    public function generatePdf(Prescription $prescription)
    {
        // Ensure it's a manual prescription
        if (!$prescription->is_manual) {
            return redirect()->route('pharmacist.prescriptions.index')
                ->with('error', 'This is not a manual prescription.');
        }

        try {
            $prescription->load(['user', 'doctor', 'items.medication']);

            // Generate PDF using DomPDF
            $pdf = Pdf::loadView('pdf.manual-prescription', [
                'prescription' => $prescription,
                'customer' => $prescription->user,
                'doctor' => $prescription->doctor,
                'items' => $prescription->items,
            ]);

            // Save PDF to storage
            $fileName = 'manual_prescription_' . $prescription->id . '_' . time() . '.pdf';
            $filePath = 'prescriptions/' . $fileName;
            
            Storage::disk('public')->put($filePath, $pdf->output());

            // Update prescription with file path
            $prescription->update(['file_path' => $filePath]);

            // Return PDF for download
            return $pdf->download($fileName);

        } catch (\Exception $e) {
            Log::error('Error generating PDF for manual prescription: ' . $e->getMessage(), [
                'prescription_id' => $prescription->id,
            ]);
            
            return redirect()->route('pharmacist.prescriptions.index')
                ->with('error', 'Failed to generate PDF.');
        }
    }

    /**
     * Download prescription as PDF
     */
    public function downloadPrescription(Prescription $prescription)
    {
        $prescription->load([
            'user.customer',
            'doctor',
            'items.medication.activeIngredients',
        ]);

        // Get dispensed items history for this prescription
        $dispensedHistory = DispensedItem::where('prescription_id', $prescription->id)
            ->with(['pharmacist.pharmacistProfile.pharmacy', 'medication'])
            ->orderBy('dispensed_at', 'desc')
            ->get();

        // Get current pharmacist info
        $currentPharmacist = Auth::user();
        $currentPharmacistProfile = null;
        if ($currentPharmacist && $currentPharmacist->role === 'pharmacist') {
            $currentPharmacistProfile = PharmacistProfile::with('pharmacy')
                ->where('user_id', $currentPharmacist->id)
                ->first();
        }

        // Calculate totals
        $totalCost = $dispensedHistory->sum('cost');
        $totalItemsDispensed = $dispensedHistory->sum('quantity_dispensed');

        try {
            // Generate PDF using DomPDF
            $pdf = Pdf::loadView('pdf.prescription-detailed', [
                'prescription' => $prescription,
                'patient' => $prescription->user,
                'customer' => $prescription->user->customer,
                'doctor' => $prescription->doctor,
                'items' => $prescription->items,
                'dispensed_history' => $dispensedHistory,
                'totals' => [
                    'total_cost' => $totalCost,
                    'total_items_dispensed' => $totalItemsDispensed,
                    'prescription_total_value' => $prescription->items->sum('price'),
                ],
                'current_pharmacist' => $currentPharmacistProfile,
                'generated_at' => now(),
            ]);

            // Set paper size and orientation
            $pdf->setPaper('A4', 'portrait');

            // Generate filename
            $filename = 'prescription_' . $prescription->id . '_' . date('Y-m-d_H-i-s') . '.pdf';

            // Return PDF for download
            return $pdf->download($filename);

        } catch (\Exception $e) {
            Log::error('Error generating prescription PDF: ' . $e->getMessage(), [
                'prescription_id' => $prescription->id,
            ]);
            
            return redirect()->back()->with('error', 'Failed to generate PDF.');
        }
    }
}