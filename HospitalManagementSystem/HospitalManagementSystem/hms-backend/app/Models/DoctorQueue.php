<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DoctorQueue extends Model
{
    use HasFactory;

    protected $fillable = [
        'doctor_id',
        'patient_id',
        'queue_date',
        'queue_number',
        'appointment_time',
        'status',
        'reason',
        'notes',
        'checked_in_at',
        'consultation_started_at',
        'completed_at',
    ];

    protected $casts = [
        'queue_date' => 'date',
        'queue_number' => 'integer',
        'checked_in_at' => 'datetime',
        'consultation_started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function doctor()
    {
        return $this->belongsTo(Doctor::class);
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
}