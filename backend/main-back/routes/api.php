<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\TiquetController;

Route::post('login', [AuthController::class, 'login']);

Route::apiResource('events', EventController::class);
Route::apiResource('tiquets', TiquetController::class);
Route::apiResource('orders', OrderController::class)->only(['store']);
Route::get('orders/event/{event}', [OrderController::class, 'ordersByEvent']);