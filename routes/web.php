<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Customer\PrescriptionController;
use App\Http\Controllers\Pharmacist\PharmacistPrescriptionController;
use App\Http\Controllers\Pharmacist\PharmacistReportController;
use App\Http\Controllers\Pharmacist\PharmacistStockController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\Manager\ActiveIngredientController; // Add this line
use App\Http\Controllers\Manager\DosageFormController; // Add this line
use App\Http\Controllers\Customer\CustomerDashboardController;
use App\Http\Controllers\Manager\PharmacyController;
use App\Http\Controllers\Manager\PharmacistController;
use App\Http\Controllers\Api\AllergyCheckController; // Add this line

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

// routes/web.php








Route::middleware(['auth', 'role:pharmacist', 'pharmacist.onboarding'])->prefix('pharmacist')->name('pharmacist.')->group(function () {
    // Consolidated Dashboard Route
    Route::get('/dashboard', [PharmacistPrescriptionController::class, 'dashboard'])->name('dashboard');


    // Prescription Routes
    Route::get('/prescriptions', [PharmacistPrescriptionController::class, 'index'])->name('prescriptions.index');
    
    // Manual Prescription Creation Routes (MUST be before general create route)
    Route::get('/prescriptions/create-manual', [PharmacistPrescriptionController::class, 'createManual'])->name('prescriptions.createManual');
    Route::post('/prescriptions/create-manual', [PharmacistPrescriptionController::class, 'storeManual'])->name('prescriptions.storeManual');
    
    // Manual Prescription Management Routes
    Route::get('/prescriptions/manual/{prescription}/edit', [PharmacistPrescriptionController::class, 'editManual'])->name('prescriptions.manual.edit');
    Route::put('/prescriptions/manual/{prescription}', [PharmacistPrescriptionController::class, 'updateManual'])->name('prescriptions.manual.update');
    Route::delete('/prescriptions/manual/{prescription}', [PharmacistPrescriptionController::class, 'destroyManual'])->name('prescriptions.manual.destroy');
    Route::get('/prescriptions/manual/{prescription}/generate-pdf', [PharmacistPrescriptionController::class, 'generatePdf'])->name('prescriptions.manual.generatePdf');
    
    Route::get('/prescriptions/load/{prescription}', [PharmacistPrescriptionController::class, 'load'])->name('prescriptions.load');
    Route::get('/prescriptions/create/{prescription}', [PharmacistPrescriptionController::class, 'create'])->name('prescriptions.create');
    Route::post('/prescriptions', [PharmacistPrescriptionController::class, 'store'])->name('prescriptions.store');
    Route::delete('/prescriptions/{prescription}', [PharmacistPrescriptionController::class, 'destroy'])->name('prescriptions.destroy');

    // Dispense Routes
    Route::get('/prescriptions/dispense', [PharmacistPrescriptionController::class, 'dispenseIndex'])->name('prescriptions.dispense');
    Route::get('/prescriptions/dispense/{prescription}', [PharmacistPrescriptionController::class, 'dispenseShow'])->name('prescriptions.dispense.show');
    Route::post('/prescriptions/dispense', [PharmacistPrescriptionController::class, 'dispenseStore'])->name('prescriptions.dispense.store');

    // **CHANGE 1: This route was causing the 405 error.**
    // **Change method from POST to PUT and point to 'storeLoaded'.**
    Route::put('/prescriptions/{prescription}/load-action', [PharmacistPrescriptionController::class, 'storeLoaded'])
        ->name('prescriptions.loadAction'); // Frontend sends PUT to this URL

    // **Note:** The route below is likely redundant or conflicting with the above 'loadAction' if both are for the same "approve/load" functionality.
    // If 'prescriptions.storeLoaded' is not used elsewhere for a distinct purpose, you might consider removing it.
    // I'm commenting it out for now to ensure no conflicts with the 'loadAction' fix.
    // Route::post('/prescriptions/load/{id}', [PharmacistPrescriptionController::class, 'storeLoaded'])
    //     ->name('prescriptions.storeLoaded');

    // This 'update' route seems separate from the 'load-action' for now, so keeping it as is.
    Route::post('/prescriptions/update/{prescription}', [PharmacistPrescriptionController::class, 'update'])
        ->name('prescriptions.update');

    Route::get('/prescriptions/{prescription}', [PharmacistPrescriptionController::class, 'showPrescription'])
        ->name('prescriptions.show');
    
    Route::get('/prescriptions/{prescription}/download', [PharmacistPrescriptionController::class, 'downloadPrescription'])
        ->name('prescriptions.download');

    // Doctor Routes (if needed)
    Route::post('/doctors', [DoctorController::class, 'store'])->name('doctors.store');

    // Customer Creation Routes for walk-in patients
    Route::get('/customers/create', [PharmacistPrescriptionController::class, 'createCustomer'])->name('customers.create');
    Route::post('/customers', [PharmacistPrescriptionController::class, 'storeCustomer'])->name('customers.store');

    // Other Pharmacist Routes
    Route::get('/repeats', fn () => Inertia::render('Pharmacist/Repeats'))->name('repeats');
    Route::get('/stock', [PharmacistStockController::class, 'index'])->name('stock');
    
    // Reports Routes
    Route::get('/reports', [PharmacistReportController::class, 'index'])->name('reports');
    Route::get('/reports/dispensed', [PharmacistReportController::class, 'dispensedForm'])->name('reports.dispensed');
    Route::get('/reports/dispensed/pdf', [PharmacistReportController::class, 'dispensedPdf'])->name('reports.dispensed-pdf');
    Route::get('/reports/{report}/download', [PharmacistReportController::class, 'downloadReport'])->name('reports.download');
    Route::delete('/reports/{report}', [PharmacistReportController::class, 'deleteReport'])->name('reports.delete');
});

