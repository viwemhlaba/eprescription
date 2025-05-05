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
Route::middleware(['auth', 'role:pharmacist'])->group(function () {
    Route::get('/pharmacist/dashboard', fn () => Inertia::render('Pharmacist/Dashboard'));
});
Route::middleware(['auth', 'role:customer'])->group(function () {
    Route::get('/customer/dashboard', fn () => Inertia::render('Customer/Dashboard'));
    Route::post('/prescriptions/{prescription}/request-repeat', [PrescriptionController::class, 'requestRepeat'])
    ->name('customer.prescriptions.request-repeat');
    Route::get('/prescriptions/export/pdf', [PrescriptionController::class, 'exportPdf'])
    ->name('customer.prescriptions.export');
    Route::get('/customer/repeats', [PrescriptionController::class, 'repeats'])->name('customer.repeats.index');

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
