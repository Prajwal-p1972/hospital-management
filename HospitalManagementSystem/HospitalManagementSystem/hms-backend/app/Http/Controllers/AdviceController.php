<?php

namespace App\Http\Controllers;

use App\Models\Advice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AdviceController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'doctor_id' => 'required|exists:doctors,id',
            'patient_id' => 'required|exists:patients,id',
            'consultation_id' => 'nullable|exists:consultations,id',

            'advice_type' => 'nullable|in:diet,lifestyle,medication,activity,general,other',
            'advice_details' => 'required|string',

            'priority' => 'nullable|in:low,normal,high',

            'given_on' => 'required|date',

            'follow_up_required' => 'nullable|boolean',
            'follow_up_date' => 'nullable|date',

            'status' => 'nullable|in:active,completed,cancelled',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $advice = Advice::create([
            'doctor_id' => $request->doctor_id,
            'patient_id' => $request->patient_id,
            'consultation_id' => $request->consultation_id,

            'advice_type' => $request->advice_type ?? 'general',
            'advice_details' => $request->advice_details,

            'priority' => $request->priority ?? 'normal',

            'given_on' => $request->given_on,

            'follow_up_required' => $request->follow_up_required ?? false,
            'follow_up_date' => $request->follow_up_date,

            'status' => $request->status ?? 'active',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Advice created successfully.',
            'data' => $advice->load([
                'doctor',
                'patient',
                'consultation',
            ]),
        ], 201);
    }

    public function index()
    {
        $advice = Advice::with([
            'doctor',
            'patient',
            'consultation',
        ])->latest('given_on')->get();

        return response()->json([
            'success' => true,
            'message' => 'Advice fetched successfully.',
            'data' => $advice,
        ]);
    }

    public function show($id)
    {
        $advice = Advice::with([
            'doctor',
            'patient',
            'consultation',
        ])->findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Advice fetched successfully.',
            'data' => $advice,
        ]);
    }

    public function update(Request $request, $id)
    {
        $advice = Advice::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'advice_type' => 'sometimes|required|in:diet,lifestyle,medication,activity,general,other',
            'advice_details' => 'sometimes|required|string',

            'priority' => 'sometimes|required|in:low,normal,high',

            'given_on' => 'sometimes|required|date',

            'follow_up_required' => 'sometimes|boolean',
            'follow_up_date' => 'nullable|date',

            'status' => 'sometimes|required|in:active,completed,cancelled',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $advice->update($request->only([
            'advice_type',
            'advice_details',
            'priority',
            'given_on',
            'follow_up_required',
            'follow_up_date',
            'status',
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Advice updated successfully.',
            'data' => $advice->load([
                'doctor',
                'patient',
                'consultation',
            ]),
        ]);
    }

    public function destroy($id)
    {
        $advice = Advice::findOrFail($id);

        $advice->delete();

        return response()->json([
            'success' => true,
            'message' => 'Advice deleted successfully.',
        ]);
    }
}