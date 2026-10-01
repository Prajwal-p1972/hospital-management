<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\PatientEncounterController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\DoctorScheduleController;
use App\Http\Controllers\DoctorQueueController;
use App\Http\Controllers\Patient360Controller;
use App\Http\Controllers\ConsultationController;
use App\Http\Controllers\DiagnosisController;
use App\Http\Controllers\InvestigationController;
use App\Http\Controllers\MedicationController;
use App\Http\Controllers\AdviceController;
use App\Http\Controllers\ProcedureController;
use App\Http\Controllers\FollowUpController;
use App\Http\Controllers\PrescriptionController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\ElectronicSignatureController;
use App\Http\Controllers\DoctorDashboardController;
use App\Http\Controllers\InquiryController;



Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/admin-test', function (Request $request) {
    return response()->json([
        'message' => 'Admin access successful.',
        'user' => $request->user(),
    ]);
})->middleware(['auth:sanctum', 'role:admin']);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/v1/patients/{id}/360', [Patient360Controller::class, 'show']);
});

Route::get('/admin/users', function (Request $request) {
    return response()->json([
        'message' => 'Users fetched successfully.',
        'users' => \App\Models\User::with('role')
            ->select('id', 'role_id', 'name', 'email', 'created_at')
            ->get(),
    ]);

})->middleware(['auth:sanctum', 'role:admin']);


Route::post('/admin/users', function (Request $request) {
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email',
        'password' => 'required|string|min:8',
        'role_id' => 'required|exists:roles,id',
    ]);

    $user = \App\Models\User::create([
        'name' => $validated['name'],
        'email' => $validated['email'],
        'password' => \Illuminate\Support\Facades\Hash::make($validated['password']),
        'role_id' => $validated['role_id'],
    ]);

    $user->load('role');

    return response()->json([
        'message' => 'User created successfully.',
        'user' => $user,
    ], 201);
})->middleware(['auth:sanctum', 'role:admin']);


Route::put('/admin/users/{id}', function (Request $request, $id) {

    $user = \App\Models\User::findOrFail($id);

    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email,' . $id,
        'role_id' => 'required|exists:roles,id',
    ]);

    $user->update([
        'name' => $validated['name'],
        'email' => $validated['email'],
        'role_id' => $validated['role_id'],
    ]);

    $user->load('role');

    return response()->json([
        'message' => 'User updated successfully.',
        'user' => $user,
    ]);

})->middleware(['auth:sanctum', 'role:admin']);

Route::delete('/admin/users/{id}', function (Request $request, $id) {

    $user = \App\Models\User::findOrFail($id);

    $user->delete();

    return response()->json([
        'message' => 'User deleted successfully.'
    ]);

})->middleware(['auth:sanctum', 'role:admin']);

Route::get('/doctor-test', function (Request $request) {
    return response()->json([
        'message' => 'Doctor access successful.',
        'user' => $request->user(),
    ]);
})->middleware(['auth:sanctum', 'role:doctor']);


Route::middleware('auth:sanctum')->group(function () {


    Route::post('/patients', [PatientController::class, 'store']);
    Route::get('/patients/search', [PatientController::class, 'search']);
    Route::get('/patients/qr/{qr_token}', [PatientController::class, 'qrLookup']);
    Route::get('/patients', [PatientController::class, 'index']);
    Route::get('/patients/{id}', [PatientController::class, 'show']);
    Route::put('/patients/{id}', [PatientController::class, 'update']);
    Route::delete('/patients/{id}', [PatientController::class, 'destroy']);

    // Patient Encounter / History Routes

Route::post('/patients/{patientId}/encounters', [PatientEncounterController::class, 'store']);

Route::get('/patients/{patientId}/encounters', [PatientEncounterController::class, 'index']);

Route::get('/patients/{patientId}/encounters/{encounterId}', [PatientEncounterController::class, 'show']);

Route::put('/patients/{patientId}/encounters/{encounterId}', [PatientEncounterController::class, 'update']);

Route::delete('/patients/{patientId}/encounters/{encounterId}', [PatientEncounterController::class, 'destroy']);

});
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {

    Route::post('/v1/doctors', [DoctorController::class, 'store']);

    Route::get('/v1/doctors', [DoctorController::class, 'index']);

    Route::get('/v1/doctors/{id}', [DoctorController::class, 'show']);

    Route::put('/v1/doctors/{id}', [DoctorController::class, 'update']);

    Route::delete('/v1/doctors/{id}', [DoctorController::class, 'destroy']);

});

Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {

    Route::post('/v1/doctors/{doctorId}/schedules', [DoctorScheduleController::class, 'store']);
    Route::get('/v1/doctors/{doctorId}/schedules', [DoctorScheduleController::class, 'index']);
    Route::get('/v1/doctor-schedules/{id}', [DoctorScheduleController::class, 'show']);
    Route::put('/v1/doctor-schedules/{id}', [DoctorScheduleController::class, 'update']);
    Route::delete('/v1/doctor-schedules/{id}', [DoctorScheduleController::class, 'destroy']);

});

    Route::middleware(['auth:sanctum', 'role:admin,doctor'])->group(function () {

    Route::get('/v1/doctors/{doctorId}/today-queue', [DoctorQueueController::class, 'today']);

});


Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {

    Route::post('/v1/doctor-queues', [DoctorQueueController::class, 'store']);

    Route::get('/v1/doctor-queues', [DoctorQueueController::class, 'index']);
    Route::get('/v1/doctor-queues/{id}', [DoctorQueueController::class, 'show']);
    Route::put('/v1/doctor-queues/{id}', [DoctorQueueController::class, 'update']);
    Route::delete('/v1/doctor-queues/{id}', [DoctorQueueController::class, 'destroy']);

});
Route::middleware(['auth:sanctum', 'role:admin,doctor'])->group(function () {

    Route::post('/v1/consultations', [ConsultationController::class, 'store']);
    Route::get('/v1/consultations', [ConsultationController::class, 'index']);
    Route::get('/v1/consultations/{id}', [ConsultationController::class, 'show']);
    Route::put('/v1/consultations/{id}', [ConsultationController::class, 'update']);
    Route::delete('/v1/consultations/{id}', [ConsultationController::class, 'destroy']);

});

