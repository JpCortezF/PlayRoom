import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const supabase = auth.sb.supabase;
 
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    // Si no hay usuario, redirigir a login
    router.navigate(['/login']);
    return false;
  }

  return true;
};
