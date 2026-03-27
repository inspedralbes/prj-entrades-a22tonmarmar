<?php

namespace App\Http\Controllers;

use App\Models\Tiquet;
use Illuminate\Http\Request;

class TiquetController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Tiquet::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'preu_base' => 'required|numeric|min:0',
            'preu_barricada' => 'required|numeric|min:0',
            'preu_butaca' => 'required|numeric|min:0',
        ]);

        $tiquet = Tiquet::create($validated);

        return response()->json($tiquet, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return Tiquet::findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $tiquet = Tiquet::findOrFail($id);

        $validated = $request->validate([
            'preu_base' => 'required|numeric|min:0',
            'preu_barricada' => 'required|numeric|min:0',
            'preu_butaca' => 'required|numeric|min:0',
        ]);

        $tiquet->update($validated);

        return response()->json($tiquet, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $tiquet = Tiquet::findOrFail($id);
        $tiquet->delete();

        return response()->json(null, 204);
    }
}