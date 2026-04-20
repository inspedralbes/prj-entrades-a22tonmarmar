<?php

namespace App\Services;

use App\Models\Event;
use App\Models\EventRoom;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class EventRoomService
{
    /**
     * Valida una petición de reserva para un evento y, si es posible,
     * actualiza el estado de la sala (event_room) marcando plazas como reservadas.
     *
     * @param Event $event
     * @param array $data
     * @return array{room: EventRoom, event: Event}
     *
     * @throws \RuntimeException cuando no hay disponibilidad suficiente
     */
    public function validateAndReserve(Event $event, array $data): array
    {
        return DB::transaction(function () use ($event, $data) {
            /** @var EventRoom $room */
            $room = EventRoom::where('event_id', $event->id)
                ->lockForUpdate()
                ->firstOrFail();

            Log::info('[FLOW][back] EventRoomService.before', [
                'event_id' => $event->id,
                'room' => $room->toArray(),
                'data' => $data,
            ]);

            $requestedBarricada = (int) ($data['barricada'] ?? 0);
            $requestedPista = (int) ($data['pista'] ?? 0);
            $requestedSeats = $data['butaques'] ?? [];

            // 1. Validar disponibilidad zonas de pie
            $availableBarricada = $room->barricada_total - $room->barricada_reserved;
            $availablePista = $room->pista_total - $room->pista_reserved;

            if ($requestedBarricada > $availableBarricada) {
                throw new \RuntimeException('No hi ha prou places disponibles a la zona de barricada.');
            }

            if ($requestedPista > $availablePista) {
                throw new \RuntimeException('No hi ha prou places disponibles a la zona de pista.');
            }

            // 2. Validar disponibilidad de butaques A1..A10
            foreach ($requestedSeats as $seat) {
                if (!\in_array($seat, ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10'], true)) {
                    throw new \RuntimeException('Butaca no vàlida seleccionada.');
                }

                if ($room->{$seat} !== 'Disponible') {
                    throw new \RuntimeException("La butaca {$seat} ja no està disponible.");
                }
            }

            // 3. Aplicar reserva: actualizar contadores y marcar butaques com a "Reservat"
            if ($requestedBarricada > 0) {
                $room->barricada_reserved += $requestedBarricada;
            }

            if ($requestedPista > 0) {
                $room->pista_reserved += $requestedPista;
            }

            foreach ($requestedSeats as $seat) {
                $room->{$seat} = 'Reservado';
            }

            $room->save();

            // 4. Comprobar si l'esdeveniment ha quedat esgotat (sold_out)
            $remainingBarricada = $room->barricada_total - $room->barricada_reserved;
            $remainingPista = $room->pista_total - $room->pista_reserved;

            $anyAvailableSeat = false;
            foreach (['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10'] as $seat) {
                if ($room->{$seat} === 'Disponible') {
                    $anyAvailableSeat = true;
                    break;
                }
            }

            if ($remainingBarricada <= 0 && $remainingPista <= 0 && !$anyAvailableSeat) {
                $event->sold_out = true;
                $event->save();
            }
            $freshRoom = $room->fresh();
            $freshEvent = $event->fresh();

            Log::info('[FLOW][back] EventRoomService.after', [
                'event_id' => $freshEvent->id,
                'sold_out' => (bool) $freshEvent->sold_out,
                'room' => $freshRoom->toArray(),
            ]);

            return [
                'room' => $freshRoom,
                'event' => $freshEvent,
            ];
        });
    }
}
