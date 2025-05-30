<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Customer\PrescriptionController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::middleware(['auth', 'role:manager'])->group(function () {
    Route::get('/manager/dashboard', fn () => Inertia::render('Manager/Dashboard'));
});


Route::middleware(['auth', 'role:pharmacist'])->prefix('pharmacist')->name('pharmacist.')->group(function () {
    Route::get('/dashboard', fn () => Inertia::render('Pharmacist/Dashboard'))->name('dashboard');
    Route::get('/profile', fn () => Inertia::render('Pharmacist/Profile'))->name('profile');
    Route::get('/prescriptions', fn () => Inertia::render('Pharmacist/Prescriptions'))->name('prescriptions');
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
