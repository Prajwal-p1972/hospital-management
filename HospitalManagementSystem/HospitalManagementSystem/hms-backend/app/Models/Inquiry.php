<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inquiry extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'phone',
        'email',
        'source',
        'department',
        'preferred_doctor',
        'preferred_date',
        'notes',
        'status',
        'follow_up_owner',
    ];
}
