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
        Schema::create('event_room', function (Blueprint $table) {
            $table->id();

            $table->foreignId('event_id')
                ->constrained('events')
                ->onDelete('cascade');

            // Capacidades y reservas para zonas de pie
            $table->unsignedInteger('barricada_total')->default(30);
            $table->unsignedInteger('barricada_reserved')->default(0);
            $table->unsignedInteger('pista_total')->default(70);
            $table->unsignedInteger('pista_reserved')->default(0);

            // Diez butacas individuales A1..A10 con estado de texto
            $table->string('A1')->default('Disponible');
            $table->string('A2')->default('Disponible');
            $table->string('A3')->default('Disponible');
            $table->string('A4')->default('Disponible');
            $table->string('A5')->default('Disponible');
            $table->string('A6')->default('Disponible');
            $table->string('A7')->default('Disponible');
            $table->string('A8')->default('Disponible');
            $table->string('A9')->default('Disponible');
            $table->string('A10')->default('Disponible');

            $table->timestamps();

            $table->unique('event_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('event_room');
    }
};
