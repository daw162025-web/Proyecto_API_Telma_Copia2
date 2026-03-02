<?php

use App\Http\Controllers\CategoryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PetitionController;

Route::post('login', [AuthController::class, 'login'])->name('login');
Route::post('register', [AuthController::class, 'register']);

Route::middleware('auth:api')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('me', [AuthController::class, 'me']);
     Route::post('refresh', [AuthController::class, 'refresh']);
});

// RUTAS PÚBLICAS DE PETICIONES
Route::get('petitions', [PetitionController::class, 'index']); // Listar todas
Route::get('categories', [CategoryController::class, 'index']);

// RUTAS PROTEGIDAS DE PETICIONES (auth:api)
Route::middleware('auth:api')->group(function () {

    Route::get('petitions/mis-firmas', [PetitionController::class, 'mySignatures']);

    // 2. Crear (POST)
    Route::post('petitions', [PetitionController::class, 'store']);

    // 3. Actualizar (PUT)
    Route::put('petitions/{id}', [PetitionController::class, 'update']);

    // 4. Borrar (DELETE)
    Route::delete('petitions/{id}', [PetitionController::class, 'destroy']);

    // 5. Firmar (POST)
    Route::post('petitions/sign/{id}', [PetitionController::class, 'sign']);

});

Route::get('petitions/{id}', [PetitionController::class, 'show']); // Ver detalle
