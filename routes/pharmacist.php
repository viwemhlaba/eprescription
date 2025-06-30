<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Pharmacist\PharmacistPrescriptionController;


Route::middleware(['auth', 'role:pharmacist'])->prefix('pharmacist')->name('pharmacist.')->group(function () {
    // Profile routes
    Route::get('/profile', [PharmacistPrescriptionController::class, 'profile'])->name('profile');
    Route::get('/profile/edit', [PharmacistPrescriptionController::class, 'editProfile'])->name('profile.edit');
    Route::put('/profile', [PharmacistPrescriptionController::class, 'updateProfile'])->name('profile.update');
    Route::post('/profile', [PharmacistPrescriptionController::class, 'updateProfile'])->name('profile.update.post'); // Temporary for testing
});
