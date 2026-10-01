<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PatientController extends Controller
{
    // Search Patients / Duplicate Detection
    public function search(Request $request)
    {
        $query = Patient::query();

        if ($request->filled('phone')) {
            $query->where('primary_phone', $request->phone);
        }

        if ($request->filled('email')) {
            $query->where('email', $request->email);
        }

        if ($request->filled('first_name')) {
            $query->where('first_name', 'like', '%' . $request->first_name . '%');
        }

        if ($request->filled('last_name')) {
            $query->where('last_name', 'like', '%' . $request->last_name . '%');
        }

        if ($request->filled('date_of_birth')) {
            $query->where('date_of_birth', $request->date_of_birth);
        }

        $patients = $query->latest()->get();

        return response()->json([
            'message' => 'patient Search successfully.',
            'count' => $patients->count(),
            'patients' => $patients
        ]);
    }

    // Create Patient
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:100',
            'middle_name' => 'nullable|string|max:100',
            'last_name' => 'nullable|string|max:100',

            'date_of_birth' => 'nullable|date',
            'sex' => 'nullable|in:male,female,other,prefer_not_to_say',
            'blood_group' => 'nullable|string|max:10',

	    'photo' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'nationality' => 'nullable|string|max:100',
            'marital_status' => 'nullable|string|max:50',
            'occupation' => 'nullable|string|max:100',

            'primary_phone' => 'required|string|max:20',
            'alternate_phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:150',

            'address' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',

            'emergency_contact_name' => 'nullable|string|max:150',
            'emergency_contact_phone' => 'nullable|string|max:20',
            'emergency_contact_relationship' => 'nullable|string|max:50',

           'patient_type' => 'nullable|in:new,returning,referral,emergency,opd,ipd,corporate_insurance,walk_in,teleconsultation',

            'allergies' => 'nullable|string',
            'critical_alerts' => 'nullable|string',
            'infection_precautions' => 'nullable|string',
            'clinical_safety_flags' => 'nullable|string',

            'consent_given' => 'nullable|boolean',
            'communication_preferences' => 'nullable|array',

            'identifiers' => 'nullable|array',
            'custom_demographics' => 'nullable|array',

            'is_active' => 'nullable|boolean',
        ]);

        // Duplicate Patient Detection
        $duplicateQuery = Patient::query();

        if (!empty($validated['primary_phone'])) {
            $duplicateQuery->where(
                'primary_phone',
                $validated['primary_phone']
            );
        }

        if (!empty($validated['email'])) {
            $duplicateQuery->orWhere(
                'email',
                $validated['email']
            );
        }

        $duplicatePatient = $duplicateQuery->first();

        if ($duplicatePatient) {
            return response()->json([
                'message' => 'Possible duplicate patient found.',
                'duplicate_patient' => [
                    'id' => $duplicatePatient->id,
                    'patient_id' => $duplicatePatient->patient_id,
                    'first_name' => $duplicatePatient->first_name,
                    'last_name' => $duplicatePatient->last_name,
                    'primary_phone' => $duplicatePatient->primary_phone,
                    'email' => $duplicatePatient->email,
                    'date_of_birth' => $duplicatePatient->date_of_birth,
                ]
            ], 409);
        }

        // System-generated Patient ID
        $validated['patient_id'] =
            'PAT-' . strtoupper(Str::random(8));

        // Secure QR lookup token
        $validated['qr_token'] =
            Str::uuid()->toString();

	if ($request->hasFile('photo')) {
    $validated['photo'] = $request->file('photo')->store('patients', 'public');
}

        $patient = Patient::create($validated);

        return response()->json([
            'message' => 'Patient created successfully.',
            'patient' => $patient
        ], 201);
    }

    // List Patients
    public function index()
    {
        $patients = Patient::latest()->get();

        return response()->json([
            'message' => 'Patients retrieved successfully.',
            'patients' => $patients
        ]);
    }

    // View Single Patient
    public function show($id)
    {
        $patient = Patient::find($id);

        if (!$patient) {
            return response()->json([
                'message' => 'Patient not found.'
            ], 404);
        }

        return response()->json([
            'message' => 'Patient retrieved successfully.',
            'patient' => $patient
        ]);
    }

    // Update Patient
    public function update(Request $request, $id)
    {
        $patient = Patient::find($id);

        if (!$patient) {
            return response()->json([
                'message' => 'Patient not found.'
            ], 404);
        }

        $validated = $request->validate([
            'first_name' => 'sometimes|string|max:100',
            'middle_name' => 'nullable|string|max:100',
            'last_name' => 'nullable|string|max:100',

            'date_of_birth' => 'nullable|date',
            'sex' => 'nullable|in:male,female,other,prefer_not_to_say',
            'blood_group' => 'nullable|string|max:10',

            'photo' => 'nullable|string|max:255',
            'nationality' => 'nullable|string|max:100',
            'marital_status' => 'nullable|string|max:50',
            'occupation' => 'nullable|string|max:100',

            'primary_phone' => 'sometimes|string|max:20',
            'alternate_phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:150',

            'address' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',

            'emergency_contact_name' => 'nullable|string|max:150',
            'emergency_contact_phone' => 'nullable|string|max:20',
            'emergency_contact_relationship' => 'nullable|string|max:50',

            'patient_type' => 'nullable|in:new,returning,referral,emergency,opd,ipd,corporate_insurance,walk_in,teleconsultation',

            'allergies' => 'nullable|string',
            'critical_alerts' => 'nullable|string',
            'infection_precautions' => 'nullable|string',
            'clinical_safety_flags' => 'nullable|string',

            'consent_given' => 'nullable|boolean',
            'communication_preferences' => 'nullable|array',

            'identifiers' => 'nullable|array',
            'custom_demographics' => 'nullable|array',

            'is_active' => 'nullable|boolean',
        ]);

        $patient->update($validated);

        return response()->json([
            'message' => 'Patient updated successfully.',
            'patient' => $patient
        ]);
    }

    // Delete Patient
    public function destroy($id)
    {
        $patient = Patient::find($id);

        if (!$patient) {
            return response()->json([
                'message' => 'Patient not found.'
            ], 404);
        }

        $patient->delete();

        return response()->json([
            'message' => 'Patient deleted successfully.'
        ]);
    }

    // Find Patient using QR Token
    public function qrLookup($qr_token)
    {
        $patient = Patient::where(
            'qr_token',
            $qr_token
        )->first();
	 

        if (!$patient) {
            return response()->json([
                'message' => 'Invalid or expired QR token.'
            ], 404);
        }

        return response()->json([
            'message' => 'Patient found successfully.',
            'patient' => [
                'id' => $patient->id,
                'patient_id' => $patient->patient_id,
                'first_name' => $patient->first_name,
                'middle_name' => $patient->middle_name,
                'last_name' => $patient->last_name,
                'date_of_birth' => $patient->date_of_birth,
                'sex' => $patient->sex,
                'blood_group' => $patient->blood_group,
                'patient_type' => $patient->patient_type,
                'is_active' => $patient->is_active,
            ]
        ]);
    }
}