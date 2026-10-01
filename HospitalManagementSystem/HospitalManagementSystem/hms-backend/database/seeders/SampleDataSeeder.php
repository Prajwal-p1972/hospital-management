<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use App\Models\Doctor;
use App\Models\Patient;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class SampleDataSeeder extends Seeder
{
    public function run(): void
    {
        $doctorRole = Role::where('name', 'doctor')->first();

        // 1. Seed Doctor Users and Profiles
        $doc1User = User::updateOrCreate(
            ['email' => 'doctor@hospital.com'],
            [
                'name' => 'Dr. Gregory House',
                'password' => Hash::make('password123'),
                'role_id' => $doctorRole?->id,
                'email_verified_at' => now(),
            ]
        );

        Doctor::updateOrCreate(
            ['user_id' => $doc1User->id],
            [
                'doctor_code' => 'DOC-001',
                'registration_number' => 'REG-10492',
                'first_name' => 'Gregory',
                'last_name' => 'House',
                'department' => 'Cardiology',
                'specialization' => 'Diagnostic Cardiology & Critical Care',
                'qualification' => 'MD, FACC',
                'experience_years' => 15,
                'phone' => '+15551234567',
                'email' => 'doctor@hospital.com',
                'consultation_fee' => 150.00,
                'status' => 'active',
                'bio' => 'Senior diagnostic specialist with expertise in complex cardiovascular conditions.',
            ]
        );

        $doc2User = User::updateOrCreate(
            ['email' => 'sarah.connor@hospital.com'],
            [
                'name' => 'Dr. Sarah Connor',
                'password' => Hash::make('password123'),
                'role_id' => $doctorRole?->id,
                'email_verified_at' => now(),
            ]
        );

        Doctor::updateOrCreate(
            ['user_id' => $doc2User->id],
            [
                'doctor_code' => 'DOC-002',
                'registration_number' => 'REG-20581',
                'first_name' => 'Sarah',
                'last_name' => 'Connor',
                'department' => 'Neurology',
                'specialization' => 'Neurovascular Surgery',
                'qualification' => 'MBBS, MS, MCh (Neurosurgery)',
                'experience_years' => 12,
                'phone' => '+15559876543',
                'email' => 'sarah.connor@hospital.com',
                'consultation_fee' => 175.00,
                'status' => 'active',
                'bio' => 'Lead neurosurgeon specializing in minimally invasive brain and spinal procedures.',
            ]
        );

        // 2. Seed Nurse, Receptionist, and Pharmacist Staff Users
        $nurseRole = Role::where('name', 'nurse')->first();
        User::updateOrCreate(
            ['email' => 'nurse@hospital.com'],
            [
                'name' => 'Nurse Clara Barton',
                'password' => Hash::make('password123'),
                'role_id' => $nurseRole?->id,
                'email_verified_at' => now(),
            ]
        );

        $receptionistRole = Role::where('name', 'receptionist')->first();
        User::updateOrCreate(
            ['email' => 'receptionist@hospital.com'],
            [
                'name' => 'Reception Desk',
                'password' => Hash::make('password123'),
                'role_id' => $receptionistRole?->id,
                'email_verified_at' => now(),
            ]
        );

        $pharmacistRole = Role::where('name', 'pharmacist')->first();
        User::updateOrCreate(
            ['email' => 'pharmacist@hospital.com'],
            [
                'name' => 'Chief Pharmacist',
                'password' => Hash::make('password123'),
                'role_id' => $pharmacistRole?->id,
                'email_verified_at' => now(),
            ]
        );

        // 3. Seed Sample Patients
        $patients = [
            [
                'patient_id' => 'MRN-2026-0001',
                'qr_token' => (string) Str::uuid(),
                'first_name' => 'Eleanor',
                'last_name' => 'Vance',
                'date_of_birth' => '1988-04-12',
                'sex' => 'female',
                'blood_group' => 'O+',
                'nationality' => 'American',
                'primary_phone' => '5552345678',
                'email' => 'eleanor.vance@example.com',
                'address' => '742 Evergreen Terrace',
                'city' => 'Springfield',
                'state' => 'OR',
                'country' => 'USA',
                'postal_code' => '97477',
                'patient_type' => 'opd',
                'is_active' => true,
                'consent_given' => true,
            ],
            [
                'patient_id' => 'MRN-2026-0002',
                'qr_token' => (string) Str::uuid(),
                'first_name' => 'Robert',
                'last_name' => 'Langdon',
                'date_of_birth' => '1975-09-22',
                'sex' => 'male',
                'blood_group' => 'A+',
                'nationality' => 'American',
                'primary_phone' => '5553456789',
                'email' => 'robert.langdon@example.com',
                'address' => '12 Harvard Square',
                'city' => 'Cambridge',
                'state' => 'MA',
                'country' => 'USA',
                'postal_code' => '02138',
                'patient_type' => 'ipd',
                'is_active' => true,
                'consent_given' => true,
            ],
            [
                'patient_id' => 'MRN-2026-0003',
                'qr_token' => (string) Str::uuid(),
                'first_name' => 'Clara',
                'last_name' => 'Oswald',
                'date_of_birth' => '1992-11-23',
                'sex' => 'female',
                'blood_group' => 'B-',
                'nationality' => 'British',
                'primary_phone' => '5554567890',
                'email' => 'clara.oswald@example.com',
                'address' => '42 Baker Street',
                'city' => 'London',
                'state' => 'Greater London',
                'country' => 'UK',
                'postal_code' => 'NW1 6XE',
                'patient_type' => 'new',
                'is_active' => true,
                'consent_given' => true,
            ]
        ];

        foreach ($patients as $p) {
            Patient::updateOrCreate(
                ['patient_id' => $p['patient_id']],
                $p
            );
        }
    }
}