Route::middleware(['auth', 'role:customer'])->group(function () {
    Route::get('/customer/dashboard', [CustomerDashboardController::class, 'index'])->name('customer.dashboard');
    //Route::get('/customer/dashboard', fn () => Inertia::render('Customer/Dashboard'));
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

Route::middleware(['auth', 'role:manager'])->group(function () {
    // Pharmacy Management (for Managers)
    Route::get('/manager/pharmacies', [PharmacyController::class, 'index'])->name('manager.pharmacies.index'); // List all managed pharmacies
    Route::get('/manager/pharmacies/create', [PharmacyController::class, 'create'])->name('manager.pharmacies.create'); // Form to add new pharmacy
    Route::post('/manager/pharmacies', [PharmacyController::class, 'store'])->name('manager.pharmacies.store'); // Store new pharmacy
     // NEW: Routes for editing/updating an existing pharmacy
    Route::get('/manager/pharmacies/{pharmacy}/edit', [PharmacyController::class, 'edit'])->name('manager.pharmacies.edit'); // Displays the edit form
    Route::put('/manager/pharmacies/{pharmacy}', [PharmacyController::class, 'update'])->name('manager.pharmacies.update'); // Handles the form submission

     Route::resource('manager/active-ingredients', ActiveIngredientController::class)
        ->names('manager.activeIngredients') // Customizes the route names (e.g., manager.activeIngredients.index)
        ->except(['show']);

        Route::resource('manager/dosage-forms', DosageFormController::class)
        ->names('manager.dosageForms') // Customizes the route names (e.g., manager.dosageForms.index)
        ->except(['show']); 

        // Pharmacist Management (for Managers)
    Route::resource('manager/pharmacists', PharmacistController::class)
        ->names('manager.pharmacists')
        ->except(['show']);
    // Add routes for editing and deleting individual pharmacies if needed later
    // Route::get('/manager/pharmacies/{pharmacy}/edit', [PharmacyController::class, 'edit'])->name('manager.pharmacies.edit');
    // Route::put('/manager/pharmacies/{pharmacy}', [PharmacyController::class, 'update'])->name('manager.pharmacies.update');
    // Route::delete('/manager/pharmacies/{pharmacy}', [PharmacyController::class, 'destroy'])->name('manager.pharmacies.destroy');
});

// API Routes for Allergy Checking (accessible to pharmacists and managers)
Route::middleware(['auth'])->prefix('api')->name('api.')->group(function () {
    Route::post('/check-medication-allergy', [AllergyCheckController::class, 'checkMedicationAllergy'])->name('check.medication.allergy');
    Route::get('/user-allergies/{user_id}', [AllergyCheckController::class, 'getUserAllergies'])->name('user.allergies');
    Route::get('/medication-ingredients/{medication_id}', [AllergyCheckController::class, 'getMedicationIngredients'])->name('medication.ingredients');
    
    // Pharmacist API Routes
    Route::middleware(['role:pharmacist'])->prefix('pharmacist')->group(function () {
        Route::get('/requested-repeats', [PharmacistPrescriptionController::class, 'getRequestedRepeats'])->name('pharmacist.requested.repeats');
        Route::post('/repeats/{prescription}/dispense', [PharmacistPrescriptionController::class, 'dispenseRepeat'])->name('pharmacist.dispense.repeat');
        Route::post('/repeats/{prescription}/reject', [PharmacistPrescriptionController::class, 'rejectRepeat'])->name('pharmacist.reject.repeat');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
