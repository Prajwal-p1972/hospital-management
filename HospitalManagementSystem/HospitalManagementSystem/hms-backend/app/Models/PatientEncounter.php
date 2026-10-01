<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PatientEncounter extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'encounter_id',
        'encounter_type',
        'encounter_date',
        'doctor_id',
        'chief_complaint',
        'diagnosis',
        'treatment',
        'notes',
        'status',
    ];

    protected $casts = [
        'encounter_date' => 'datetime',
    ];

    // Encounter belongs to a Patient
    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    // Encounter belongs to a Doctor/User
    public function doctor()
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }
}