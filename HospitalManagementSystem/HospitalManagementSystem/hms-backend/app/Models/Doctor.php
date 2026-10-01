<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Consultation;
use App\Models\Diagnosis;
use App\Models\Investigation;

class Doctor extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'doctor_code',
        'registration_number',
        'first_name',
        'last_name',
        'department',
        'specialization',
        'qualification',
        'experience_years',
        'phone',
        'email',
        'consultation_fee',
        'status',
        'bio',
    ];

    protected $casts = [
        'experience_years' => 'integer',
        'consultation_fee' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function schedules()
    {
        return $this->hasMany(DoctorSchedule::class);
    }

public function queues()
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