<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'event_id',
        'email',
        'num_tiquets',
        'tiquets',
        'status',
    ];

    protected $casts = [
        'tiquets' => 'array',
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}
