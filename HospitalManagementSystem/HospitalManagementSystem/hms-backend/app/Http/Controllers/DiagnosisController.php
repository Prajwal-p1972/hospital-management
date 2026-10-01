<?php

namespace App\Http\Controllers;

use App\Models\Diagnosis;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DiagnosisController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'doctor_id' => 'required|exists:doctors,id',
            'patient_id' => 'required|exists:patients,id',
            'consultation_id' => 'nullable|exists:consultations,id',

            'diagnosis_code' => 'nullable|string|max:100',
            'diagnosis_name' => 'required|string|max:255',

            'diagnosis_type' => 'nullable|in:provisional,confirmed,differential',

            'description' => 'nullable|string',

            'status' => 'nullable|in:active,resolved,inactive',

            'diagnosed_on' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $diagnosis = Diagnosis::create([
            'doctor_id' => $request->doctor_id,
            'patient_id' => $request->patient_id,
            'consultation_id' => $request->consultation_id,
            'diagnosis_code' => $request->diagnosis_code,
            'diagnosis_name' => $request->diagnosis_name,
            'diagnosis_type' => $request->diagnosis_type ?? 'provisional',
            'description' => $request->description,
            'status' => $request->status ?? 'active',
            'diagnosed_on' => $request->diagnosed_on,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Diagnosis created successfully.',
            'data' => $diagnosis->load([
                'doctor',
                'patient',
                'consultation',
            ]),
        ], 201);
    }

    public function index()
    {
        $diagnoses = Diagnosis::with([
            'doctor',
            'patient',
            'consultation',
        ])->latest('diagnosed_on')->get();

        return response()->json([
            'success' => true,
            'message' => 'Diagnoses fetched successfully.',
            'data' => $diagnoses,
        ]);
    }

    public function show($id)
    {
        $diagnosis = Diagnosis::with([
            'doctor',
            'patient',
            'consultation',
        ])->findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Diagnosis fetched successfully.',
            'data' => $diagnosis,
        ]);
    }

    public function update(Request $request, $id)
    {
        $diagnosis = Diagnosis::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'diagnosis_code' => 'nullable|string|max:100',
            'diagnosis_name' => 'sometimes|required|string|max:255',

            'diagnosis_type' => 'sometimes|required|in:provisional,confirmed,differential',

            'description' => 'nullable|string',

            'status' => 'sometimes|required|in:active,resolved,inactive',

            'diagnosed_on' => 'sometimes|required|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $diagnosis->update($request->only([
            'diagnosis_code',
            'diagnosis_name',
            'diagnosis_type',
            'description',
            'status',
            'diagnosed_on',
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Diagnosis updated successfully.',
            'data' => $diagnosis->load([
                'doctor',
                'patient',
                'consultation',
            ]),
        ]);
    }

    public function destroy($id)
    {
        $diagnosis = Diagnosis::findOrFail($id);

        $diagnosis->delete();

        return response()->json([
            'success' => true,
            'message' => 'Diagnosis deleted successfully.',
        ]);
    }
}