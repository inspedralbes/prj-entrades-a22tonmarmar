<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventRoom extends Model
{
    protected $table = 'event_room';

    protected $fillable = [
        'event_id',
        'barricada_total',
        'barricada_reserved',
        'pista_total',
        'pista_reserved',
        'A1',
        'A2',
        'A3',
        'A4',
        'A5',
        'A6',
        'A7',
        'A8',
        'A9',
        'A10',
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}
