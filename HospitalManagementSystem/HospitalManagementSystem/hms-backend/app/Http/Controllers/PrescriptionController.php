<?php

namespace App\Http\Controllers;

use App\Models\Prescription;
use Illuminate\Http\Request;

class PrescriptionController extends Controller
{
    // Get all prescriptions
    public function index()
    {
        $prescriptions = Prescription::with([
            'patient',
            'doctor',
            'appointment'
        ])->get();

        return response()->json([
            'message' => 'Prescriptions retrieved successfully',
            'data' => $prescriptions
        ], 200);
    }

    // Create prescription
    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'doctor_id' => 'required|exists:users,id',
            'appointment_id' => 'nullable|exists:appointments,id',
            'medicine_name' => 'required|string|max:255',
            'dosage' => 'nullable|string|max:255',
            'frequency' => 'nullable|string|max:255',
            'duration' => 'nullable|string|max:255',
            'instructions' => 'nullable|string',
            'status' => 'nullable|in:active,completed,cancelled',
        ]);

        $prescription = Prescription::create($validated);

        return response()->json([
            'message' => 'Prescription created successfully',
            'data' => $prescription
        ], 201);
    }

    // Get single prescription
    public function show($id)
    {
        $prescription = Prescription::with([
            'patient',
            'doctor',
            'appointment'
        ])->findOrFail($id);

        return response()->json([
            'message' => 'Prescription retrieved successfully',
            'data' => $prescription
        ], 200);
    }

    // Update prescription
    public function update(Request $request, $id)
    {
        $prescription = Prescription::findOrFail($id);

        $validated = $request->validate([
            'patient_id' => 'sometimes|required|exists:patients,id',
            'doctor_id' => 'sometimes|required|exists:users,id',
            'appointment_id' => 'nullable|exists:appointments,id',
            'medicine_name' => 'sometimes|required|string|max:255',
            'dosage' => 'nullable|string|max:255',
            'frequency' => 'nullable|string|max:255',
            'duration' => 'nullable|string|max:255',
            'instructions' => 'nullable|string',
            'status' => 'nullable|in:active,completed,cancelled',
        ]);

        $prescription->update($validated);

        return response()->json([
            'message' => 'Prescription updated successfully',
            'data' => $prescription
        ], 200);
    }

    // Delete prescription
    public function destroy($id)
    {
        $prescription = Prescription::findOrFail($id);

        $prescription->delete();

        return response()->json([
            'message' => 'Prescription deleted successfully'
        ], 200);
    }
}