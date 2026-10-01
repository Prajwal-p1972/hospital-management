<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            [
                'name' => 'admin',
                'display_name' => 'Administrator',
                'description' => 'Full system administration access',
                'is_active' => true,
            ],
            [
                'name' => 'doctor',
                'display_name' => 'Doctor',
                'description' => 'Doctor and clinical workflow access',
                'is_active' => true,
            ],
            [
                'name' => 'nurse',
                'display_name' => 'Nurse',
                'description' => 'Nursing and patient care access',
                'is_active' => true,
            ],
            [
                'name' => 'receptionist',
                'display_name' => 'Receptionist',
                'description' => 'Patient registration and appointment access',
                'is_active' => true,
            ],
            [
                'name' => 'pharmacist',
                'display_name' => 'Pharmacist',
                'description' => 'Pharmacy and medication management access',
                'is_active' => true,
            ],
            [
                'name' => 'lab_technician',
                'display_name' => 'Lab Technician',
                'description' => 'Laboratory workflow and test result access',
                'is_active' => true,
            ],
            [
                'name' => 'radiologist',
                'display_name' => 'Radiologist',
                'description' => 'Radiology and imaging workflow access',
                'is_active' => true,
            ],
            [
                'name' => 'billing_staff',
                'display_name' => 'Billing Staff',
                'description' => 'Billing, payment and financial workflow access',
                'is_active' => true,
            ],
        ];

        foreach ($roles as $role) {
            Role::updateOrCreate(
                ['name' => $role['name']],
                $role
            );
        }
    }
}