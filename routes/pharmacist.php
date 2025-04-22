<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'role:pharmacist'])->prefix('pharmacist')->name('pharmacist.')->group(function () {
    Route::get('/dashboard', fn () => Inertia::render('Pharmacist/Dashboard'))->name('dashboard');
});