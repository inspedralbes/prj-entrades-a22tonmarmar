<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Borra cualquier usuario existente para garantizar que solo hay un admin
        User::truncate();

        User::create([
            'name' => 'Admin',
            'email' => env('ADMIN_EMAIL', 'admin@bingus.com'),
            'password' => Hash::make(env('ADMIN_PASSWORD', 'B!ngU5_1oV3r!ñç')),
        ]);
    }
}
