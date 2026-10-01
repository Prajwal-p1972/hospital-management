<?php

namespace App\Http\Controllers;

use App\Models\FollowUp;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FollowUpController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'doctor_id' => 'required|exists:doctors,id',
            'patient_id' => 'required|exists:patients,id',
            'consultation_id' => 'nullable|exists:consultations,id',

            'follow_up_date' => 'required|date',
            'reason' => 'nullable|string|max:255',
            'instructions' => 'nullable|string',

            'status' => 'nullable|in:scheduled,completed,cancelled,missed',

            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $followUp = FollowUp::create([
            'doctor_id' => $request->doctor_id,
            'patient_id' => $request->patient_id,
            'consultation_id' => $request->consultation_id,

            'follow_up_date' => $request->follow_up_date,
            'reason' => $request->reason,
            'instructions' => $request->instructions,

            'status' => $request->status ?? 'scheduled',

            'notes' => $request->notes,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Follow-up created successfully.',
            'data' => $followUp->load([
                'doctor',
                'patient',
                'consultation',
            ]),
        ], 201);
    }

    public function index()
    {
        $followUps = FollowUp::with([
            'doctor',
            'patient',
            'consultation',
        ])->latest('follow_up_date')->get();

        return response()->json([
            'success' => true,
            'message' => 'Follow-ups fetched successfully.',
            'data' => $followUps,
        ]);
    }

    public function show($id)
    {
        $followUp = FollowUp::with([
            'doctor',
            'patient',
            'consultation',
        ])->findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Follow-up fetched successfully.',
            'data' => $followUp,
        ]);
    }

    public function update(Request $request, $id)
    {
        $followUp = FollowUp::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'follow_up_date' => 'sometimes|required|date',
            'reason' => 'nullable|string|max:255',
            'instructions' => 'nullable|string',

            'status' => 'sometimes|required|in:scheduled,completed,cancelled,missed',

            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $followUp->update($request->only([
            'follow_up_date',
            'reason',
            'instructions',
            'status',
            'notes',
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Follow-up updated successfully.',
            'data' => $followUp->load([
                'doctor',
                'patient',
                'consultation',
            ]),
        ]);
    }

    public function destroy($id)
    {
        $followUp = FollowUp::findOrFail($id);

        $followUp->delete();

        return response()->json([
            'success' => true,
            'message' => 'Follow-up deleted successfully.',
        ]);
    }
}