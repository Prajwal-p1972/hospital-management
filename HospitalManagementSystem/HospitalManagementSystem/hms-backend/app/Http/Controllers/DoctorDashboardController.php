<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use App\Models\Appointment;
use App\Models\DoctorQueue;
use App\Models\Consultation;
use App\Models\FollowUp;
use App\Models\Prescription;
use App\Models\Investigation;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class DoctorDashboardController extends Controller
{
   public function show(Request $request)
{
    $user = $request->user();
   
    $doctor = Doctor::where('user_id', $user->id)->first();

    if (!$doctor) {
        return response()->json([
            'success' => false,
            'message' => 'Doctor profile is not linked to this user'
        ], 422);
    }

    $doctorId = $doctor->id;

    $today = Carbon::today();

        $appointmentsToday = Appointment::where('doctor_id', $doctorId)
            ->whereDate('appointment_date', $today)
            ->count();

        $queueToday = DoctorQueue::where('doctor_id', $doctorId)
            ->whereDate('queue_date', $today)
            ->count();

        $consultationsToday = Consultation::where('doctor_id', $doctorId)
            ->whereDate('created_at', $today)
            ->count();

        $pendingFollowUps = FollowUp::where('doctor_id', $doctorId)
            ->where('status', 'scheduled')
            ->count();

        $recentPrescriptions = Prescription::where('doctor_id', $doctorId)
            ->latest()
            ->take(5)
            ->get();

        $recentInvestigations = Investigation::where('doctor_id', $doctorId)
            ->latest()
            ->take(5)
            ->get();

        $recentDocuments = Document::where('doctor_id', $doctorId)
            ->latest()
            ->take(5)
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Doctor dashboard retrieved successfully',
            'data' => [
                'doctor' => $doctor,

                'today' => [
                    'date' => $today->toDateString(),
                    'appointments' => $appointmentsToday,
                    'queue' => $queueToday,
                    'consultations' => $consultationsToday,
                ],

                'pending_follow_ups' => $pendingFollowUps,

                'recent_prescriptions' => $recentPrescriptions,

                'recent_investigations' => $recentInvestigations,

                'recent_documents' => $recentDocuments,
            ]
        ], 200);
    }
}