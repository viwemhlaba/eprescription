<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Models\Pharmacy;
use App\Models\User; // Assuming pharmacists are Users
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth; // To get the logged-in manager
use Illuminate\Support\Facades\Mail; // Import the Mail facade
use App\Mail\ResponsiblePharmacistAssigned; // Import your Mailable class
use Illuminate\Validation\Rule; // Import Rule for validation

class PharmacyController extends Controller
{
    /**
     * Display a listing of the pharmacies managed by the current user.
     */
    public function index()
    {
        $manager = Auth::user(); // Get the currently authenticated manager

        // Load pharmacies managed by this specific manager, eager load responsible pharmacist
        $pharmacies = $manager->managedPharmacies()->with('responsiblePharmacist')->get();

        return Inertia::render('Manager/Pharmacies/Index', [
            'pharmacies' => $pharmacies,
        ]);
    }

    /**
     * Show the form for creating a new pharmacy.
     */
    public function create()
    {
        // Fetch all users who are pharmacists to populate the dropdown
        $pharmacists = User::where('role', 'pharmacist')->get(['id', 'name', 'email']);

        return Inertia::render('Manager/Pharmacies/Create', [
            'pharmacists' => $pharmacists,
        ]);
    }

    /**
     * Store a newly created pharmacy in storage and associate it with the current manager.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'health_council_registration_number' => 'required|string|max:255|unique:pharmacies,health_council_registration_number',
            'physical_address' => 'nullable|string|max:255',
            'contact_number' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'website_url' => 'nullable|url|max:255',
            'responsible_pharmacist_id' => 'nullable|exists:users,id',
        ]);

        $pharmacy = Pharmacy::create($validatedData);

        // Attach the newly created pharmacy to the current manager
        $manager = Auth::user();
        $manager->managedPharmacies()->attach($pharmacy->id);

        // --- EMAIL NOTIFICATION LOGIC ---
        if ($pharmacy->responsible_pharmacist_id) {
            $responsiblePharmacist = User::find($pharmacy->responsible_pharmacist_id);

            if ($responsiblePharmacist) {
                // Send the email
                Mail::to($responsiblePharmacist->email)->send(new ResponsiblePharmacistAssigned($pharmacy, $responsiblePharmacist));
            }
        }
        // --- END EMAIL NOTIFICATION LOGIC ---

        return redirect()->route('manager.pharmacies.index')->with('success', 'Pharmacy added successfully and assigned to you!');
    }

    // You might want to add 'edit', 'update', 'destroy' methods later for individual pharmacies
    // For now, let's focus on the index and create flow.

    public function edit(Pharmacy $pharmacy)
    {
        // Add authorization check here if needed (e.g., ensure manager owns this pharmacy)
        // $this->authorize('update', $pharmacy); // If using policies

        $pharmacists = User::where('role', 'pharmacist')->get(['id', 'name', 'email']);

        // Eager load the responsible pharmacist for the currently selected pharmacy
        $pharmacy->load('responsiblePharmacist');

        return Inertia::render('Manager/Pharmacies/Edit', [ // Changed path to Pharmacies/Edit
            'pharmacy' => $pharmacy,
            'pharmacists' => $pharmacists,
        ]);
    }

    /**
     * Update the specified pharmacy in storage.
     */
    public function update(Request $request, Pharmacy $pharmacy)
    {
        // Add authorization check here if needed
        // $this->authorize('update', $pharmacy);

        $oldResponsiblePharmacistId = $pharmacy->responsible_pharmacist_id;

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            // Use Rule::unique to ignore the current pharmacy's ID during update
            'health_council_registration_number' => [
                'required',
                'string',
                'max:255',
                Rule::unique('pharmacies')->ignore($pharmacy->id),
            ],
            'physical_address' => 'nullable|string|max:255',
            'contact_number' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'website_url' => 'nullable|url|max:255',
            'responsible_pharmacist_id' => 'nullable|exists:users,id',
        ]);

        $pharmacy->update($validatedData);

        // Check if responsible pharmacist changed and send email if so
        if ($pharmacy->responsible_pharmacist_id !== $oldResponsiblePharmacistId) {
            // Send email to the NEW responsible pharmacist
            if ($pharmacy->responsible_pharmacist_id) {
                $newResponsiblePharmacist = User::find($pharmacy->responsible_pharmacist_id);
                if ($newResponsiblePharmacist) {
                    Mail::to($newResponsiblePharmacist->email)->send(new ResponsiblePharmacistAssigned($pharmacy, $newResponsiblePharmacist));
                }
            }
            // Optionally, send a notification to the OLD responsible pharmacist that they've been unassigned.
        }

        return redirect()->route('manager.pharmacies.index')->with('success', 'Pharmacy details updated successfully!');
    }

    /**
     * Remove the specified pharmacy from storage. (Optional, if you need delete)
     */
    // public function destroy(Pharmacy $pharmacy)
    // {
    //     $this->authorize('delete', $pharmacy); // If using policies
    //     $pharmacy->delete(); // This will also delete pivot entries due to onDelete('cascade')
    //     return redirect()->route('manager.pharmacies.index')->with('success', 'Pharmacy deleted successfully!');
    // }
}