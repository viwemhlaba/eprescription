<?php

namespace App\Http\Controllers\Pharmacist;

use App\Http\Controllers\Controller;
use App\Models\Customer\Prescription;
use App\Models\Medication\Medication;
use App\Models\Customer\PrescriptionItem;
use App\Models\Doctor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PharmacistPrescriptionController extends Controller
{
    public function index()
    {
        $prescriptions = Prescription::with('user') // eager load customer
//        ->when($request->has('status'), function ($query) use ($request) {
//            $query->where('status', $request->status);
//        })
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
                ];
            });

        return inertia('Pharmacist/Prescriptions/Index', [
            'prescriptions' => $prescriptions,
        ]);
    }


//    public function load($id)
//    {
//        $prescription = Prescription::with('user', 'items.medication', 'doctor')->findOrFail($id);
//
//        return inertia('Pharmacist/Prescriptions/Load', [
//            'prescription' => $prescription,
//        ]);
//    }

    public function load($id)
    {
        $prescription = Prescription::with([
            'user',
            'doctor:id,name',
            'items.medication:id,name,current_sale_price'
        ])->findOrFail($id);

        return inertia('Pharmacist/Prescriptions/Load', [
            'prescription' => [
                'id' => $prescription->id,
                'customer_name' => $prescription->user->name ?? 'Unknown',
                'prescription_name' => $prescription->name,
                'delivery_method' => $prescription->delivery_method,
                'upload_date' => $prescription->created_at->toISOString(),
                'pdf_url' => asset('storage/' . $prescription->file_path),
                'doctor_id' => $prescription->doctor_id,
                'patient_id_number' => $prescription->patient_id_number,
                'items' => $prescription->items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'medication_name' => $item->medication->name,
                        'medication_price' => $item->medication->current_sale_price,
                        'quantity' => $item->quantity,
                        'instructions' => $item->instructions,
                        'price' => $item->price,
                    ];
                }),
            ],
            'doctors' => Doctor::select('id', 'name')->get(),
        ]);
    }

    public function create(Prescription $prescription)
    {
        $doctors = Doctor::select('id', 'name')->get();
        //$medications = Medication::select('id', 'name', 'current_sale_price')->get();

        $medications = Medication::select('id', 'name', 'current_sale_price')
            ->get()
            ->map(function ($med) {
                return [
                    'id' => $med->id,
                    'name' => $med->name,
                    'current_sale_price' => (float) $med->current_sale_price,
                ];
            });


        return Inertia::render('Pharmacist/Prescriptions/Create', [
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

//    public function storeLoaded(Request $request, $id)
//    {
//        $validated = $request->validate([
//            'patient_id_number' => 'required|string|max:255',
//            'doctor_id' => 'required|exists:doctors,id',
//            'items' => 'required|array|min:1',
//            'items.*.medication_id' => 'required|exists:medications,id',
//            'items.*.quantity' => 'required|integer|min:1',
//            'items.*.instructions' => 'nullable|string|max:1000',
//        ]);
//
//        $prescription = Prescription::findOrFail($id);
//        //$prescription->patient_id = $validated['patient_id'];
//        $prescription->patient_id_number = $validated['patient_id_number'];
//
//        $prescription->doctor_id = $validated['doctor_id'];
//        $prescription->status = 'approved'; // or whatever status you use
//        $prescription->save();
//
//        return redirect()->route('pharmacist.prescriptions.index')
//            ->with('success', 'Prescription successfully loaded.');
//    }

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
        ]);

        $prescription = Prescription::findOrFail($id);

        $prescription->update([
            'patient_id_number' => $validated['patient_id_number'],
            'doctor_id' => $validated['doctor_id'],
            'status' => 'approved',
        ]);

        return redirect()->route('pharmacist.prescriptions.index')
            ->with('success', 'Prescription loaded successfully.');
    }



}
