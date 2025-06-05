<?php

namespace App\Http\Controllers; // Or App\Http\Controllers\Pharmacist if it's there

use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException; // Don't forget this import

class DoctorController extends Controller
{
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'surname' => ['required', 'string', 'max:255'], // <--- Ensure this is validated
                'email' => ['required', 'string', 'email', 'max:255', 'unique:doctors,email'], // <--- And this
                'phone' => ['required', 'string', 'max:255', 'unique:doctors,phone'], // <--- And this
                'practice_number' => ['required', 'string', 'max:255', 'unique:doctors,practice_number'], // <--- And this
            ]);

            Doctor::create($validatedData);

            // Return a success response, maybe an Inertia redirect or JSON response
            return redirect()->back()->with('success', 'Doctor added successfully!');

        } catch (ValidationException $e) {
            // If validation fails, Inertia handles redirecting back with errors
            return redirect()->back()->withErrors($e->errors());
        }
    }
}
