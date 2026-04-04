<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Order;
use Illuminate\Http\Request;

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
            'tiquets.*.butaca' => 'nullable|string|max:255',
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
