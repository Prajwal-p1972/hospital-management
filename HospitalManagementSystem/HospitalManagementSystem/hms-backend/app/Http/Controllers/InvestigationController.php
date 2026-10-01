<?php

namespace App\Http\Controllers;

use App\Models\Investigation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class InvestigationController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'doctor_id' => 'required|exists:doctors,id',
            'patient_id' => 'required|exists:patients,id',
            'consultation_id' => 'nullable|exists:consultations,id',

            'investigation_name' => 'required|string|max:255',
            'test_code' => 'nullable|string|max:100',

            'investigation_type' => 'nullable|in:lab,imaging,other',

            'status' => 'nullable|in:ordered,in_progress,completed,cancelled',

            'ordered_on' => 'required|date',
            'completed_on' => 'nullable|date|after_or_equal:ordered_on',

            'result' => 'nullable|string',
            'remarks' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $investigation = Investigation::create([
            'doctor_id' => $request->doctor_id,
            'patient_id' => $request->patient_id,
            'consultation_id' => $request->consultation_id,

            'investigation_name' => $request->investigation_name,
            'test_code' => $request->test_code,
            'investigation_type' => $request->investigation_type ?? 'lab',

            'status' => $request->status ?? 'ordered',

            'ordered_on' => $request->ordered_on,
            'completed_on' => $request->completed_on,

            'result' => $request->result,
            'remarks' => $request->remarks,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Investigation created successfully.',
            'data' => $investigation->load([
                'doctor',
                'patient',
                'consultation',
            ]),
        ], 201);
    }

    public function index()
    {
        $investigations = Investigation::with([
            'doctor',
            'patient',
            'consultation',
        ])->latest('ordered_on')->get();

        return response()->json([
            'success' => true,
            'message' => 'Investigations fetched successfully.',
            'data' => $investigations,
        ]);
    }

    public function show($id)
    {
        $investigation = Investigation::with([
            'doctor',
            'patient',
            'consultation',
        ])->findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Investigation fetched successfully.',
            'data' => $investigation,
        ]);
    }

    public function update(Request $request, $id)
    {
        $investigation = Investigation::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'investigation_name' => 'sometimes|required|string|max:255',
            'test_code' => 'nullable|string|max:100',

            'investigation_type' => 'sometimes|required|in:lab,imaging,other',

            'status' => 'sometimes|required|in:ordered,in_progress,completed,cancelled',

            'ordered_on' => 'sometimes|required|date',
            'completed_on' => 'nullable|date|after_or_equal:ordered_on',

            'result' => 'nullable|string',
            'remarks' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $investigation->update($request->only([
            'investigation_name',
            'test_code',
            'investigation_type',
            'status',
            'ordered_on',
            'completed_on',
            'result',
            'remarks',
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Investigation updated successfully.',
            'data' => $investigation->load([
                'doctor',
                'patient',
                'consultation',
            ]),
        ]);
    }

    public function destroy($id)
    {
        $investigation = Investigation::findOrFail($id);

        $investigation->delete();

        return response()->json([
            'success' => true,
            'message' => 'Investigation deleted successfully.',
        ]);
    }
}