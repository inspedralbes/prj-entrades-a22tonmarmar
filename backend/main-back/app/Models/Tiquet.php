<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tiquet extends Model
{
    protected $fillable = [
        "preu_base",
        "preu_barricada",
        "preu_butaca",
    ];

    protected $casts = [
        "preu_base" => "decimal:2",
        "preu_barricada" => "decimal:2",
        "preu_butaca" => "decimal:2"
    ];
}
