<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Advice extends Model
{
    use HasFactory;

    protected $table = 'advice';

    protected $fillable = [
        'doctor_id',
        'patient_id',
        'consultation_id',
        'advice_type',
        'advice_details',
        'priority',
        'given_on',
        'follow_up_required',
        'follow_up_date',
        'status',
    ];

    protected $casts = [
        'given_on' => 'date',
        'follow_up_required' => 'boolean',
        'follow_up_date' => 'date',
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