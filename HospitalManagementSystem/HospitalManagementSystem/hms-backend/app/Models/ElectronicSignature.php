<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ElectronicSignature extends Model
{
    use HasFactory;

    protected $fillable = [
        'doctor_id',
        'document_id',
        'signature_type',
        'signature_data',
        'signed_by',
        'signed_at',
        'status',
    ];

    protected $casts = [
        'signed_at' => 'datetime',
    ];

    public function doctor()
    {
        return $this->belongsTo(Doctor::class);
    }

    public function document()
    {
        return $this->belongsTo(Document::class);
    }
}