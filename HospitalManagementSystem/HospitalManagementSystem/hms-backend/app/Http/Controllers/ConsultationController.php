<?php

namespace App\Http\Controllers;

use App\Models\Consultation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ConsultationController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'doctor_id' => 'required|exists:doctors,id',
            'patient_id' => 'required|exists:patients,id',
            'queue_id' => 'nullable|exists:doctor_queues,id',
            'consultation_date' => 'required|date',

            'chief_complaint' => 'nullable|string',
            'history' => 'nullable|string',
            'examination' => 'nullable|string',
            'diagnosis' => 'nullable|string',
            'investigations' => 'nullable|string',
            'prescription' => 'nullable|string',
            'advice' => 'nullable|string',
            'procedure' => 'nullable|string',
            'follow_up' => 'nullable|string',
            'documents' => 'nullable|string',
            'electronic_signature' => 'nullable|string',

            'status' => 'nullable|in:draft,completed,cancelled',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $consultation = Consultation::create([
            'doctor_id' => $request->doctor_id,
            'patient_id' => $request->patient_id,
            'queue_id' => $request->queue_id,
            'consultation_date' => $request->consultation_date,
            'chief_complaint' => $request->chief_complaint,
            'history' => $request->history,
            'examination' => $request->examination,
            'diagnosis' => $request->diagnosis,
            'investigations' => $request->investigations,
            'prescription' => $request->prescription,
            'advice' => $request->advice,
            'procedure' => $request->procedure,
            'follow_up' => $request->follow_up,
            'documents' => $request->documents,
            'electronic_signature' => $request->electronic_signature,
            'status' => $request->status ?? 'draft',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Consultation created successfully.',
            'data' => $consultation->load([
                'doctor',
                'patient',
                'queue',
            ]),
        ], 201);
    }

    public function index()
    {
        $consultations = Consultation::with([
            'doctor',
            'patient',
            'queue',
        ])->latest('consultation_date')->get();

        return response()->json([
            'success' => true,
            'message' => 'Consultations fetched successfully.',
            'data' => $consultations,
        ]);
    }

    public function show($id)
    {
        $consultation = Consultation::with([
            'doctor',
            'patient',
            'queue',
        ])->findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Consultation fetched successfully.',
            'data' => $consultation,
        ]);
    }

    public function update(Request $request, $id)
    {
        $consultation = Consultation::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'consultation_date' => 'sometimes|required|date',

            'chief_complaint' => 'nullable|string',
            'history' => 'nullable|string',
            'examination' => 'nullable|string',
            'diagnosis' => 'nullable|string',
            'investigations' => 'nullable|string',
            'prescription' => 'nullable|string',
            'advice' => 'nullable|string',
            'procedure' => 'nullable|string',
            'follow_up' => 'nullable|string',
            'documents' => 'nullable|string',
            'electronic_signature' => 'nullable|string',

            'status' => 'sometimes|required|in:draft,completed,cancelled',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $consultation->update($request->only([
            'consultation_date',
            'chief_complaint',
            'history',
            'examination',
            'diagnosis',
            'investigations',
            'prescription',
            'advice',
            'procedure',
            'follow_up',
            'documents',
            'electronic_signature',
            'status',
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Consultation updated successfully.',
            'data' => $consultation->load([
                'doctor',
                'patient',
                'queue',
            ]),
        ]);
    }

    public function destroy($id)
    {
        $consultation = Consultation::findOrFail($id);

        $consultation->delete();

        return response()->json([
            'success' => true,
            'message' => 'Consultation deleted successfully.',
        ]);
    }
}