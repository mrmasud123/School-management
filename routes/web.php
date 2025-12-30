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
use App\Http\Controllers\Admin\SubjectsController;
use App\Http\Controllers\Admin\StudentDetailsController;
use App\Http\Controllers\Admin\TeachersController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/students/idcard/{id}', [\App\Http\Controllers\Admin\StudentDetailsController::class, 'generateIdCard'])
        ->name('students.idcard');

    Route::get('/products', [ProductController::class, 'index'])->name('products');
    Route::resource('/sales-billing', SalesBillingController::class)->names('sales.billing');
    Route::resource('/inventory-management', InventoryManagementController::class)->names('inventory.management');
    Route::put('/students/{student}/status', [StudentController::class, 'updateStatus'])->name('students.update.status');
    Route::get('/students/export/excel', [StudentController::class, 'export'])->name('students.export.excel');
    Route::get('/students/export/pdf', [StudentController::class, 'exportPdf'])->name('students.export.pdf');
    Route::resource('/students', StudentController::class)->names('admin.students');
    
    Route::get('/trashed-students', [StudentController::class, 'trashed'])->name('trashed.students');
    Route::patch('/students/{id}/restore', [StudentController::class, 'restore'])
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
    Route::get('/sections-wise-subjects/{sectionId}', [SubjectsController::class, 'sectionsWiseSubjects'])->name('sections.wise.subjects');
    Route::delete('/subject-mapping/{sectionId}/{subjectId}', [SubjectsController::class, 'subjectMapping'])->name('subject.mapping');

    Route::get('/subjects/assign', [SubjectsController::class, 'assignSubject'])->name('admin.subjects.assign');
    Route::post('/subject-mapping', [SubjectsController::class, 'mapSubject'])->name('admin.subjects.mapping');
    Route::resource('/subjects', SubjectsController::class)->names('admin.subjects');

    Route::resource('/student-management', StudentManagementController::class)->names('admin.student');
    
    Route::get('/parent-accounts/student-parent-mapping/{parentId}', [ParentAccountsController::class, 'mapping'])->name('admin.parents.accounts.mapping');
    Route::post('/parent-student-mapping', [ParentAccountsController::class, 'parentStudentMapping'])->name('admin.parents.student.mapping');
    Route::resource('/parent-accounts', ParentAccountsController::class)->names('admin.parent.accounts');
    Route::get('/admin/remove-parent-student-mapping/{parentId}/{studentId}', [ParentAccountsController::class, 'removeMapping'])->name('admin.parents.accounts.remove');
    Route::get('/staff-management', [\App\Http\Controllers\Admin\StaffManagementController::class, 'index'])->name('admin.staff');

    Route::get('/student-details', [StudentDetailsController::class, 'index'])->name('admin.idcard');
    Route::get('/fetch-students/{sectionId}', [StudentDetailsController::class, 'fetchStudents'])->name('fetch.students');
    Route::get('/student-all-details/{studentId}', [StudentDetailsController::class, 'studentAllDetails'])->name('student.all.details');
    
    Route::get('/accountants', [\App\Http\Controllers\Admin\AccountantsController::class, 'index'])->name('admin.accountants');
    Route::get('/parent-complaints', [\App\Http\Controllers\Admin\ParentComplaintsController::class, 'index'])->name('admin.parent.complaints');
    Route::get('/classes-sections', [\App\Http\Controllers\Admin\ClassesSectionsController::class, 'index'])->name('admin.classes.sections');

    Route::get('/manage-attendance', [\App\Http\Controllers\Admin\ManageAttendanceController::class, 'index'])->name('admin.attendance');
    Route::get('/online-classes', [\App\Http\Controllers\Admin\OnlineClassesController::class, 'index'])->name('admin.online.classes');
    Route::resource('/roles', RolesController::class)->names('admin.roles');
    Route::get('/add-permission/{id}', [RolesController::class, 'addPermissionToRole'])->name('add.permission');
    Route::post('/give-permission/{id}', [RolesController::class, 'givePermissionToRole'])->name('give.permission');
    Route::resource('/permissions', PermissionController::class)->names('admin.permissions');

    Route::resource('/users', UserController::class)->names('admin.users');

    
    //Teachers
    Route::post('/teachers/{teacher}', [TeachersController::class, 'update']);

    Route::get('/teachers/trashed-teachers', [TeachersController::class, 'trashed'])->name('trashed.teachers');
    Route::resource('/teachers', TeachersController::class)->names('admin.teachers');
    Route::patch('/{id}/restore', [TeachersController::class, 'restore'])
    ->name('teachers.restore');
    // Route::post();

    Route::middleware(['role:teacher'])->group(function() {
        Route::get('/test', function () {
            return "Hello Admin";
        });
    });

});

require __DIR__.'/settings.php';
