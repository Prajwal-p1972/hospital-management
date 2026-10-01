<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Diagnosis;
use App\Models\Investigation;

class Consultation extends Model
{
    use HasFactory;

    protected $fillable = [
        'doctor_id',
        'patient_id',
        'queue_id',
        'consultation_date',
        'chief_complaint',
        'history',
        'examination',
        'diagnosis',
        'investigations',
        'prescription',
        'advice',
        'procedure',
        'follow_up',
        'documents',
        'electronic_signature',
        'status',
    ];

    protected $casts = [
        'consultation_date' => 'datetime',
    ];

    public function doctor()
    {
        return $this->belongsTo(Doctor::class);
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function queue()
    {
        return $this->belongsTo(DoctorQueue::class, 'queue_id');
    }
public function diagnoses()
{
    return $this->hasMany(Diagnosis::class);
}
public function investigations()
{
    return $this->hasMany(Investigation::class);
}
}