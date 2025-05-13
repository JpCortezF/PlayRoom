import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { GameType } from '../../classes/game_type';
import { DatabaseService } from '../../services/database.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.css'
})
export class RankingComponent {
  @Input() gameType: GameType | null = null;
  @Input() alreadySaved: boolean = false;
  ranking: any[] = [];
  loading = true;
  
  constructor(private db: DatabaseService) {}
  
  
  async ngOnInit() {
    await this.loadRanking();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['alreadySaved'] && !changes['alreadySaved'].firstChange) {
      this.loadRanking();
    }
  }
  
  async loadRanking() {
    try {
      this.loading = true;
      if (!this.gameType) {
        throw new Error('GameType is null');
      }
      const scores = await this.db.getTopScores(this.gameType.id, 5);
      
      // Obtenemos los usuarios en paralelo para mejor performance
      const users = await Promise.all(
        scores.map(score => this.db.getUserById(score.user_id))
      );
      this.ranking = scores.map((score, index) => {
      const user = users[index];
      const isMayorMenor = score.game_type_id === 2;
      const isAhorcado = score.game_type_id === 3;

      return {
        username: user?.username || 'Anónimo',
        score: score.score,
        game_type_id: score.game_type_id,
        // Campos condicionales
        correct_guesses: isMayorMenor ? score.metadata?.mayor_menor?.correct_guesses ?? '--' : undefined,
        streak: isMayorMenor ? score.metadata?.mayor_menor?.streak ?? '--' : undefined,
        time_seconds: isAhorcado ? score.metadata?.ahorcado?.time_seconds ?? '--' : undefined,
        errors: isAhorcado ? score.metadata?.ahorcado?.incorrect_guesses ?? '--' : undefined
      };
    });
    } catch (error) {
      console.error('Error loading ranking:', error);
    } finally {
      this.loading = false;
    }
  }
}
