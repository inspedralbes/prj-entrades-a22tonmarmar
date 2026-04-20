<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\EventRoom;
use Illuminate\Database\Seeder;

class EventRoomSeeder extends Seeder
{
    /**
     * Crear registres d'estat de sala (event_room) per a tots els events
     * existents, amb l'aforament màxim (30 barricada, 70 pista) i totes
     * les butaques A1..A10 en "Disponible".
     */
    public function run(): void
    {
        $events = Event::all();

        foreach ($events as $event) {
            // Evitem duplicats si ja existeix un registre per aquest event
            EventRoom::firstOrCreate(
                ['event_id' => $event->id],
                [
                    'barricada_total' => 30,
                    'barricada_reserved' => 0,
                    'pista_total' => 70,
                    'pista_reserved' => 0,
                    'A1' => 'Disponible',
                    'A2' => 'Disponible',
                    'A3' => 'Disponible',
                    'A4' => 'Disponible',
                    'A5' => 'Disponible',
                    'A6' => 'Disponible',
                    'A7' => 'Disponible',
                    'A8' => 'Disponible',
                    'A9' => 'Disponible',
                    'A10' => 'Disponible',
                ],
            );
        }
    }
}
