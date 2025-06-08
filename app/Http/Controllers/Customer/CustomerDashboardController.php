<?php

// app/Http/Controllers/Customer/CustomerDashboardController.php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Customer\Prescription; // Correct model import

class CustomerDashboardController extends Controller
{
    // public function index()
    // {
    //     $user = auth()->user(); // Get the currently authenticated user

    //     $pendingPrescriptionsCount = 0;
    //     $availableRepeatsCount = 0;

    //     if ($user) {
    //         // Count pending prescriptions for this user - THIS IS CORRECT!
    //         $pendingPrescriptionsCount = Prescription::where('user_id', $user->id)
    //                                                 ->where('status', 'pending')
    //                                                 ->count();

    //         // Count available repeats
    //         // This logic is good for a simple count of prescriptions that CAN have repeats
    //         $availableRepeatsCount = Prescription::where('user_id', $user->id)
    //                                                 ->where('status', 'approved')
    //                                                 ->whereColumn('repeats_used', '<', 'repeats_total')
    //                                                 ->count();
    //     }

    //     return Inertia::render('Customer/Dashboard', [
    //         'pendingPrescriptionsCount' => $pendingPrescriptionsCount,
    //         'availableRepeatsCount' => $availableRepeatsCount,
    //         // 'auth' prop is usually automatically passed by Inertia/Breeze/Jetstream
    //     ]);
    // }

    public function index()
    {
        $user = auth()->user(); // Get the currently authenticated user

        $pendingPrescriptionsCount = 0;
        $availableRepeatsCount = 0;

        if ($user) {
            $pendingPrescriptionsCount = Prescription::where('user_id', $user->id)
                                                    ->where('status', 'pending')
                                                    ->count();

            $availableRepeatsCount = Prescription::where('user_id', $user->id)
                                                    ->where('status', 'approved')
                                                    ->whereColumn('repeats_used', '<', 'repeats_total')
                                                    ->count();
        }

        return Inertia::render('Customer/Dashboard', [
            'pendingPrescriptionsCount' => $pendingPrescriptionsCount,
            'availableRepeatsCount' => $availableRepeatsCount,
        ]);
    }

    public function reportsIndex()
    {
        return Inertia::render('Customer/Reports/ReportIndex');
    }
}