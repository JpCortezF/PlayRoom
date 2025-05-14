import { inject, Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { User } from '@supabase/supabase-js';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  sb = inject(SupabaseService);
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  router = inject(Router);
  authReady = this.initializeAuth();
  
  constructor() { 
    // Saber si el usuario ya está autenticado
    this.initializeAuth();
  }

  private async initializeAuth(): Promise<void> {
    const { data: { session } } = await this.sb.supabase.auth.getSession();
    this.currentUserSubject.next(session?.user || null);

    return new Promise<void>((resolve) => {
      const { data: listener } = this.sb.supabase.auth.onAuthStateChange((_event, session) => {
        this.currentUserSubject.next(session?.user || null);
        resolve();
      });

      setTimeout(() => resolve(), 1000);
    });
  }

  async register(email: string, password: string) {
    const { data, error } = await this.sb.supabase.auth.signUp({ email, password });
    return { data, error };
  }

  async login(email: string, password: string) {
    const { data, error } = await this.sb.supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  }

  async logout() {
    const { error } = await this.sb.supabase.auth.signOut();
    return { error };
  }

}
