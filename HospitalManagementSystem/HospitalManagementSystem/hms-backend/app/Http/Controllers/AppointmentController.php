<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    // Get all appointments
    public function index()
    {
        $appointments = Appointment::with([
            'patient',
            'doctor'
        ])->get();

        return response()->json([
            'message' => 'Appointments retrieved successfully',
            'data' => $appointments
        ], 200);
    }

    // Create appointment
    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'doctor_id' => 'required|exists:users,id',
            'appointment_date' => 'required|date',
            'appointment_time' => 'required',
            'appointment_type' => 'nullable|string|max:255',
            'status' => 'nullable|in:scheduled,confirmed,completed,cancelled,no_show',
            'reason' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $appointment = Appointment::create($validated);

        return response()->json([
            'message' => 'Appointment created successfully',
            'data' => $appointment
        ], 201);
    }

    // Get appointment by ID
    public function show($id)
    {
        $appointment = Appointment::with([
            'patient',
            'doctor'
        ])->findOrFail($id);

        return response()->json([
            'message' => 'Appointment retrieved successfully',
            'data' => $appointment
        ], 200);
    }

    // Update appointment
    public function update(Request $request, $id)
    {
        $appointment = Appointment::findOrFail($id);

        $validated = $request->validate([
            'patient_id' => 'sometimes|required|exists:patients,id',
            'doctor_id' => 'sometimes|required|exists:users,id',
            'appointment_date' => 'sometimes|required|date',
            'appointment_time' => 'sometimes|required',
            'appointment_type' => 'nullable|string|max:255',
            'status' => 'nullable|in:scheduled,confirmed,completed,cancelled,no_show',
            'reason' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $appointment->update($validated);

        return response()->json([
            'message' => 'Appointment updated successfully',
            'data' => $appointment
        ], 200);
    }

    // Delete appointment
    public function destroy($id)
    {
        $appointment = Appointment::findOrFail($id);

        $appointment->delete();

        return response()->json([
            'message' => 'Appointment deleted successfully'
        ], 200);
    }
}