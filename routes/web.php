<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Customer\PrescriptionController;
use App\Http\Controllers\Pharmacist\PharmacistPrescriptionController;
use App\Http\Controllers\DoctorController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

// routes/web.php



Route::middleware(['auth', 'role:manager'])->group(function () {
    Route::get('/manager/dashboard', fn () => Inertia::render('Manager/Dashboard'));
});




Route::middleware(['auth', 'role:pharmacist'])->prefix('pharmacist')->name('pharmacist.')->group(function () {
    // Consolidated Dashboard Route
    // Use the controller method for the dashboard to pass dynamic data
    Route::get('/dashboard', [PharmacistPrescriptionController::class, 'dashboard'])->name('dashboard');

    // Consolidated Profile Routes
    // Use the controller methods for profile view and edit
    Route::get('/profile', [PharmacistPrescriptionController::class, 'profile'])->name('profile');
    Route::get('/profile/edit', [PharmacistPrescriptionController::class, 'editProfile'])->name('profile.edit');
    Route::put('/profile', [PharmacistPrescriptionController::class, 'updateProfile'])->name('profile.update');


    // Prescription Routes
    Route::get('/prescriptions', [PharmacistPrescriptionController::class, 'index'])->name('prescriptions.index');
    Route::get('/prescriptions/load/{prescription}', [PharmacistPrescriptionController::class, 'load'])->name('prescriptions.load');
    Route::get('/prescriptions/create/{prescription}', [PharmacistPrescriptionController::class, 'create'])->name('prescriptions.create');
    Route::post('/prescriptions', [PharmacistPrescriptionController::class, 'store'])->name('prescriptions.store');
    Route::delete('/prescriptions/{prescription}', [PharmacistPrescriptionController::class, 'destroy'])->name('prescriptions.destroy');

    // Use unique route names inside group
    Route::post('/prescriptions/load/{id}', [PharmacistPrescriptionController::class, 'storeLoaded'])
        ->name('prescriptions.storeLoaded');

    Route::post('/prescriptions/update/{prescription}', [PharmacistPrescriptionController::class, 'update']) // Updated URI to avoid conflict and be more descriptive
    ->name('prescriptions.update');

    Route::get('/prescriptions/{prescription}', [PharmacistPrescriptionController::class, 'showPrescription'])
        ->name('prescriptions.show');

    // If loadAction is different from the other load, keep it, otherwise consolidate
    Route::post('/prescriptions/{prescription}/load-action', [PharmacistPrescriptionController::class, 'load'])
        ->name('prescriptions.loadAction');

    // Doctor Routes (if needed)
    Route::post('/doctors', [DoctorController::class, 'store'])->name('doctors.store');

    Route::get('/profile/edit', [PharmacistPrescriptionController::class, 'editProfile'])->name('profile.edit');
    Route::put('/profile', [PharmacistPrescriptionController::class, 'updateProfile'])->name('profile.update');

    // Other Pharmacist Routes
    Route::get('/repeats', fn () => Inertia::render('Pharmacist/Repeats'))->name('repeats');
    Route::get('/stock', fn () => Inertia::render('Pharmacist/Stock'))->name('stock');
    Route::get('/reports', fn () => Inertia::render('Pharmacist/Reports'))->name('reports');
});

Route::middleware(['auth', 'role:customer'])->group(function () {
    Route::get('/customer/dashboard', fn () => Inertia::render('Customer/Dashboard'));
    Route::post('/prescriptions/{prescription}/request-repeat', [PrescriptionController::class, 'requestRepeat'])
    ->name('customer.prescriptions.request-repeat');
    Route::get('/prescriptions/export/pdf', [PrescriptionController::class, 'exportPdf'])
    ->name('customer.prescriptions.export');
    Route::get('/customer/repeats', [PrescriptionController::class, 'repeats'])->name('customer.repeats.index');
});

Route::middleware(['auth', 'role:manager'])->prefix('manager')->name('manager.')->group(function () {
    // Dashboard
    Route::get('/dashboard', fn () => Inertia::render('Manager/Dashboard'))->name('dashboard');

    // Pharmacy Details
    Route::get('/pharmacy/details', fn () => Inertia::render('Manager/Pharmacy/Details'))->name('pharmacy.details');

    // Medications Catalogue
    Route::get('/catalogue/medications', fn () => Inertia::render('Manager/Catalogue/Medications'))->name('catalogue.medications');

    // Suppliers
    Route::get('/suppliers', fn () => Inertia::render('Manager/Suppliers/Index'))->name('suppliers.index');

    // People (Pharmacists)
    Route::get('/people/pharmacists', fn () => Inertia::render('Manager/People/Pharmacists'))->name('people.pharmacists');

    // Stock
    Route::get('/stock', fn () => Inertia::render('Manager/Stock/Index'))->name('stock.index');

    // Orders
    Route::get('/orders', fn () => Inertia::render('Manager/Orders/Index'))->name('orders.index');

    // Reports
    Route::get('/reports', fn () => Inertia::render('Manager/Reports/Index'))->name('reports.index');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
