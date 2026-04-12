<?php

namespace App\Services;

use App\Models\Event;
use App\Models\EventRoom;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SocketNotifier
{
    /**
     * Notifica al servidor de sockets que l'estat de la sala d'un event ha canviat.
     * Aquesta crida és tolerant a errors: si falla, només es registra al log.
     */
    public function notifyRoomUpdated(Event $event, EventRoom $room): void
    {
        $baseUrl = config('services.sockets.base_url');
        Log::info('[FLOW][back] SocketNotifier.base_url', [
            'base_url' => $baseUrl,
        ]);

        if (!$baseUrl) {
            Log::warning('[FLOW][back] SocketNotifier - missing base_url, skipping HTTP notify');
            return;
        }

        $url = rtrim($baseUrl, '/') . '/events/' . $event->id . '/room-updated';

        $payload = [
            'event_id' => $event->id,
            'sold_out' => (bool) $event->sold_out,
            'room' => [
                'barricada_total' => $room->barricada_total,
                'barricada_reserved' => $room->barricada_reserved,
                'pista_total' => $room->pista_total,
                'pista_reserved' => $room->pista_reserved,
                'A1' => $room->A1,
                'A2' => $room->A2,
                'A3' => $room->A3,
                'A4' => $room->A4,
                'A5' => $room->A5,
                'A6' => $room->A6,
                'A7' => $room->A7,
                'A8' => $room->A8,
                'A9' => $room->A9,
                'A10' => $room->A10,
            ],
        ];

        try {
            Log::info('[FLOW][back] SocketNotifier.notifyRoomUpdated - sending payload', [
                'url' => $url,
                'payload' => $payload,
            ]);

            $response = Http::post($url, $payload);

            Log::info('[FLOW][back] SocketNotifier.notifyRoomUpdated - response', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
        } catch (\Throwable $e) {
            Log::warning('Error enviant notificació al servidor de sockets', [
                'url' => $url,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
