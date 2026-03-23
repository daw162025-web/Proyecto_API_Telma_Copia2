<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Si no está logueado o su rol no es admin, le denegamos el paso con un error 403
        if (!auth()->check() || auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Acceso denegado. Se requieren permisos de administrador.'], 403);
        }

        // Si es admin, le dejamos pasar a la ruta que haya solicitado
        return $next($request);
    }
}
