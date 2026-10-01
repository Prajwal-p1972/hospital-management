<?php

namespace App\Http\Controllers;

use App\Models\Procedure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProcedureController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'doctor_id' => 'required|exists:doctors,id',
            'patient_id' => 'required|exists:patients,id',
            'consultation_id' => 'nullable|exists:consultations,id',

            'procedure_name' => 'required|string|max:255',
            'procedure_code' => 'nullable|string|max:100',

            'procedure_type' => 'nullable|in:diagnostic,therapeutic,surgical,other',

            'performed_on' => 'required|date',

            'status' => 'nullable|in:planned,in_progress,completed,cancelled',

            'description' => 'nullable|string',
            'findings' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $procedure = Procedure::create([
            'doctor_id' => $request->doctor_id,
            'patient_id' => $request->patient_id,
            'consultation_id' => $request->consultation_id,

            'procedure_name' => $request->procedure_name,
            'procedure_code' => $request->procedure_code,

            'procedure_type' => $request->procedure_type ?? 'other',

            'performed_on' => $request->performed_on,

            'status' => $request->status ?? 'planned',

            'description' => $request->description,
            'findings' => $request->findings,
            'notes' => $request->notes,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Procedure created successfully.',
            'data' => $procedure->load([
                'doctor',
                'patient',
                'consultation',
            ]),
        ], 201);
    }

    public function index()
    {
        $procedures = Procedure::with([
            'doctor',
            'patient',
            'consultation',
        ])->latest('performed_on')->get();

        return response()->json([
            'success' => true,
            'message' => 'Procedures fetched successfully.',
            'data' => $procedures,
        ]);
    }

    public function show($id)
    {
        $procedure = Procedure::with([
            'doctor',
            'patient',
            'consultation',
        ])->findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Procedure fetched successfully.',
            'data' => $procedure,
        ]);
    }

    public function update(Request $request, $id)
    {
        $procedure = Procedure::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'procedure_name' => 'sometimes|required|string|max:255',
            'procedure_code' => 'nullable|string|max:100',

            'procedure_type' => 'sometimes|required|in:diagnostic,therapeutic,surgical,other',

            'performed_on' => 'sometimes|required|date',

            'status' => 'sometimes|required|in:planned,in_progress,completed,cancelled',

            'description' => 'nullable|string',
            'findings' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $procedure->update($request->only([
            'procedure_name',
            'procedure_code',
            'procedure_type',
            'performed_on',
            'status',
            'description',
            'findings',
            'notes',
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Procedure updated successfully.',
            'data' => $procedure->load([
                'doctor',
                'patient',
                'consultation',
            ]),
        ]);
    }

    public function destroy($id)
    {
        $procedure = Procedure::findOrFail($id);

        $procedure->delete();

        return response()->json([
            'success' => true,
            'message' => 'Procedure deleted successfully.',
        ]);
    }
}