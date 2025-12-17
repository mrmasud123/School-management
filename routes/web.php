<?php

use App\Http\Controllers\Admin\StudentController;
use App\Http\Controllers\Admin\InventoryManagementController;
use App\Http\Controllers\Admin\ParentAccountsController;
use App\Http\Controllers\Admin\SalesBillingController;
use App\Http\Controllers\Admin\StudentManagementController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\RolesController;
use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\SectionController;
use App\Http\Controllers\Admin\StudentClassController;
use App\Http\Controllers\Admin\UserController;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\ProductController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/students/idcard/{id}', [\App\Http\Controllers\Admin\IDCardPrintingController::class, 'generateIdCard'])
        ->name('students.idcard');

    Route::get('/products', [ProductController::class, 'index'])->name('products');
    Route::resource('/sales-billing', SalesBillingController::class)->names('sales.billing');
    Route::resource('/inventory-management', InventoryManagementController::class)->names('inventory.management');
    Route::resource('/students', StudentController::class)->names('admin.students');
    Route::get('/trashed-students', [StudentController::class, 'trashed'])->name('trashed.students');
    Route::patch('/{id}/restore', [StudentController::class, 'restore'])
        ->name('students.restore');

    Route::delete('/{id}/force', [StudentController::class, 'forceDelete'])
        ->name('students.forceDelete');

    Route::get('/migrate', [StudentController::class, 'migrate'])->name('admin.students.migrate');
    Route::post('/migrate', [StudentController::class, 'migrateStudent'])->name('admin.students.migrate');
    Route::resource('/classes', StudentClassController::class)->names('admin.classes');
    Route::get('/classes/class-wise-students/{classId}', [StudentClassController::class,'classWiseStudents'])->name('class.wise.students');

    Route::resource('/sections', SectionController::class)->names('admin.sections');
    Route::get('/fetch-sections-student-admission/{classId}', [SectionController::class, 'fetchSections'])->name('fetch.sections');
    Route::get('/sections/section-wise-students/{sectionId}', [SectionController::class,'sectionWiseStudents'])->name('section.wise.students');

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

    Route::resource('/users', UserController::class)->names('admin.users');

    // Route::post();

    Route::middleware(['role:teacher'])->group(function() {
        Route::get('/test', function () {
            return "Hello Admin";
        });
    });

});

require __DIR__.'/settings.php';
