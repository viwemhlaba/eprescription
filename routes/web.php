<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
