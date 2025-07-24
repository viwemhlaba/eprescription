<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class DoctorController extends Controller
{
    public function index()
    {
        $doctors = Doctor::orderBy('name')->get();
        return Inertia::render('Manager/Doctors/Index', [
            'doctors' => $doctors
        ]);
    }

    public function create()
    {
        return Inertia::render('Manager/Doctors/Create');
    }

    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'surname' => ['required', 'string', 'max:255'],
                'email' => ['required', 'string', 'email', 'max:255', 'unique:doctors,email'],
                'phone' => ['required', 'string', 'max:255', 'unique:doctors,phone'],
                'practice_number' => ['required', 'string', 'max:255', 'unique:doctors,practice_number'],
            ]);

            Doctor::create($validatedData);

            // For manager requests, redirect to the index page
            if ($request->routeIs('manager.doctors.store')) {
                return redirect()->route('manager.doctors.index')->with('success', 'Doctor added successfully!');
            }

            // For pharmacist requests, redirect back (original behavior)
            return redirect()->back()->with('success', 'Doctor added successfully!');

        } catch (ValidationException $e) {
            return redirect()->back()->withErrors($e->errors());
        }
    }

    public function edit(Doctor $doctor)
    {
        return Inertia::render('Manager/Doctors/Edit', [
            'doctor' => $doctor
        ]);
    }

    public function update(Request $request, Doctor $doctor)
    {
        $validatedData = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'surname' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:doctors,email,' . $doctor->id],
            'phone' => ['required', 'string', 'max:255', 'unique:doctors,phone,' . $doctor->id],
            'practice_number' => ['required', 'string', 'max:255', 'unique:doctors,practice_number,' . $doctor->id],
        ]);

        $doctor->update($validatedData);

        return redirect()->route('manager.doctors.index')->with('success', 'Doctor updated successfully!');
    }

    public function destroy(Doctor $doctor)
    {
        $doctor->delete();
        return redirect()->route('manager.doctors.index')->with('success', 'Doctor deleted successfully!');
    }
}
