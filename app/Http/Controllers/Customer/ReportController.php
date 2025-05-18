<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Customer\Prescription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $query = Prescription::where('user_id', Auth::id())
            ->where('status', 'dispensed');

        if ($request->from_date) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }

        if ($request->to_date) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        $prescriptions = $query->latest()->get();

        return Inertia::render('Customer/Reports/Index', [
            'prescriptions' => $prescriptions,
            'filters' => $request->only(['from_date', 'to_date']),
        ]);
    }

    public function export(Request $request)
    {
        $query = Prescription::where('user_id', Auth::id())
            ->where('status', 'dispensed');

        if ($request->from_date) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }

        if ($request->to_date) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        $prescriptions = $query->latest()->get();

        $pdf = Pdf::loadView('reports.customer', ['prescriptions' => $prescriptions]);

        return $pdf->download('prescription-report.pdf');
    }
}
