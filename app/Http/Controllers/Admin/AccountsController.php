<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Http\Controllers\Controller;

class AccountsController extends Controller
{
    public function index(): \Inertia\Response
    {
        return Inertia::render('Accountants');
    }
}