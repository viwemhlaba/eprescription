<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\StockController;
use App\Http\Controllers\OrderController;

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
    Route::get('/medications/stock', [StockController::class, 'index'])->name('medications.stock.index');
    Route::patch('/medications/{medication}/set-stock', [\App\Http\Controllers\MedicationController::class, 'setStock'])->name('medications.set-stock');
    Route::patch('/medications/{medication}/add-stock', [\App\Http\Controllers\MedicationController::class, 'addStock'])->name('medications.add-stock');

    // Orders
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/create', [OrderController::class, 'create'])->name('orders.create');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');
    Route::patch('/orders/{order}/receive', [OrderController::class, 'receive'])->name('orders.receive');

    // Reports
    Route::get('/reports', fn () => Inertia::render('Manager/Reports/Index'))->name('reports.index');

    // Suppliers CRUD (resource routes)
    Route::resource('suppliers', App\Http\Controllers\MedicationSupplierController::class)
        ->except(['show'])
        ->names([
            'index' => 'suppliers.index',
            'create' => 'suppliers.create',
            'store' => 'suppliers.store',
            'edit' => 'suppliers.edit',
            'update' => 'suppliers.update',
            'destroy' => 'suppliers.destroy',
        ]);

    // Medications CRUD (resource routes)
    Route::resource('medications', App\Http\Controllers\MedicationController::class)
        ->except(['show'])
        ->names([
            'index' => 'medications.index',
            'create' => 'medications.create',
            'store' => 'medications.store',
            'edit' => 'medications.edit',
            'update' => 'medications.update',
            'destroy' => 'medications.destroy',
        ]);
});

