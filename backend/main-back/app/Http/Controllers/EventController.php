<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Tiquet;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
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
            'nom' => 'required|string|max:255',
            'artista' => 'nullable|string|max:255',
            'data' => 'required|date',
            'apertures_portes' => 'nullable|date_format:H:i',
            'hora_inici' => 'nullable|date_format:H:i',
            'descripcio' => 'required|string',
            'imatge' => 'nullable|image|max:2048',
            'sold_out' => 'boolean',
            'tiquet' => 'required|array',
            'tiquet.preu_base' => 'required|numeric|min:0',
            'tiquet.preu_barricada' => 'nullable|numeric|min:0',
            'tiquet.preu_butaca' => 'nullable|numeric|min:0',
        ]);

        $imagePath = null;
        if ($request->hasFile('imatge')) {
            $path = $request->file('imatge')->store('events', 'public');
            $imagePath = Storage::url($path);
        }

        $event = DB::transaction(function () use ($validated, $imagePath) {
            
            // A. Primero creamos el Tiquet
            $tiquetData = $validated['tiquet'];
            $tiquet = Tiquet::create($tiquetData);

            // B. Luego creamos el Evento asignándole el ID del tiquet recién creado
            // Quitamos la parte del tiquet del array validado para crear el evento limpio
            $eventData = collect($validated)->except(['tiquet', 'imatge'])->toArray();
            $eventData['tiquet_id'] = $tiquet->id;

            if ($imagePath) {
                $eventData['imatge'] = $imagePath;
            }

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
            'nom' => 'string|max:255',
            'artista' => 'nullable|string|max:255',
            'data' => 'date',
            'apertures_portes' => 'nullable|date_format:H:i',
            'hora_inici' => 'nullable|date_format:H:i',
            'descripcio' => 'string',
            'imatge' => 'nullable|image|max:2048',
            'preu_base' => 'numeric|min:0',
            'sold_out' => 'boolean',
            'tiquet_id' => 'exists:tiquets,id',
        ]);

        $imagePath = null;
        if ($request->hasFile('imatge')) {
            $path = $request->file('imatge')->store('events', 'public');
            $imagePath = Storage::url($path);
        }

        $data = collect($validated)->except(['imatge'])->toArray();
        if ($imagePath) {
            $data['imatge'] = $imagePath;
        }

        $event->update($data);

        return response()->json($event->fresh('tiquet'), 200);
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