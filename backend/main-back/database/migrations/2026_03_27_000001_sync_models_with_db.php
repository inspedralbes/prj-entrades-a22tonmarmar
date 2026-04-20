<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Cambios en tabla events
        Schema::table('events', function (Blueprint $table) {
            // Renombrar campos
            $table->renameColumn('nom_event', 'nom');
            $table->renameColumn('data_event', 'data');
            $table->renameColumn('apertura_portes_event', 'apertures_portes');
            $table->renameColumn('inici_event', 'hora_inici');
            $table->renameColumn('descripcio_event', 'descripcio');
            $table->renameColumn('imatge_event', 'imatge');
            // Añadir campo artista si no existe
            if (!Schema::hasColumn('events', 'artista')) {
                $table->string('artista')->nullable()->after('nom');
            }
        });
        // Cambios en tabla tiquets: eliminar campo nom si existe
        Schema::table('tiquets', function (Blueprint $table) {
            if (Schema::hasColumn('tiquets', 'nom')) {
                $table->dropColumn('nom');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revertir cambios en tabla events
        Schema::table('events', function (Blueprint $table) {
            $table->renameColumn('nom', 'nom_event');
            $table->renameColumn('data', 'data_event');
            $table->renameColumn('apertures_portes', 'apertura_portes_event');
            $table->renameColumn('hora_inici', 'inici_event');
            $table->renameColumn('descripcio', 'descripcio_event');
            $table->renameColumn('imatge', 'imatge_event');
            if (Schema::hasColumn('events', 'artista')) {
                $table->dropColumn('artista');
            }
        });
        // Revertir cambios en tabla tiquets: volver a crear campo nom
        Schema::table('tiquets', function (Blueprint $table) {
            if (!Schema::hasColumn('tiquets', 'nom')) {
                $table->string('nom')->nullable()->after('id');
            }
        });
    }
};
