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
  private gamesCache: GameType[] | null = null;

  // ==================== USERS ====================
  async getAllUsers(): Promise<User[]> {
    const { data } = await this.sb.supabase.from('users').select('*');
    return data?.map(u => new User(u)) || [];
  }

  async getUserById(id: number): Promise<User | null> {
    const { data } = await this.sb.supabase.from('users').select('*').eq('id', id).single();
    return data ? new User(data) : null;
  }

  async getUserByUsername(email: string): Promise<User | null> {
    const { data } = await this.sb.supabase.from('users').select('*').eq('username', email).single();
    return data ? new User(data) : null;
  }

  async createUser(userData: Partial<User>): Promise<User | null> {
    const { data, error } = await this.sb.supabase.from('users')
      .insert(userData)
      .select()
      .single();
  
    if (error) throw error;
    return data ? new User(data) : null;
  }

  // ==================== GAMES ====================
  async getAllGames(): Promise<GameType[]> {
    if (this.gamesCache) return this.gamesCache;
    
    const { data } = await this.sb.supabase.from('game_types').select('*').order('id', { ascending: true });
    this.gamesCache = data?.map(g => new GameType(g)) || [];
    return this.gamesCache;
  }

  async getGameById(id: number): Promise<GameType | null> {
    const { data } = await this.sb.supabase.from('game_types').select('*').eq('id', id).single();
    return data ? new GameType(data) : null;
  }

  async createGame(game: Partial<GameType>): Promise<GameType | null> {
    const { data } = await this.sb.supabase.from('game_types').insert(game).select().single();
    return data ? new GameType(data) : null;
  }

  // ==================== SCORES ====================
  async getAllScores(): Promise<UserScore[]> {
    const { data } = await this.sb.supabase.from('user_scores').select('*');
    return data?.map(s => new UserScore(s)) || [];
  }

  async getScoresByUser(userId: number): Promise<UserScore[]> {
    const { data } = await this.sb.supabase.from('user_scores').select('*').eq('user_id', userId);
    return data?.map(s => new UserScore(s)) || [];
  }

  async getScoresByGame(gameId: number): Promise<UserScore[]> {
    const { data } = await this.sb.supabase.from('user_scores').select('*').eq('game_type_id', gameId);
    return data?.map(s => new UserScore(s)) || [];
  }

  async createScore(score: Partial<UserScore>): Promise<UserScore | null> {
    const { data } = await this.sb.supabase.from('user_scores').insert(score).select().single();
    return data ? new UserScore(data) : null;
  }

  // ==================== CHAT ====================
  async getMessages() {
    const { data, error } = await this.sb.supabase.from('chat_messages').select('*').order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async sendUserMessage(userId: string, username: string, messageText: string) {
    const { data, error } = await this.sb.supabase.from('chat_messages')
      .insert({
        user_id: userId,
        username: username,
        message: messageText,
        is_system_message: false
      }).select().single();

    if (error) throw error;
    return data;
  }

  async getTopScores(limit = 10): Promise<UserScore[]> {
    const { data } = await this.sb.supabase.from('user_scores').select('*').order('score', { ascending: false }).limit(limit);
    return data?.map(s => new UserScore(s)) || [];
  }

  async getRecentMessages(limit = 30): Promise<ChatMessage[]> {
    const { data } = await this.sb.supabase.from('chat_messages').select('*').order('created_at', { ascending: false }).limit(limit);
    return data?.map(m => new ChatMessage(m)) || [];
  }
}
