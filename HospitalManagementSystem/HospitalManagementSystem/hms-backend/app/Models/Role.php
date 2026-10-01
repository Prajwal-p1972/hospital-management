<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Role extends Model
{
    protected $fillable = [
        'name',
        'display_name',
        'description',
        'is_active',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }
}