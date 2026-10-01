<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole = \App\Models\Role::where('name', 'admin')->first();

        $admin = User::updateOrCreate(
            ['email' => 'admin@hospital.com'],
            [
                'name' => 'System Admin',
                'password' => Hash::make('password123'),
                'role_id' => $adminRole?->id,
                'email_verified_at' => now(),
            ]
        );
    }
}
