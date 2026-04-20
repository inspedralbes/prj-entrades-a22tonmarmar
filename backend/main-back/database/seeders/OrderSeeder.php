<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\Order;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    /**
     * Seed demo orders with ticket information.
     */
    public function run(): void
    {
        // If there are no events, we can't create orders
        if (Event::count() === 0) {
            return;
        }

        $events = Event::take(3)->get();

        $ordersData = [];

        foreach ($events as $event) {
            $ordersData[] = [
                'event_id' => $event->id,
                'email' => 'alice.' . $event->id . '@example.com',
                'tiquets' => [
                    [
                        'type' => 'preu_base',
                        'butaca' => null,
                    ],
                    [
                        'type' => 'preu_barricada',
                        'butaca' => null,
                    ],
                ],
                'status' => 'confirmed',
            ];

            $ordersData[] = [
                'event_id' => $event->id,
                'email' => 'bob.' . $event->id . '@example.com',
                'tiquets' => [
                    [
                        'type' => 'preu_base',
                        'butaca' => null,
                    ],
                    [
                        'type' => 'preu_base',
                        'butaca' => null,
                    ],
                    [
                        'type' => 'preu_butaca',
                        'butaca' => 'B-05',
                    ],
                ],
                'status' => 'pending',
            ];
        }

        foreach ($ordersData as $data) {
            $tiquets = $data['tiquets'];
            $data['num_tiquets'] = count($tiquets);

            // We identify demo orders by event + email
            Order::updateOrCreate(
                [
                    'event_id' => $data['event_id'],
                    'email' => $data['email'],
                ],
                $data
            );
        }
    }
}
