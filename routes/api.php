<?php

use App\Http\Controllers\ActivityController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Activity CRUD - explicit routes
Route::get('/activities', [ActivityController::class, 'index']);
Route::post('/activities', [ActivityController::class, 'store']);
Route::get('/activities/{activity}', [ActivityController::class, 'show']);
Route::put('/activities/{activity}', [ActivityController::class, 'update']);
Route::patch('/activities/{activity}', [ActivityController::class, 'update']);
Route::delete('/activities/{activity}', [ActivityController::class, 'destroy']);