<?php

use App\Http\Controllers\AdminController;
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
Route::get('petitions', [PetitionController::class, 'index']);
Route::get('categories', [CategoryController::class, 'index']);

// RUTAS PROTEGIDAS DE PETICIONES
Route::middleware('auth:api')->group(function () {
    Route::get('petitions/my-signatures', [PetitionController::class, 'mySignatures']);
    Route::post('petitions', [PetitionController::class, 'store']);
    Route::put('petitions/{id}', [PetitionController::class, 'update']);
    Route::delete('petitions/{id}', [PetitionController::class, 'destroy']);
    Route::post('petitions/sign/{id}', [PetitionController::class, 'sign']);

});

// RUTAS DE ADMINISTRADOR
Route::middleware(['auth:api', 'is_admin'])->prefix('admin')->group(function () {
    // Listar todas las peticiones
    Route::get('/petitions', [AdminController::class, 'indexPetitions']);
    // Eliminar una petición
    Route::delete('/petitions/{id}', [AdminController::class, 'destroyPetition']);
    Route::get('/categories', [AdminController::class, 'indexCategories']);
    Route::delete('/categories/{id}', [AdminController::class, 'destroyCategory']);
});

Route::get('petitions/{id}', [PetitionController::class, 'show']);
