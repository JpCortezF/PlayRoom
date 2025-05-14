import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

export const authGuard: CanActivateFn = async (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  await auth.authReady;
  
  const { data: { session } } = await auth.sb.supabase.auth.getSession();

  if (!session?.user) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
