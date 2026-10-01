<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\PatientEncounter;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PatientEncounterController extends Controller
{
    // Create a new patient encounter
    public function store(Request $request, $patientId)
    {
        $patient = Patient::find($patientId);

        if (!$patient) {
            return response()->json([
                'message' => 'Patient not found.'
            ], 404);
        }

        $validated = $request->validate([
            'encounter_type' => 'required|in:opd,ipd,emergency,teleconsultation,follow_up',
            'encounter_date' => 'required|date',
            'doctor_id' => 'nullable|exists:users,id',
            'chief_complaint' => 'nullable|string',
            'diagnosis' => 'nullable|string',
            'treatment' => 'nullable|string',
            'notes' => 'nullable|string',
            'status' => 'nullable|in:scheduled,in_progress,completed,cancelled',
        ]);

        $validated['patient_id'] = $patient->id;

        // Generate unique Encounter ID
        $validated['encounter_id'] = 'ENC-' . strtoupper(Str::random(8));

        $encounter = PatientEncounter::create($validated);

        return response()->json([
            'message' => 'Patient encounter created successfully.',
            'encounter' => $encounter
        ], 201);
    }

    // Get all encounters of a patient
    public function index($patientId)
    {
        $patient = Patient::find($patientId);

        if (!$patient) {
            return response()->json([
                'message' => 'Patient not found.'
            ], 404);
        }

        $encounters = PatientEncounter::where('patient_id', $patientId)
            ->with('doctor:id,name,email')
            ->orderBy('encounter_date', 'desc')
            ->get();

        return response()->json([
            'message' => 'Patient encounter history retrieved successfully.',
            'patient' => [
                'id' => $patient->id,
                'patient_id' => $patient->patient_id,
                'name' => trim(
                    $patient->first_name . ' ' .
                    ($patient->middle_name ?? '') . ' ' .
                    ($patient->last_name ?? '')
                ),
            ],
            'encounters' => $encounters
        ]);
    }

    // Get one encounter
    public function show($patientId, $encounterId)
    {
        $encounter = PatientEncounter::where('patient_id', $patientId)
            ->where('id', $encounterId)
            ->with('doctor:id,name,email')
            ->first();

        if (!$encounter) {
            return response()->json([
                'message' => 'Encounter not found.'
            ], 404);
        }

        return response()->json([
            'message' => 'Encounter retrieved successfully.',
            'encounter' => $encounter
        ]);
    }

    // Update encounter
    public function update(Request $request, $patientId, $encounterId)
    {
        $encounter = PatientEncounter::where('patient_id', $patientId)
            ->where('id', $encounterId)
            ->first();

        if (!$encounter) {
            return response()->json([
                'message' => 'Encounter not found.'
            ], 404);
        }

        $validated = $request->validate([
            'encounter_type' => 'sometimes|in:opd,ipd,emergency,teleconsultation,follow_up',
            'encounter_date' => 'sometimes|date',
            'doctor_id' => 'nullable|exists:users,id',
            'chief_complaint' => 'nullable|string',
            'diagnosis' => 'nullable|string',
            'treatment' => 'nullable|string',
            'notes' => 'nullable|string',
            'status' => 'sometimes|in:scheduled,in_progress,completed,cancelled',
        ]);

        $encounter->update($validated);

        return response()->json([
            'message' => 'Encounter updated successfully.',
            'encounter' => $encounter
        ]);
    }

    // Delete encounter
    public function destroy($patientId, $encounterId)
    {
        $encounter = PatientEncounter::where('patient_id', $patientId)
            ->where('id', $encounterId)
            ->first();

        if (!$encounter) {
            return response()->json([
                'message' => 'Encounter not found.'
            ], 404);
        }

        $encounter->delete();

        return response()->json([
            'message' => 'Encounter deleted successfully.'
        ]);
    }
}