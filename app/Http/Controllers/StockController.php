<?php

namespace App\Http\Controllers;

use App\Models\Medication;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockController extends Controller
{
    public function index()
    {
        $medications = \App\Models\Medication\Medication::all();
        return Inertia::render('Manager/Medications/StockManagement', [
            'medications' => $medications
        ]);
    }
}
