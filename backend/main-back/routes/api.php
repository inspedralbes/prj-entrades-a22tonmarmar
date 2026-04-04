<?php
use App\Http\Controllers\EventController;
use App\Http\Controllers\TiquetController;
use App\Http\Controllers\OrderController;

Route::apiResource('events', EventController::class);
Route::apiResource('tiquets', TiquetController::class);
Route::apiResource('orders', OrderController::class)->only(['store']);
Route::get('orders/event/{event}', [OrderController::class, 'ordersByEvent']);