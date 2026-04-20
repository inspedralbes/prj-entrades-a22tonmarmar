<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventRoom;
use App\Models\Order;
use App\Services\EventRoomService;
use App\Services\SocketNotifier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'event_id' => 'required|exists:events,id',
            'email' => 'required|email',
            'tiquets' => 'required|array|min:1|max:6',
            'tiquets.*.type' => 'required|string|max:255',
            'tiquets.*.butaca' => [
                'nullable',
                'string',
                'max:255',
                function (string $attribute, $value, $fail) use ($request) {
                    if ($value === null || $value === '') {
                        return;
                    }

                    if (preg_match('/^tiquets\.(\d+)\.butaca$/', $attribute, $matches)) {
                        $index = (int) $matches[1];
                        $type = data_get($request->input('tiquets'), "$index.type");

                        if ($type !== 'preu_butaca') {
                            $fail('Només els tiquets de tipus "preu_butaca" poden tenir una butaca.');
                        }
                    }
                },
            ],
            'status' => 'nullable|string|max:50',
        ]);
        $event = Event::with('tiquet')->findOrFail($validated['event_id']);

        if (! $event->tiquet) {
            return response()->json([
                'message' => 'No es poden calcular els preus perquè l\'esdeveniment no té tiquet associat.',
            ], 422);
        }

        $baseTicket = $event->tiquet;

        $tiquets = $validated['tiquets'];
        $total = 0.0;

        foreach ($tiquets as $index => $ticket) {
            $type = $ticket['type'] ?? null;

            if ($type === 'preu_barricada') {
                $price = (float) $baseTicket->preu_barricada;
            } elseif ($type === 'preu_butaca') {
                $price = (float) $baseTicket->preu_butaca;
            } else {
                // Per defecte, utilitzem el preu base de pista
                $price = (float) $baseTicket->preu_base;
            }

            $tiquets[$index]['price'] = $price;
            $total += $price;
        }

        $numTiquets = count($tiquets);

        $order = Order::create([
            'event_id' => $validated['event_id'],
            'email' => $validated['email'],
            'num_tiquets' => $numTiquets,
            'tiquets' => $tiquets,
            // La compra que ve del front s'entén com a completada
            'status' => $validated['status'] ?? 'completed',
        ]);

        // Retornem únicament les dades que el front necessita per a la pantalla de confirmació
        return response()->json([
            'id' => $order->id,
            'tiquets' => $tiquets,
            'total' => round($total, 2),
        ], 201);
    }

    /**
     * Inicia el procés de checkout: valida i reserva les places i crea una comanda en tràmit.
     */
    public function startCheckout(Request $request, Event $event, EventRoomService $roomService, SocketNotifier $socketNotifier)
    {
        Log::info('[FLOW][back] startCheckout - incoming request', [
            'event_id_route' => $event->id,
            'body' => $request->all(),
        ]);

        $validated = $request->validate([
            'barricada' => 'nullable|integer|min:0',
            'pista' => 'nullable|integer|min:0',
            'butaques' => 'nullable|array',
            'butaques.*' => 'string|in:A1,A2,A3,A4,A5,A6,A7,A8,A9,A10',
        ]);

        Log::info('[FLOW][back] startCheckout - validated data', [
            'event_id' => $event->id,
            'validated' => $validated,
        ]);

        try {
            $result = $roomService->validateAndReserve($event, $validated);
        } catch (\RuntimeException $e) {
            Log::warning('[FLOW][back] startCheckout - business error', [
                'event_id' => $event->id,
                'validated' => $validated,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }

        /** @var EventRoom $room */
        $room = $result['room'];
        /** @var Event $updatedEvent */
        $updatedEvent = $result['event'];

        // Construïm el detall de tiquets en funció de la selecció feta
        $requestedBarricada = (int) ($validated['barricada'] ?? 0);
        $requestedPista = (int) ($validated['pista'] ?? 0);
        $requestedSeats = $validated['butaques'] ?? [];

        $tiquets = [];

        for ($i = 0; $i < $requestedBarricada; $i++) {
            $tiquets[] = ['type' => 'barricada'];
        }

        for ($i = 0; $i < $requestedPista; $i++) {
            $tiquets[] = ['type' => 'pista'];
        }

        foreach ($requestedSeats as $seat) {
            $tiquets[] = [
                'type' => 'butaca',
                'butaca' => $seat,
            ];
        }

        $numTiquets = count($tiquets);

        // Creem una comanda en tràmit. L'email definitiu es rebrà a la confirmació.
        $order = Order::create([
            'event_id' => $updatedEvent->id,
            'email' => 'pending@example.local',
            'num_tiquets' => $numTiquets,
            'tiquets' => $tiquets,
            'status' => 'en_tramite',
        ]);

        Log::info('[FLOW][back] startCheckout - order created', [
            'event_id' => $updatedEvent->id,
            'order_id' => $order->id,
            'num_tiquets' => $numTiquets,
        ]);

        // Notificar al servidor de sockets (no bloquejant)
        Log::info('[FLOW][back] startCheckout - calling SocketNotifier', [
            'event_id' => $updatedEvent->id,
        ]);
        $socketNotifier->notifyRoomUpdated($updatedEvent, $room);

        Log::info('[FLOW][back] startCheckout - returning response', [
            'event_id' => $updatedEvent->id,
            'order_id' => $order->id,
        ]);

        return response()->json([
            'success' => true,
            'event_id' => $updatedEvent->id,
            'order_id' => $order->id,
            'sold_out' => (bool) $updatedEvent->sold_out,
            'room' => $room,
        ]);
    }

    /**
     * Valida una petició de reserva i, si és possible, actualitza l'estat de la sala.
     */
    public function validateReserve(Request $request, Event $event, EventRoomService $roomService, SocketNotifier $socketNotifier)
    {
        Log::info('[FLOW][back] validateReserve - incoming request', [
            'event_id_route' => $event->id,
            'body' => $request->all(),
        ]);

        $validated = $request->validate([
            'barricada' => 'nullable|integer|min:0',
            'pista' => 'nullable|integer|min:0',
            'butaques' => 'nullable|array',
            'butaques.*' => 'string|in:A1,A2,A3,A4,A5,A6,A7,A8,A9,A10',
        ]);

        Log::info('[FLOW][back] validateReserve - validated data', [
            'event_id' => $event->id,
            'validated' => $validated,
        ]);

        try {
            $result = $roomService->validateAndReserve($event, $validated);
        } catch (\RuntimeException $e) {
            Log::warning('[FLOW][back] validateReserve - business error', [
                'event_id' => $event->id,
                'validated' => $validated,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }

        $room = $result['room'];
        $updatedEvent = $result['event'];

        Log::info('[FLOW][back] validateReserve - after service', [
            'event_id' => $updatedEvent->id,
            'sold_out' => (bool) $updatedEvent->sold_out,
            'room' => $room->toArray(),
        ]);

        // Notificar al servidor de sockets (no bloquejant)
        Log::info('[FLOW][back] validateReserve - calling SocketNotifier', [
            'event_id' => $updatedEvent->id,
        ]);
        $socketNotifier->notifyRoomUpdated($updatedEvent, $room);

        Log::info('[FLOW][back] validateReserve - returning response', [
            'event_id' => $updatedEvent->id,
        ]);

        return response()->json([
            'success' => true,
            'event_id' => $updatedEvent->id,
            'sold_out' => (bool) $updatedEvent->sold_out,
            'room' => $room,
        ]);
    }

    /**
     * Confirma una comanda en tràmit: valida dades de client i marca les butaques com a venudes.
     */
    public function confirm(Request $request, Order $order, SocketNotifier $socketNotifier)
    {
        if ($order->status !== 'en_tramite') {
            return response()->json([
                'success' => false,
                'message' => 'La comanda no està en tràmit o ja ha estat processada.',
            ], 409);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'surname' => 'nullable|string|max:255',
            'email' => 'required|email',
            'card_number' => 'required|string|min:12|max:19',
            'card_expiry' => 'required|string|max:7',
            'card_cvv' => 'required|string|min:3|max:4',
        ]);

        return DB::transaction(function () use ($order, $validated, $socketNotifier) {
            /** @var Event $event */
            $event = Event::findOrFail($order->event_id);

            /** @var EventRoom $room */
            $room = EventRoom::where('event_id', $event->id)
                ->lockForUpdate()
                ->firstOrFail();

            $tiquets = $order->tiquets ?? [];
            $butacaSeats = [];

            foreach ($tiquets as $ticket) {
                if (($ticket['type'] ?? null) === 'butaca' && !empty($ticket['butaca'] ?? null)) {
                    $butacaSeats[] = $ticket['butaca'];
                }
            }

            // Comprovem que totes les butaques associades a aquesta comanda segueixen estant reservades
            foreach ($butacaSeats as $seat) {
                if (!\in_array($seat, ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10'], true)) {
                    continue;
                }

                if ($room->{$seat} !== 'Reservado') {
                    return response()->json([
                        'success' => false,
                        'message' => "La butaca {$seat} ja no està en estat reservat.",
                    ], 409);
                }
            }

            // Marquem les butaques com a venudes
            foreach ($butacaSeats as $seat) {
                if (!\in_array($seat, ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10'], true)) {
                    continue;
                }

                $room->{$seat} = 'Vendido';
            }

            $room->save();

            // Recalcular estat sold_out en base a la sala actual
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
            } else {
                $event->sold_out = false;
            }

            $event->save();

            // Carreguem informació de preus del tiquet associat
            $event->load('tiquet');

            if (! $event->tiquet) {
                return response()->json([
                    'success' => false,
                    'message' => 'No es poden calcular els preus perquè l\'esdeveniment no té tiquet associat.',
                ], 422);
            }

            $baseTicket = $event->tiquet;

            // Enriquim els tiquets amb preu i mapegem els tipus per al front
            $pricedTickets = [];
            $total = 0.0;

            foreach ($tiquets as $ticket) {
                $type = $ticket['type'] ?? null;

                if ($type === 'barricada') {
                    $mappedType = 'preu_barricada';
                    $price = (float) $baseTicket->preu_barricada;
                } elseif ($type === 'butaca') {
                    $mappedType = 'preu_butaca';
                    $price = (float) $baseTicket->preu_butaca;
                } else {
                    // Per defecte, utilitzem el preu base de pista
                    $mappedType = 'preu_base';
                    $price = (float) $baseTicket->preu_base;
                }

                $pricedTickets[] = [
                    'type' => $mappedType,
                    'butaca' => $ticket['butaca'] ?? null,
                    'price' => $price,
                ];

                $total += $price;
            }

            // Actualitzem la comanda amb l'email definitiu, l'estat i el detall de tiquets enriquit
            $order->email = $validated['email'];
            $order->status = 'completado';
            $order->tiquets = $pricedTickets;
            $order->save();

            // Notificar al servidor de sockets
            $socketNotifier->notifyRoomUpdated($event->fresh(), $room->fresh());

            return response()->json([
                'success' => true,
                'id' => $order->id,
                'tiquets' => $pricedTickets,
                'total' => round($total, 2),
            ]);
        });
    }

    /**
     * Cancel·la una comanda en tràmit: allibera les places reservades i elimina la comanda.
     */
    public function cancel(Order $order, SocketNotifier $socketNotifier)
    {
        if ($order->status !== 'en_tramite') {
            return response()->json([
                'success' => false,
                'message' => 'La comanda no està en tràmit o ja ha estat processada.',
            ], 409);
        }

        return DB::transaction(function () use ($order, $socketNotifier) {
            /** @var Event $event */
            $event = Event::findOrFail($order->event_id);

            /** @var EventRoom $room */
            $room = EventRoom::where('event_id', $event->id)
                ->lockForUpdate()
                ->firstOrFail();

            $tiquets = $order->tiquets ?? [];

            $barricadaCount = 0;
            $pistaCount = 0;
            $butacaSeats = [];

            foreach ($tiquets as $ticket) {
                $type = $ticket['type'] ?? null;
                if ($type === 'barricada') {
                    $barricadaCount++;
                } elseif ($type === 'pista') {
                    $pistaCount++;
                } elseif ($type === 'butaca' && !empty($ticket['butaca'] ?? null)) {
                    $butacaSeats[] = $ticket['butaca'];
                }
            }

            if ($barricadaCount > 0) {
                $room->barricada_reserved = max(0, $room->barricada_reserved - $barricadaCount);
            }

            if ($pistaCount > 0) {
                $room->pista_reserved = max(0, $room->pista_reserved - $pistaCount);
            }

            foreach ($butacaSeats as $seat) {
                if (!\in_array($seat, ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10'], true)) {
                    continue;
                }

                if ($room->{$seat} === 'Reservado') {
                    $room->{$seat} = 'Disponible';
                }
            }

            $room->save();

            // Recalcular estat sold_out en base a la sala actual
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
            } else {
                $event->sold_out = false;
            }

            $event->save();

            $orderId = $order->id;
            $order->delete();

            // Notificar al servidor de sockets
            $socketNotifier->notifyRoomUpdated($event->fresh(), $room->fresh());

            return response()->json([
                'success' => true,
                'order_id' => $orderId,
            ]);
        });
    }

    /**
     * Display a listing of the orders for a given event.
     */
    public function ordersByEvent(Event $event)
    {
        $orders = Order::where('event_id', $event->id)
            ->orderByDesc('created_at')
            ->get();

        return response()->json($orders);
    }
}
