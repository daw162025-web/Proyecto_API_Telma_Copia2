import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service'; 

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Comprobamos si es admin usando el método que tengas en tu servicio
  if (authService.isAdmin()) {
    return true; 
  }
  // Si no es admin lo mandamos a la página principal
  router.navigate(['/']);
  return false; // Bloqueamos la navegación a la ruta /admin
};
