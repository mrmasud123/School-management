<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Http\Controllers\Controller;

class ClassesSectionsController extends Controller
{
    public function index(): \Inertia\Response
    {
        return Inertia::render('ClassesSections');
    }
}