import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const noAuthGuard: CanActivateFn = async (route, state) => {
  const auth = inject(AuthService);
    const router = inject(Router);
    const supabase = auth.sb.supabase;
  
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user && (state.url === '/login' || state.url === '/register')) {
      router.navigate(['/']);
      return false;
    }
    return true;
};
