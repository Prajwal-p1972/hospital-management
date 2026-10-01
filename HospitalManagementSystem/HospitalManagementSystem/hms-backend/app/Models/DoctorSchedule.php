<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DoctorSchedule extends Model
{
    use HasFactory;

    protected $fillable = [
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
    ];

    protected $casts = [
        'slot_duration_minutes' => 'integer',
        'effective_from' => 'date',
        'effective_to' => 'date',
        'is_active' => 'boolean',
    ];

    public function doctor()
    {
        return $this->belongsTo(Doctor::class);
    }
}