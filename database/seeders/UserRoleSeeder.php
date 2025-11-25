<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UserRoleSeeder extends Seeder
{
    public function run()
    {
        $user = User::first(); 
        if ($user) {
            $user->assignRole('admin');
            $this->command->info("User {$user->email} assigned role admin");
        }
    }
}
