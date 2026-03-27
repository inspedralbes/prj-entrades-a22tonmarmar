<?php
use App\Http\Controllers\EventController;
use App\Http\Controllers\TiquetController;

Route::apiResource('events', EventController::class);
Route::apiResource('tiquets', TiquetController::class);