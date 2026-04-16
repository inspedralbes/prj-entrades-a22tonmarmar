<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EventSeeder extends Seeder
{
    /**
     * Seed the application's event catalog.
     */
    public function run(): void
    {
        $now = now();

        $events = [
            [
                'nom' => 'Metrika - Radar Urbano Tour',
                'artista' => 'Metrika',
                'data' => '2026-06-12 21:30:00',
                'apertures_portes' => '20:00:00',
                'hora_inici' => '21:30:00',
                'descripcio' => 'Concert en sala de format mitja, amb un repertori centrat en la seva etapa urbana recent i col·laboracions locals.',
                'imatge' => '/images/events/metrika.jpg',
                'sold_out' => false,
                'tiquet' => [
                    'preu_base' => 28.00,
                    'preu_barricada' => 40.00,
                    'preu_butaca' => 35.00,
                ],
            ],
            [
                'nom' => 'Rob Zombie - Hellbilly Stage Night',
                'artista' => 'Rob Zombie',
                'data' => '2026-09-25 22:00:00',
                'apertures_portes' => '20:30:00',
                'hora_inici' => '22:00:00',
                'descripcio' => 'Show de metal industrial amb una posada en escena audiovisual potent, clàssics del seu catàleg i material de la gira mes recent.',
                'imatge' => '/images/events/rob-zombie.jpg',
                'sold_out' => false,
                'tiquet' => [
                    'preu_base' => 62.00,
                    'preu_barricada' => 95.00,
                    'preu_butaca' => 78.00,
                ],
            ],
            [
                'nom' => 'System Of a Down - Summer Riot',
                'artista' => 'System Of a Down',
                'data' => '2026-07-18 21:00:00',
                'apertures_portes' => '18:30:00',
                'hora_inici' => '21:00:00',
                'descripcio' => 'Data única en un gran recinte, amb repertori dels seus àlbums més icònics i una producció de gran format.',
                'imatge' => '/images/events/system-of-a-down.jpg',
                'sold_out' => true,
                'tiquet' => [
                    'preu_base' => 85.00,
                    'preu_barricada' => 130.00,
                    'preu_butaca' => 110.00,
                ],
            ],
        ];

        foreach ($events as $eventData) {
            $ticketData = $eventData['tiquet'];
            unset($eventData['tiquet']);

            // Creamos siempre un nuevo tiquet asociado al evento
            $tiquetId = DB::table('tiquets')->insertGetId([
                'preu_base' => $ticketData['preu_base'],
                'preu_barricada' => $ticketData['preu_barricada'],
                'preu_butaca' => $ticketData['preu_butaca'],
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            DB::table('events')->updateOrInsert(
                [
                    'nom' => $eventData['nom'],
                    'data' => $eventData['data'],
                ],
                array_merge($eventData, [
                    'tiquet_id' => $tiquetId,
                    'updated_at' => $now,
                    'created_at' => $now,
                ])
            );
        }
    }
}
