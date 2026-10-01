<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Consultation;
use App\Models\Diagnosis;
use App\Models\Investigation;

class Patient extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'patient_id',
        'qr_token',

        'first_name',
        'middle_name',
        'last_name',
        'date_of_birth',
        'sex',
        'blood_group',
        'photo',
        'nationality',
        'marital_status',
        'occupation',

        'primary_phone',
        'alternate_phone',
        'email',

        'address',
        'city',
        'state',
        'country',
        'postal_code',

        'emergency_contact_name',
        'emergency_contact_phone',
        'emergency_contact_relationship',

        'patient_type',

        'allergies',
        'critical_alerts',
        'infection_precautions',
        'clinical_safety_flags',

        'consent_given',
        'communication_preferences',

        'identifiers',
        'custom_demographics',

        'is_active',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'consent_given' => 'boolean',
        'is_active' => 'boolean',
        'communication_preferences' => 'array',
        'identifiers' => 'array',
        'custom_demographics' => 'array',
    ];

public function encounters()
{
    return $this->hasMany(PatientEncounter::class);
}
public function doctorQueues()
{
    return $this->hasMany(DoctorQueue::class);
}
public function consultations()
{
    return $this->hasMany(Consultation::class);
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