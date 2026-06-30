<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function markAsRead($id)
    {
        $notification = Auth::user()
            ->notifications()
            ->where('id', $id)
            ->first();

        if ($notification) {
            $notification->markAsRead();
        }

        return back();
    }

    public function markAllAsRead()
    {
        Auth::user()
            ->unreadNotifications
            ->markAsRead();

        return back();
    }
}
