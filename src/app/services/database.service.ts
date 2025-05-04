import { inject, Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { User } from '../classes/user';
import { ChatMessage } from '../classes/chat';
import { UserScore } from '../classes/user_score';
import { GameType } from '../classes/game_type';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  sb = inject(SupabaseService);
  
  // ==================== USERS CRUD ====================
  async getAllUsers(): Promise<User[]> {
    const { data } = await this.sb.supabase.from('users').select('*');
    return data?.map(u => new User(u)) || [];
  }
}
