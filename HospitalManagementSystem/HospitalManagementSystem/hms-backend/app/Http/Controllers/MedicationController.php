<?php

namespace App\Http\Controllers;

use App\Models\Medication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MedicationController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'doctor_id' => 'required|exists:doctors,id',
            'patient_id' => 'required|exists:patients,id',
            'consultation_id' => 'nullable|exists:consultations,id',

            'medicine_name' => 'required|string|max:255',
            'generic_name' => 'nullable|string|max:255',
            'dosage' => 'nullable|string|max:100',

            'route' => 'nullable|in:oral,iv,im,sc,topical,inhalation,other',

            'frequency' => 'nullable|string|max:100',
            'duration' => 'nullable|string|max:100',
            'quantity' => 'nullable|integer|min:1',

            'instructions' => 'nullable|string',

            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',

            'status' => 'nullable|in:active,completed,discontinued',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $medication = Medication::create([
            'doctor_id' => $request->doctor_id,
            'patient_id' => $request->patient_id,
            'consultation_id' => $request->consultation_id,

            'medicine_name' => $request->medicine_name,
            'generic_name' => $request->generic_name,
            'dosage' => $request->dosage,
            'route' => $request->route ?? 'oral',

            'frequency' => $request->frequency,
            'duration' => $request->duration,
            'quantity' => $request->quantity,

            'instructions' => $request->instructions,

            'start_date' => $request->start_date,
            'end_date' => $request->end_date,

            'status' => $request->status ?? 'active',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Medication created successfully.',
            'data' => $medication->load([
                'doctor',
                'patient',
                'consultation',
            ]),
        ], 201);
    }

    public function index()
    {
        $medications = Medication::with([
            'doctor',
            'patient',
            'consultation',
        ])->latest('start_date')->get();

        return response()->json([
            'success' => true,
            'message' => 'Medications fetched successfully.',
            'data' => $medications,
        ]);
    }

    public function show($id)
    {
        $medication = Medication::with([
            'doctor',
            'patient',
            'consultation',
        ])->findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Medication fetched successfully.',
            'data' => $medication,
        ]);
    }

    public function update(Request $request, $id)
    {
        $medication = Medication::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'medicine_name' => 'sometimes|required|string|max:255',
            'generic_name' => 'nullable|string|max:255',
            'dosage' => 'nullable|string|max:100',

            'route' => 'sometimes|required|in:oral,iv,im,sc,topical,inhalation,other',

            'frequency' => 'nullable|string|max:100',
            'duration' => 'nullable|string|max:100',
            'quantity' => 'nullable|integer|min:1',

            'instructions' => 'nullable|string',

            'start_date' => 'sometimes|required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',

            'status' => 'sometimes|required|in:active,completed,discontinued',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $medication->update($request->only([
            'medicine_name',
            'generic_name',
            'dosage',
            'route',
            'frequency',
            'duration',
            'quantity',
            'instructions',
            'start_date',
            'end_date',
            'status',
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Medication updated successfully.',
            'data' => $medication->load([
                'doctor',
                'patient',
                'consultation',
            ]),
        ]);
    }

    public function destroy($id)
    {
        $medication = Medication::findOrFail($id);

        $medication->delete();

        return response()->json([
            'success' => true,
            'message' => 'Medication deleted successfully.',
        ]);
    }
}