import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private authService: AuthService, private dbService: DatabaseService) {
    this.initializeUser();
  }

  private async initializeUser() {
    this.authService.currentUser$.subscribe(async (authUser) => {
      if (!authUser) {
        this.currentUserSubject.next(null);
        return;
      }

      try {
        const emailSplit = authUser.email?.split('@')[0] || '';
        const userFromDb = await this.dbService.getUserByUsername(emailSplit);
        
        if (userFromDb) {
          const completeUser = {
            id: userFromDb.id,
            email: authUser.email,
            username: userFromDb.username || emailSplit,
            avatar_url: userFromDb.initials,
            name: userFromDb.name || '',
            initials: userFromDb.initials || 'US',
          };
          
          this.currentUserSubject.next(completeUser);
        }
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
        this.currentUserSubject.next(null);
      }
    });
  }

}
