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
        
        // 1. Create 'tiquets' table first (Events depends on this)
        Schema::create('tiquets', function (Blueprint $table) {
            $table->id();
            $table->string('nom')->nullable(); // Optional name for the ticket config
            $table->decimal('preu_base', 8, 2);
            $table->decimal('preu_barricada', 8, 2)->nullable();
            $table->decimal('preu_butaca', 8, 2)->nullable();
            $table->timestamps();
        });

        // 2. Create 'events' table
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('nom_event');
            $table->dateTime('data_event');
            $table->time('apertura_portes_event')->nullable();
            $table->time('inici_event')->nullable();
            $table->text('descripcio_event');
            $table->string('imatge_event')->nullable();
            $table->decimal('preu_base', 8, 2); // Base price specific to the event if needed
            $table->boolean('sold_out')->default(false);
            
            // Foreign Key to Tiquets
            $table->foreignId('tiquet_id')
                  ->constrained('tiquets')
                  ->onDelete('cascade'); // If ticket config is deleted, delete event? Or restrict?

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
        Schema::dropIfExists('tiquets');
    }
};
