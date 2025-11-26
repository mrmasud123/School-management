<?php

use App\Http\Controllers\Admin\StudentAdmissionController;
use App\Http\Controllers\Admin\InventoryManagementController;
use App\Http\Controllers\Admin\ParentAccountsController;
use App\Http\Controllers\Admin\SalesBillingController;
use App\Http\Controllers\Admin\StudentManagementController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\RolesController;
use App\Http\Controllers\Admin\PermissionController;
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
    Route::resource('/sales-billing', SalesBillingController::class)->names('sales.billing');
    Route::resource('/inventory-management', InventoryManagementController::class)->names('inventory.management');
    Route::resource('/student-admission', StudentAdmissionController::class)->names('admin.student.admission');
    Route::resource('/student-management', StudentManagementController::class)->names('admin.student');
    Route::resource('/parent-accounts', ParentAccountsController::class)->names('admin.parent.accounts');
    Route::get('/staff-management', [\App\Http\Controllers\Admin\StaffManagementController::class, 'index'])->name('admin.staff');
    Route::get('/id-card-printing', [\App\Http\Controllers\Admin\IDCardPrintingController::class, 'index'])->name('admin.idcard');
    Route::get('/accountants', [\App\Http\Controllers\Admin\AccountantsController::class, 'index'])->name('admin.accountants');
    Route::get('/parent-complaints', [\App\Http\Controllers\Admin\ParentComplaintsController::class, 'index'])->name('admin.parent.complaints');
    Route::get('/classes-sections', [\App\Http\Controllers\Admin\ClassesSectionsController::class, 'index'])->name('admin.classes.sections');
    Route::get('/manage-subjects', [\App\Http\Controllers\Admin\ManageSubjectsController::class, 'index'])->name('admin.subjects');
    Route::get('/manage-attendance', [\App\Http\Controllers\Admin\ManageAttendanceController::class, 'index'])->name('admin.attendance');
    Route::get('/online-classes', [\App\Http\Controllers\Admin\OnlineClassesController::class, 'index'])->name('admin.online.classes');
    Route::resource('/roles', RolesController::class)->names('admin.roles');
    Route::get('/add-permission/{id}', [RolesController::class, 'addPermissionToRole'])->name('add.permission');
    Route::post('/give-permission/{id}', [RolesController::class, 'givePermissionToRole'])->name('give.permission');
    Route::resource('/permissions', PermissionController::class)->names('admin.permissions');
    // Route::post();
    
    Route::middleware(['role:teacher'])->group(function() {
        Route::get('/test', function () {
            return "Hello Admin";
        });
    });
    
});

require __DIR__.'/settings.php';
