<?php

namespace App\Http\Controllers;

use App\Models\Medication;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 15);
        $medications = \App\Models\Medication\Medication::orderBy('name')
            ->paginate($perPage);
            
        return Inertia::render('Manager/Medications/StockManagement', [
            'medications' => $medications
        ]);
    }
}
