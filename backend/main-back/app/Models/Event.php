<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = [
        'nom',
        'artista',
        'descripcio',
        'data',
        'apertures_portes',
        'hora_inici',
        'imatge',
        'sold_out',
        'tiquet_id',
    ];

    protected $casts = [
        'data' => 'datetime',
        'sold_out' => 'boolean',
    ];
    
    public function tiquet()
    {
        return $this->belongsTo(Tiquet::class);
    }
}
