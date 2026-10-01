<?php

namespace App\Http\Controllers;

use App\Models\DoctorQueue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DoctorQueueController extends Controller
{
    // Create today's queue entry
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'doctor_id' => 'required|exists:doctors,id',
            'patient_id' => 'required|exists:patients,id',
            'queue_date' => 'required|date',
            'queue_number' => 'required|integer|min:1',
            'appointment_time' => 'nullable|date_format:H:i',
            'status' => 'nullable|in:waiting,in_consultation,completed,cancelled,no_show',
            'reason' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $queue = DoctorQueue::create([
            'doctor_id' => $request->doctor_id,
            'patient_id' => $request->patient_id,
            'queue_date' => $request->queue_date,
            'queue_number' => $request->queue_number,
            'appointment_time' => $request->appointment_time,
            'status' => $request->status ?? 'waiting',
            'reason' => $request->reason,
            'notes' => $request->notes,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Patient added to doctor queue successfully.',
            'data' => $queue->load(['doctor', 'patient']),
        ], 201);
    }

    // Get today's queue for a doctor
    public function today($doctorId)
    {
        $today = now()->toDateString();

        $queues = DoctorQueue::with(['doctor', 'patient'])
            ->where('doctor_id', $doctorId)
            ->whereDate('queue_date', $today)
            ->orderBy('queue_number')
            ->get();

        return response()->json([
            'success' => true,
            'message' => "Today's doctor queue fetched successfully.",
            'data' => $queues,
        ]);
    }

    // Get all queue entries
    public function index()
    {
        $queues = DoctorQueue::with(['doctor', 'patient'])
            ->orderByDesc('queue_date')
            ->orderBy('queue_number')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Doctor queues fetched successfully.',
            'data' => $queues,
        ]);
    }

    // Get single queue entry
    public function show($id)
    {
        $queue = DoctorQueue::with(['doctor', 'patient'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Doctor queue fetched successfully.',
            'data' => $queue,
        ]);
    }

    // Update queue status/details
    public function update(Request $request, $id)
    {
        $queue = DoctorQueue::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'queue_number' => 'sometimes|required|integer|min:1',
            'appointment_time' => 'nullable|date_format:H:i',
            'status' => 'sometimes|required|in:waiting,in_consultation,completed,cancelled,no_show',
            'reason' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'checked_in_at' => 'nullable|date',
            'consultation_started_at' => 'nullable|date',
            'completed_at' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $queue->update($request->only([
            'queue_number',
            'appointment_time',
            'status',
            'reason',
            'notes',
            'checked_in_at',
            'consultation_started_at',
            'completed_at',
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Doctor queue updated successfully.',
            'data' => $queue->load(['doctor', 'patient']),
        ]);
    }

    // Delete queue entry
    public function destroy($id)
    {
        $queue = DoctorQueue::findOrFail($id);

        $queue->delete();

        return response()->json([
            'success' => true,
            'message' => 'Doctor queue entry deleted successfully.',
        ]);
    }
}