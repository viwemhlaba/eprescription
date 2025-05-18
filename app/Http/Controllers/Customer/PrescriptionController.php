<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Customer\Prescription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Http\Requests\Customer\Prescription\UpdatePrescriptionRequest;
use App\Http\Requests\Customer\Prescription\StorePrescriptionRequest;
use Barryvdh\DomPDF\Facade\Pdf;



class PrescriptionController extends Controller
{
    /**
     * List all prescriptions for the logged-in customer
     */
    public function index()
    {
        $prescriptions = Prescription::with(['doctor', 'items.medication']) // <-- add relationships
            ->where('user_id', Auth::id())
            ->latest()
            ->get();

        return Inertia::render('Customer/Prescriptions/Index', [
            'prescriptions' => $prescriptions,
        ]);
    }

    /**
     * Show upload form
     */
    public function create()
    {
        return Inertia::render('Customer/Prescriptions/Create');
    }

    /**
     * Store uploaded prescription
     */
    public function store(StorePrescriptionRequest $request)
    {

        $path = $request->file('prescription_file')->store('prescriptions', 'public');

        Prescription::create([
            'user_id' => Auth::id(),
            'name' => $request->name,
            'file_path' => $path,
            'status' => 'pending',
        ]);

        return redirect()->route('customer.prescriptions.index')->with('success', 'Prescription uploaded successfully.');
    }

    public function update(UpdatePrescriptionRequest $request, Prescription $prescription)
    {
        //$this->authorize('update', $prescription); // optional
        if ($prescription->user_id !== Auth::id()) {
            abort(403);
        }

        if ($request->hasFile('prescription_file')) {
            // Delete old file
            if ($prescription->file_path && Storage::disk('public')->exists($prescription->file_path)) {
                Storage::disk('public')->delete($prescription->file_path);
            }

            $path = $request->file('prescription_file')->store('prescriptions', 'public');
            $prescription->file_path = $path;
        }

        $prescription->name = $request->name;
        $prescription->save();

        return redirect()->route('customer.prescriptions.index')->with('success', 'Prescription updated successfully.');
    }

    public function edit(Prescription $prescription)
    {
        // $this->authorize('update', $prescription); // Optional if using policies
        if ($prescription->user_id !== Auth::id()) {
            abort(403);
        }
        return Inertia::render('Customer/Prescriptions/Edit', [
            'prescription' => $prescription,
        ]);
    }

    public function destroy(Prescription $prescription)
    {
        if ($prescription->user_id !== Auth::id()) {
            abort(403);
        }

        // Delete file from storage
        if ($prescription->file_path && Storage::disk('public')->exists($prescription->file_path)) {
            Storage::disk('public')->delete($prescription->file_path);
        }

        $prescription->delete();

        return redirect()->back()->with('success', 'Prescription deleted successfully.');
    }

    public function requestRepeat(Prescription $prescription)
    {
        if ($prescription->user_id !== Auth::id()) {
            abort(403);
        }

        if ($prescription->repeats_used >= $prescription->repeats_total) {
            return back()->with('error', 'You have used all available repeats.');
        }

        //$prescription->increment('repeats_used');

        // Optional: Calculate the next repeat date (e.g., 30 days later)
        $prescription->next_repeat_date = now()->addDays(30)->format('Y-m-d');
        $prescription->status = 'repeat_pending';
        $prescription->save();

        return back()->with('success', 'Repeat requested successfully.');
    }

    public function exportPdf(Request $request)
    {
        $query = Prescription::where('user_id', Auth::id());

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }

        if ($request->filled('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        $prescriptions = $query->latest()->get();

        $pdf = Pdf::loadView('pdf.prescriptions', [
            'prescriptions' => $prescriptions,
            'user' => Auth::user(),
        ]);

        return $pdf->download('prescription-report.pdf');
    }

    public function repeats()
    {
        $prescriptions = Prescription::where('user_id', Auth::id())
            ->whereNotNull('repeats_total')
            ->latest()
            ->get();

        return Inertia::render('Customer/Repeats/Index', [
            'prescriptions' => $prescriptions,
        ]);
    }
}
