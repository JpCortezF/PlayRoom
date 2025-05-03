import { inject, Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { User } from '@supabase/supabase-js';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  sb = inject(SupabaseService);
  currentUser: User | null = null;
  router = inject(Router);
  
  constructor() { 
    // Saber si el usuario ya está autenticado
    this.sb.supabase.auth.onAuthStateChange((event, session) => {
      if (session === null) {
        this.currentUser = null;
      }else{
        this.currentUser = session.user;
        this.router.navigate(['/']);
      }
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