Route::middleware(['auth:sanctum', 'role:admin,doctor'])->group(function () {

    Route::post('/v1/investigations', [InvestigationController::class, 'store']);
    Route::get('/v1/investigations', [InvestigationController::class, 'index']);
    Route::get('/v1/investigations/{id}', [InvestigationController::class, 'show']);
    Route::put('/v1/investigations/{id}', [InvestigationController::class, 'update']);
    Route::delete('/v1/investigations/{id}', [InvestigationController::class, 'destroy']);

});

    Route::middleware(['auth:sanctum', 'role:admin,doctor'])->group(function () {
Route::post('/v1/medications', [MedicationController::class, 'store']);
Route::get('/v1/medications', [MedicationController::class, 'index']);
Route::get('/v1/medications/{id}', [MedicationController::class, 'show']);
Route::put('/v1/medications/{id}', [MedicationController::class, 'update']);
Route::delete('/v1/medications/{id}', [MedicationController::class, 'destroy']);
});


Route::middleware(['auth:sanctum', 'role:admin,doctor'])->group(function () {

    Route::post('/v1/advice', [AdviceController::class, 'store']);
    Route::get('/v1/advice', [AdviceController::class, 'index']);
    Route::get('/v1/advice/{id}', [AdviceController::class, 'show']);
    Route::put('/v1/advice/{id}', [AdviceController::class, 'update']);
    Route::delete('/v1/advice/{id}', [AdviceController::class, 'destroy']);

});

Route::middleware(['auth:sanctum', 'role:admin,doctor'])->group(function () {
Route::post('/v1/procedures', [ProcedureController::class, 'store']);
Route::get('/v1/procedures', [ProcedureController::class, 'index']);
Route::get('/v1/procedures/{id}', [ProcedureController::class, 'show']);
Route::put('/v1/procedures/{id}', [ProcedureController::class, 'update']);
Route::delete('/v1/procedures/{id}', [ProcedureController::class, 'destroy']);
});

Route::middleware(['auth:sanctum', 'role:admin,doctor'])->group(function () {
Route::post('/v1/follow-ups', [FollowUpController::class, 'store']);
Route::get('/v1/follow-ups', [FollowUpController::class, 'index']);
Route::get('/v1/follow-ups/{id}', [FollowUpController::class, 'show']);
Route::put('/v1/follow-ups/{id}', [FollowUpController::class, 'update']);
Route::delete('/v1/follow-ups/{id}', [FollowUpController::class, 'destroy']);
});

Route::middleware(['auth:sanctum', 'role:admin,doctor'])->group(function () {
Route::get('/prescriptions', [PrescriptionController::class, 'index']);
Route::post('/prescriptions', [PrescriptionController::class, 'store']);
Route::get('/prescriptions/{id}', [PrescriptionController::class, 'show']);
Route::put('/prescriptions/{id}', [PrescriptionController::class, 'update']);
Route::delete('/prescriptions/{id}', [PrescriptionController::class, 'destroy']);
});

Route::middleware(['auth:sanctum', 'role:admin,doctor'])->group(function () {
Route::get('/appointments', [AppointmentController::class, 'index']);
Route::post('/appointments', [AppointmentController::class, 'store']);
Route::get('/appointments/{id}', [AppointmentController::class, 'show']);
Route::put('/appointments/{id}', [AppointmentController::class, 'update']);
Route::delete('/appointments/{id}', [AppointmentController::class, 'destroy']);
});


Route::prefix('v1')->middleware('auth:sanctum')->group(function () {
    Route::apiResource('inquiries', InquiryController::class);
    Route::apiResource('documents', DocumentController::class);
    Route::apiResource('electronic-signatures', ElectronicSignatureController::class);

    Route::get(
        'doctor-dashboard',
        [DoctorDashboardController::class, 'show']
    );
});


Route::get('/get-users', function() { return App\Models\User::all(); });
