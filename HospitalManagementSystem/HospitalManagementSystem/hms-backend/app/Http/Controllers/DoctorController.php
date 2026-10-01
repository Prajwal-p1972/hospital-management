<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DoctorController extends Controller
{
    /**
     * Create a new doctor profile.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id|unique:doctors,user_id',
            'doctor_code' => 'required|string|max:50|unique:doctors,doctor_code',
            'registration_number' => 'nullable|string|max:100|unique:doctors,registration_number',

            'first_name' => 'required|string|max:100',
            'last_name' => 'nullable|string|max:100',

            'department' => 'nullable|string|max:100',
            'specialization' => 'nullable|string|max:150',
            'qualification' => 'nullable|string|max:255',
            'experience_years' => 'nullable|integer|min:0|max:100',

            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',

            'consultation_fee' => 'nullable|numeric|min:0',
            'status' => 'nullable|in:active,inactive,on_leave',
            'bio' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $doctor = Doctor::create([
            'user_id' => $request->user_id,
            'doctor_code' => $request->doctor_code,
            'registration_number' => $request->registration_number,

            'first_name' => $request->first_name,
            'last_name' => $request->last_name,

            'department' => $request->department,
            'specialization' => $request->specialization,
            'qualification' => $request->qualification,
            'experience_years' => $request->experience_years,

            'phone' => $request->phone,
            'email' => $request->email,

            'consultation_fee' => $request->consultation_fee,
            'status' => $request->status ?? 'active',
            'bio' => $request->bio,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Doctor created successfully.',
            'data' => $doctor->load('user'),
        ], 201);
    }

/**
 * Get all doctors.
 */
public function index()
{
    $doctors = Doctor::with('user')->get();

    return response()->json([
        'success' => true,
        'message' => 'Doctors fetched successfully.',
        'data' => $doctors,
    ]);
}

/**
 * Get a single doctor.
 */
public function show($id)
{
    $doctor = Doctor::with('user')->findOrFail($id);

    return response()->json([
        'success' => true,
        'message' => 'Doctor fetched successfully.',
        'data' => $doctor,
    ]);
}

/**
 * Update doctor.
 */
public function update(Request $request, $id)
{
    $doctor = Doctor::findOrFail($id);

    $validator = Validator::make($request->all(), [
        'doctor_code' => 'sometimes|required|string|max:50|unique:doctors,doctor_code,' . $id,
        'registration_number' => 'nullable|string|max:100|unique:doctors,registration_number,' . $id,

        'first_name' => 'sometimes|required|string|max:100',
        'last_name' => 'nullable|string|max:100',

        'department' => 'nullable|string|max:100',
        'specialization' => 'nullable|string|max:150',
        'qualification' => 'nullable|string|max:255',
        'experience_years' => 'nullable|integer|min:0|max:100',

        'phone' => 'nullable|string|max:20',
        'email' => 'nullable|email|max:255',

        'consultation_fee' => 'nullable|numeric|min:0',
        'status' => 'nullable|in:active,inactive,on_leave',
        'bio' => 'nullable|string',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'message' => 'Validation failed.',
            'errors' => $validator->errors(),
        ], 422);
    }

    $doctor->update($request->only([
        'doctor_code',
        'registration_number',
        'first_name',
        'last_name',
        'department',
        'specialization',
        'qualification',
        'experience_years',
        'phone',
        'email',
        'consultation_fee',
        'status',
        'bio',
    ]));

    return response()->json([
        'success' => true,
        'message' => 'Doctor updated successfully.',
        'data' => $doctor->load('user'),
    ]);
}

/**
 * Delete doctor.
 */
public function destroy($id)
{
    $doctor = Doctor::findOrFail($id);

    $doctor->delete();

    return response()->json([
        'success' => true,
        'message' => 'Doctor deleted successfully.',
    ]);
}
}