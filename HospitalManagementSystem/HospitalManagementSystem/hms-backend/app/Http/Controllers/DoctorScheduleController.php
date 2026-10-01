<?php

namespace App\Http\Controllers;

use App\Models\DoctorSchedule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;


class DoctorScheduleController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'doctor_id' => 'required|exists:doctors,id',
            'clinic_name' => 'nullable|string|max:150',

            'day_of_week' => 'required|in:monday,tuesday,wednesday,thursday,friday,saturday,sunday',

            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',

            'break_start' => 'nullable|date_format:H:i',
            'break_end' => 'nullable|date_format:H:i|after:break_start',

            'slot_duration_minutes' => 'nullable|integer|min:5|max:120',

            'consultation_mode' => 'nullable|in:in_person,online',

            'effective_from' => 'nullable|date',
            'effective_to' => 'nullable|date|after_or_equal:effective_from',

            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $schedule = DoctorSchedule::create([
            'doctor_id' => $request->doctor_id,
            'clinic_name' => $request->clinic_name,
            'day_of_week' => $request->day_of_week,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'break_start' => $request->break_start,
            'break_end' => $request->break_end,
            'slot_duration_minutes' => $request->slot_duration_minutes ?? 15,
            'consultation_mode' => $request->consultation_mode ?? 'in_person',
            'effective_from' => $request->effective_from,
            'effective_to' => $request->effective_to,
            'is_active' => $request->is_active ?? true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Doctor schedule created successfully.',
            'data' => $schedule->load('doctor'),
        ], 201);
    }

    public function index()
    {
        $schedules = DoctorSchedule::with('doctor')
            ->orderBy('doctor_id')
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Doctor schedules fetched successfully.',
            'data' => $schedules,
        ]);
    }

    public function show($id)
    {
        $schedule = DoctorSchedule::with('doctor')->findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Doctor schedule fetched successfully.',
            'data' => $schedule,
        ]);
    }

    public function update(Request $request, $id)
    {
        $schedule = DoctorSchedule::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'doctor_id' => 'sometimes|required|exists:doctors,id',
            'clinic_name' => 'nullable|string|max:150',

            'day_of_week' => 'sometimes|required|in:monday,tuesday,wednesday,thursday,friday,saturday,sunday',

            'start_time' => 'sometimes|required|date_format:H:i',
            'end_time' => 'sometimes|required|date_format:H:i',

            'break_start' => 'nullable|date_format:H:i',
            'break_end' => 'nullable|date_format:H:i|after:break_start',

            'slot_duration_minutes' => 'nullable|integer|min:5|max:120',

            'consultation_mode' => 'nullable|in:in_person,online',

            'effective_from' => 'nullable|date',
            'effective_to' => 'nullable|date|after_or_equal:effective_from',

            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $schedule->update($request->only([
            'doctor_id',
            'clinic_name',
            'day_of_week',
            'start_time',
            'end_time',
            'break_start',
            'break_end',
            'slot_duration_minutes',
            'consultation_mode',
            'effective_from',
            'effective_to',
            'is_active',
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Doctor schedule updated successfully.',
            'data' => $schedule->load('doctor'),
        ]);
    }

    public function destroy($id)
    {
        $schedule = DoctorSchedule::findOrFail($id);

        $schedule->delete();

        return response()->json([
            'success' => true,
            'message' => 'Doctor schedule deleted successfully.',
        ]);
    }
}