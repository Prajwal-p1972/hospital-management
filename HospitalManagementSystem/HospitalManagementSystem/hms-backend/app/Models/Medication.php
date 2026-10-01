<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Medication extends Model
{
    use HasFactory;

    protected $fillable = [
        'doctor_id',
        'patient_id',
        'consultation_id',
        'medicine_name',
        'generic_name',
        'dosage',
        'route',
        'frequency',
        'duration',
        'quantity',
        'instructions',
        'start_date',
        'end_date',
        'status',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function doctor()
    {
        return $this->belongsTo(Doctor::class);
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function consultation()
    {
        return $this->belongsTo(Consultation::class);
    }
}