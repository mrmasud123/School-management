<?php

namespace App\Providers;

use Auth;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class TestProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        Inertia::share([
            'auth' => function () {
                $user = Auth::user();

                if (!$user) {
                    return null;
                }
 
                $user->load('roles.permissions');

                return [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                    ],
                    'roles' => $user->getRoleNames(),
                    'permissions' => $user
                        ->getAllPermissions()
                        ->pluck('name')
                        ->values(),
                ];
            },
        ]);
    }
}
