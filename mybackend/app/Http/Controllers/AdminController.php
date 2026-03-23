<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Petition;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    // Listar todas las peticiones para el panel
    public function indexPetitions()
    {
        // Traemos las peticiones con su categoría, el creador y los archivos
        $petitions = Petition::with(['category', 'user', 'files'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $petitions
        ], 200);
    }

    // Eliminar cualquier petición a la fuerza
    public function destroyPetition($id)
    {
        $petition = Petition::findOrFail($id);

        $petition->delete();

        return response()->json([
            'success' => true,
            'message' => 'Petición eliminada correctamente por el administrador.'
        ], 200);
    }

    public function indexCategories()
    {
        $categories = Category::with(['petitions'])
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json([
            'success' => true,
            'data' => $categories
        ],200);
    }

    public function destroyCategory($id){
        $category = Category::findOrFail($id);
        $category->delete();
        return response()->json([
            'success' => true,
            'message'=> 'Categoria eliminada correctamente por el administrador.'
        ], 200);
    }
}
