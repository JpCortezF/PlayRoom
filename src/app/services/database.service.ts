import { inject, Injectable } from '@angular/core';
import { Games } from '../classes/games';
import { SupabaseService } from './supabase.service';
@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  sb = inject(SupabaseService);
  constructor() {}

   async getAllGames() {
    const { data, error } = await this.sb.supabase.from('games').select('*');
    const games = data as Games[];
   }

   async insertGame(game: Games) {
    const { data, error } = await this.sb.supabase.from('games').insert(game);
   }

   async modifyGame(game: Games) {
    const { data, error } = await this.sb.supabase.from('games').update(game).eq('id', game.id);
   }

   async deleteGame(id: number) {
    const { data, error } = await this.sb.supabase.from('games').delete().eq('id', id);
   }
}
