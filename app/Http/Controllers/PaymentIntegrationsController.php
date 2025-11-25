<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PaymentIntegrationsController extends Controller
{
    public function index(): \Inertia\Response
    {
        return \Inertia\Inertia::render('PaymentIntegrations');
    }
}
