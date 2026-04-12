<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Order;
use App\Services\EventRoomService;
use App\Services\SocketNotifier;
use Illuminate\Http\Request;
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

        $numTiquets = count($validated['tiquets']);

        $order = Order::create([
            'event_id' => $validated['event_id'],
            'email' => $validated['email'],
            'num_tiquets' => $numTiquets,
            'tiquets' => $validated['tiquets'],
            'status' => $validated['status'] ?? null,
        ]);

        return response()->json($order, 201);
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
