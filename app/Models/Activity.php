<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'datetime',
        'end_datetime',
        'maps_url',
        'tiktok_url',
    ];

    protected $casts = [
        'datetime' => 'datetime',
        'end_datetime' => 'datetime',
    ];
}
