<?php

namespace App\Http\Controllers\Pharmacist;

use App\Http\Controllers\Controller;
use App\Models\Customer\Prescription;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PharmacistPrescriptionController extends Controller
{
    public function index()
    {
        $prescriptions = Prescription::with('user')
            ->latest()
            ->get()
            ->map(function ($prescription) {
                return [
                    'id' => $prescription->id,
                    'customer_name' => $prescription->user->name ?? 'N/A',
                    'prescription_name' => $prescription->name,
                    'upload_date' => $prescription->created_at->format('Y-m-d'),
                    'status' => $prescription->status,
                    'file_path' => $prescription->file_path,
                ];
            });

        return Inertia::render('Pharmacist/Prescriptions', [
            'prescriptions' => $prescriptions,
        ]);
    }
}
