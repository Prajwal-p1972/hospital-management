<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'doctor_id',
        'consultation_id',
        'document_type',
        'title',
        'file_path',
        'file_name',
        'mime_type',
        'file_size',
        'description',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function doctor()
    {
        return $this->belongsTo(Doctor::class);
    }

    public function consultation()
    {
        return $this->belongsTo(Consultation::class);
    }
}