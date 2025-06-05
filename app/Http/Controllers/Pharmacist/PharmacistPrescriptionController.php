<?php

namespace App\Http\Controllers\Pharmacist;

use App\Http\Controllers\Controller;
use App\Models\Customer\Prescription;
use App\Models\Medication\Medication;
use App\Models\Customer\PrescriptionItem;
use App\Models\Doctor;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Mail\PrescriptionApprovedMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth; // Incorrect or missing import
use Carbon\Carbon; // Make sure to import Carbon if using it for registrationDate

// Add this import for the Allergy model if you have one, or adjust as needed
use App\Models\Customer\CustomerAllergy; // Assuming you have a CustomerAllergy model or similar


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
                    // Add repeats info for the index view
                    'repeats_total' => $prescription->repeats_total,
                    'repeats_used' => $prescription->repeats_used,
                    'next_repeat_date' => $prescription->next_repeat_date ? \Carbon\Carbon::parse($prescription->next_repeat_date)->format('Y-m-d') : null,
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
            'user',
            'doctor:id,name',
            'items.medication:id,name,current_sale_price',
        ])->findOrFail($id);

        // Fetch all doctors and medications, similar to your create method
        $doctors = Doctor::select('id', 'name')->get();
        $medications = Medication::select('id', 'name', 'current_sale_price')
            ->with('activeIngredients') // Ensure active ingredients are loaded
            ->get()
            ->map(function ($med) {
                return [
                    'id' => $med->id,
                    'name' => $med->name,
                    'current_sale_price' => (float) $med->current_sale_price,
                    // Map active ingredients to their IDs
                    'active_ingredients' => $med->activeIngredients->pluck('id')->toArray(),
                ];
            });

        // Fetch customer's allergy IDs
        $customerAllergyIds = [];
        if ($prescription->user) {
            // Assuming the Customer model has a relationship to allergies, e.g., customer->allergies
            // Or if allergies are stored directly on the user/customer model as a string/json
            // You might need to adjust this based on how customer allergies are stored.
            // Example if using a CustomerAllergy model:
            $customerAllergyIds = $prescription->user->allergies->pluck('active_ingredient_id')->toArray();
        }


        return inertia('Pharmacist/Prescriptions/LoadPrescription', [
            // Pass the prescriptionId prop
            'prescriptionId' => $prescription->id,
            // Pass initialData that matches the structure expected by the frontend
            'initialData' => [
                'customer_name' => $prescription->user->name ?? 'Unknown',
                'prescription_name' => $prescription->name,
                'delivery_method' => $prescription->delivery_method,
                'upload_date' => $prescription->created_at->toISOString(),
                'pdf_url' => asset('storage/' . $prescription->file_path),
                'doctor_id' => $prescription->doctor_id,
                'patient_id_number' => $prescription->patient_id_number,
                // Do not pass 'items' here in initialData for the main form state,
                // as the form's 'items' should be managed by the useForm hook's initial value
                // and updated via 'setData' or if loading existing items into the form.
                // We'll manage existing items separately if they need to be pre-filled.
            ],
            'doctors' => $doctors,
            'medications' => $medications,
            'customerAllergyIds' => $customerAllergyIds,
            // If you want to pre-fill the form with existing prescription items,
            // you'll need to pass them in a way the 'useForm' hook can consume them.
            // For now, let's assume the form starts empty or is populated by the frontend
            // using the 'initialData' for basic fields. If you want to load existing items,
            // we'll need to adjust the 'useForm' initialization in LoadPrescription.tsx.
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
        $doctors = Doctor::select('id', 'name')->get();
        // Fetch medications including active ingredients
        $medications = Medication::select('id', 'name', 'current_sale_price')
            ->with('activeIngredients') // Assuming you have this relationship
            ->get()
            ->map(function ($med) {
                return [
                    'id' => $med->id,
                    'name' => $med->name,
                    'current_sale_price' => (float) $med->current_sale_price,
                    // Map active ingredients to their IDs
                    'active_ingredients' => $med->activeIngredients->pluck('id')->toArray(),
                ];
            });

        // For a new prescription, customerAllergyIds might be empty or based on a selected customer if applicable.
        // Assuming for now, in 'create' context, it's either empty or handled differently.
        // If a customer is pre-selected, you'd fetch their allergies here.
        $customerAllergyIds = [];
        if ($prescription->user) {
            $customerAllergyIds = $prescription->user->allergies->pluck('active_ingredient_id')->toArray();
        }

        return Inertia::render('Pharmacist/Prescriptions/LoadPrescription', [
            'prescriptionId' => $prescription->id,
            'initialData' => [
                'customer_name' => $prescription->user->name ?? 'Unknown',
                'prescription_name' => $prescription->name,
                'delivery_method' => $prescription->delivery_method,
                'upload_date' => $prescription->created_at->toISOString(),
                'pdf_url' => asset('storage/' . $prescription->file_path),
                'doctor_id' => $prescription->doctor_id,
                'patient_id_number' => $prescription->patient_id_number,
            ],
            'doctors' => $doctors,
            'medications' => $medications,
            'customerAllergyIds' => $customerAllergyIds,
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


    public function storeLoaded(Request $request, $id)
    {
        $validated = $request->validate([
            'patient_id_number' => 'required|string|max:255',
            'doctor_id' => 'required|exists:doctors,id',
            'items' => 'required|array',
            'items.*.medication_id' => 'required|exists:medications,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.instructions' => 'nullable|string',
        ]);

        $prescription = Prescription::findOrFail($id);

        $prescription->update([
            'patient_id_number' => $validated['patient_id_number'],
            'doctor_id' => $validated['doctor_id'],
            'status' => 'approved',
        ]);

        Mail::to($prescription->user->email)->send(new PrescriptionApprovedMail($prescription));

        // Clear existing items and re-add them if you're "loading" and updating all items
        $prescription->items()->delete(); // Add this line if you want to replace all items

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

        // If you were to handle item updates here, you'd iterate through items
        // and update/create PrescriptionItem records.
        // Example (simplified):
        // if (isset($validated['items'])) {
        //     $prescription->items()->delete(); // Or clever sync logic
        //     foreach ($validated['items'] as $itemData) {
        //         PrescriptionItem::create([
        //             'prescription_id' => $prescription->id,
        //             'medication_id' => $itemData['medication_id'],
        //             'quantity' => $itemData['quantity'],
        //             'instructions' => $itemData['instructions'] ?? null,
        //             'price' => Medication::find($itemData['medication_id'])->current_sale_price * $itemData['quantity'],
        //         ]);
        //     }
        // }


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

    public function loadAction(Request $request, Prescription $prescription)
    {
        $validated = $request->validate([
            'patient_id_number' => 'required|string|max:255',
            'doctor_id' => 'required|exists:doctors,id',
            'items' => 'required|array|min:1',
            'items.*.medication_id' => 'required|exists:medications,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.instructions' => 'nullable|string|max:500',
        ]);

        // Update prescription with doctor and patient details
        $prescription->update([
            'patient_id_number' => $validated['patient_id_number'],
            'doctor_id' => $validated['doctor_id'],
            'status' => 'approved',
        ]);

        // Remove existing items (optional, based on your logic)
        $prescription->items()->delete();

        // Add updated items
        foreach ($validated['items'] as $item) {
            $medication = Medication::findOrFail($item['medication_id']);
            PrescriptionItem::create([
                'prescription_id' => $prescription->id,
                'medication_id' => $medication->id,
                'quantity' => $item['quantity'],
                'instructions' => $item['instructions'] ?? null,
                'price' => $medication->current_sale_price * $item['quantity'],
            ]);
        }

        return redirect()->route('pharmacist.prescriptions.index')
            ->with('success', 'Prescription successfully processed.');
    }


    public function destroy(Prescription $prescription)
    {
        $prescription->delete();

        return redirect()->route('pharmacist.prescriptions.index')
            ->with('success', 'Prescription deleted successfully.');
    }

    // app/Http/Controllers/Pharmacist/PharmacistController.php

    public function dashboard()
    {
        $user = Auth::user(); // This line or similar likely triggered the error

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
        $user = Auth::user(); // This line or similar likely triggered the error

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
        $user = Auth::user(); // This line or similar likely triggered the error

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
        $user = Auth::user(); // This line or similar likely triggered the error

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
