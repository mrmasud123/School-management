<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Http\Controllers\Controller;

class ManageAttendanceController extends Controller
{
    public function index(): \Inertia\Response
    {
        return Inertia::render('ManageAttendance');
    }
}