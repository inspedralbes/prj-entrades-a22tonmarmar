<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\TiquetController;

Route::post('login', [AuthController::class, 'login']);

Route::get('/events', [EventController::class, 'index']);
Route::get('/events/sala/{nom}', [EventController::class, 'indexByName']);
Route::get('/events/{event}/room', [EventController::class, 'room']);
Route::get('/orders/event/{event}', [OrderController::class, 'ordersByEvent']);
Route::post('/events/{event}/orders/validate-reserve', [OrderController::class, 'validateReserve']);
Route::post('/events/{event}/orders/start-checkout', [OrderController::class, 'startCheckout']);
Route::post('/orders/{order}/confirm', [OrderController::class, 'confirm']);
Route::post('/orders/{order}/cancel', [OrderController::class, 'cancel']);

Route::middleware('auth:sanctum')->group(function () {
	Route::apiResource('events', EventController::class)->except(['index']);
	Route::apiResource('tiquets', TiquetController::class);
	Route::apiResource('orders', OrderController::class)->only(['store']);
	
});