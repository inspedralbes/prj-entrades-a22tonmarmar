<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\TiquetController;

Route::post('login', [AuthController::class, 'login']);

Route::get('/events', [EventController::class, 'index']);
Route::get('/events/sala/{nom}', [EventController::class, 'indexByName']);
// Estat públic de la sala per a un event concret
Route::get('/events/{event}/room', [EventController::class, 'room']);

Route::middleware('auth:sanctum')->group(function () {
	Route::apiResource('events', EventController::class)->except(['index']);
	Route::apiResource('tiquets', TiquetController::class);
	Route::apiResource('orders', OrderController::class)->only(['store']);
	Route::get('orders/event/{event}', [OrderController::class, 'ordersByEvent']);
	Route::post('events/{event}/orders/validate-reserve', [OrderController::class, 'validateReserve']);
});