<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::middleware(['auth', 'role:pharmacist'])->prefix('pharmacist')->name('pharmacist.')->group(function () {
    // 1. Pharmacist Dashboard
    Route::get('/dashboard', fn () => Inertia::render('Pharmacist/Dashboard'))->name('dashboard');

    // 2. Pharmacist Profile Information
    Route::get('/profile', fn () => Inertia::render('Pharmacist/Profile'))->name('profile.show');

    // 3. View Prescriptions
    Route::get('/prescriptions', fn () => Inertia::render('Pharmacist/ViewPrescriptions'))->name('prescriptions.index');

    // 4. Load Prescription
    Route::get('/prescriptions/load', fn () => Inertia::render('Pharmacist/LoadPrescription'))->name('prescriptions.load');
    // TODO: Add POST route for submitting the loaded prescription form

    // 5. Dispense Prescription
    Route::get('/prescriptions/dispense', fn () => Inertia::render('Pharmacist/DispensePrescription'))->name('prescriptions.dispense.show');
    // TODO: Add POST route for the dispense action

    // 6. Generate Dispensed Medication Report
    Route::get('/reports/dispensed-medications', fn () => Inertia::render('Pharmacist/DispensedMedicationReport'))->name('reports.dispensed-medications.create');
    // TODO: Add GET/POST route for viewing/generating the report
});