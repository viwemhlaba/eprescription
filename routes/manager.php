<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\StockController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\Manager\ManagerDashboardController;
use App\Http\Controllers\Manager\LowStockController;

Route::middleware(['auth', 'role:manager'])->prefix('manager')->name('manager.')->group(function () {
    // Dashboard
    Route::get('/dashboard', [ManagerDashboardController::class, 'index'])->name('dashboard');

    // Debug route for testing (temporary)
    Route::get('/reports/stock-debug', function(\Illuminate\Http\Request $request) {
        return response()->json([
            'message' => 'Debug endpoint reached',
            'params' => $request->all(),
            'validation_test' => [
                'group_by_valid' => in_array($request->get('group_by'), ['dosage_form', 'schedule', 'supplier']),
                'stock_filter_valid' => in_array($request->get('stock_filter'), ['all', 'low_stock', 'out_of_stock']),
                'sort_by_valid' => in_array($request->get('sort_by'), ['name', 'quantity_on_hand', 'reorder_level']),
                'sort_direction_valid' => in_array($request->get('sort_direction'), ['asc', 'desc']),
                'include_zero_stock_valid' => in_array($request->get('include_zero_stock'), ['true', 'false', '1', '0', null]),
            ]
        ]);
    })->name('reports.stock.debug');

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

    // Low Stock Management
    Route::get('/low-stock', [LowStockController::class, 'index'])->name('low-stock.index');

    // Reports
    Route::get('/reports', fn () => Inertia::render('Manager/Reports/Index'))->name('reports.index');
    Route::get('/reports/stock', [\App\Http\Controllers\Manager\StockReportController::class, 'index'])->name('reports.stock');
    Route::get('/reports/stock-pdf', [\App\Http\Controllers\Manager\StockReportController::class, 'generatePdf'])->name('reports.stock.generate');
    Route::get('/reports/stock/download/{report}', [\App\Http\Controllers\Manager\StockReportController::class, 'download'])->name('reports.stock.download');

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

    // Doctors CRUD (resource routes)
    Route::resource('doctors', App\Http\Controllers\DoctorController::class)
        ->except(['show'])
        ->names([
            'index' => 'doctors.index',
            'create' => 'doctors.create',
            'store' => 'doctors.store',
            'edit' => 'doctors.edit',
            'update' => 'doctors.update',
            'destroy' => 'doctors.destroy',
        ]);
});

