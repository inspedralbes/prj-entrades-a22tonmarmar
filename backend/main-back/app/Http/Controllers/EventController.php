<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Tiquet;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Event::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom_event' => 'required|string|max:255',
            'data_event' => 'required|date',
            'apertura_portes_event' => 'nullable|date_format:H:i',
            'inici_event' => 'nullable|date_format:H:i',
            'descripcio_event' => 'required|string',
            'imatge_event' => 'nullable|string',
            'sold_out' => 'boolean',
            'tiquet' => 'required|array',
            'tiquet.nom' => 'nullable|string',
            'tiquet.preu_base' => 'required|numeric|min:0',
            'tiquet.preu_barricada' => 'nullable|numeric|min:0',
            'tiquet.preu_butaca' => 'nullable|numeric|min:0',
        ]);

        $event = DB::transaction(function () use ($validated) {
            
            // A. Primero creamos el Tiquet
            $tiquetData = $validated['tiquet'];
            $tiquet = Tiquet::create($tiquetData);

            // B. Luego creamos el Evento asignándole el ID del tiquet recién creado
            // Quitamos la parte del tiquet del array validado para crear el evento limpio
            $eventData = collect($validated)->except(['tiquet'])->toArray();
            $eventData['tiquet_id'] = $tiquet->id;

            $event = Event::create($eventData);

            return $event;
        });

        return response()->json($event->load('tiquet'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return Event::with('tiquet')->findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $event = Event::findOrFail($id);

        $validated = $request->validate([
            'nom_event' => 'string|max:255',
            'data_event' => 'date',
            'apertura_portes_event' => 'nullable|date_format:H:i',
            'inici_event' => 'nullable|date_format:H:i',
            'descripcio_event' => 'string',
            'imatge_event' => 'nullable|string',
            'preu_base' => 'numeric|min:0',
            'sold_out' => 'boolean',
            'tiquet_id' => 'exists:tiquets,id',
        ]);

        $event->update($validated);

        return response()->json($event, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $event = Event::findOrFail($id);
        $event->delete();

        return response()->json(null, 204);
    }
}