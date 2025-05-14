import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

export const noAuthGuard: CanActivateFn = async (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const user = await firstValueFrom(auth.currentUser$);

  if (user) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
