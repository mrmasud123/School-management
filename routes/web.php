<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\ProductController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
    return Inertia::render('test');
})->name('home');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::get('/products', [ProductController::class, 'index'])->name('products');

    // Sales & Billing
    Route::get('/sales-billing', [\App\Http\Controllers\SalesBillingController::class, 'index'])->name('sales.billing');

    // Inventory Management
    Route::get('/inventory-management', [\App\Http\Controllers\InventoryManagementController::class, 'index'])->name('inventory.management');

    // Invoice & Receipt Generation
    Route::get('/invoice-receipt', [\App\Http\Controllers\InvoiceReceiptController::class, 'index'])->name('invoice.receipt');

    // Customer Management (CRM)
    Route::get('/customer-management', [\App\Http\Controllers\CustomerManagementController::class, 'index'])->name('customer.management');

    // Employee / Staff Management
    Route::get('/employee-management', [\App\Http\Controllers\EmployeeManagementController::class, 'index'])->name('employee.management');

    // Reports & Analytics
    Route::get('/reports-analytics', [\App\Http\Controllers\ReportsAnalyticsController::class, 'index'])->name('reports.analytics');

    // Payment Integrations
    Route::get('/payment-integrations', [\App\Http\Controllers\PaymentIntegrationsController::class, 'index'])->name('payment.integrations');

    // Multi-Store / Multi-Branch Support (optional)
    Route::get('/multi-store', [\App\Http\Controllers\MultiStoreController::class, 'index'])->name('multi.store');

    // Table management (dine-in)
    Route::get('/table-management', [\App\Http\Controllers\TableManagementController::class, 'index'])->name('table.management');
});

require __DIR__.'/settings.php';
