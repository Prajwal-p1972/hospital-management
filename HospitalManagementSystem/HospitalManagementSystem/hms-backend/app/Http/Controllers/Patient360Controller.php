<?php

namespace App\Http\Controllers;

use App\Models\Patient;

class Patient360Controller extends Controller
{
    public function show($id)
    {
        $patient = Patient::with([
            'doctorQueues.doctor',
            'consultations.doctor',
            'consultations.queue',
        ])->findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Patient 360 data fetched successfully.',
            'data' => [
                'patient' => $patient,
                'doctor_queues' => $patient->doctorQueues,
                'consultations' => $patient->consultations,
            ],
        ]);
    }
}