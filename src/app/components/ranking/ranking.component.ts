import { CommonModule } from '@angular/common';
import { Component, inject, Input, SimpleChanges } from '@angular/core';
import { GameType } from '../../classes/game_type';
import { DatabaseService } from '../../services/database.service';
import { ActivatedRoute } from '@angular/router';

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
  route = inject(ActivatedRoute);
  ranking: any[] = [];
  allGameTypes: GameType[] = [];
  selectedGameTypeId: number | null = null;
  loading = true;
  
  constructor(private db: DatabaseService) {}
  
  
  async ngOnInit() {
    if (this.route.snapshot.routeConfig?.path === 'stats') {
      this.allGameTypes = await this.db.getAllGameTypes();
      this.selectedGameTypeId = this.allGameTypes[0]?.id || null;
      this.loadRanking();
    } 
    else if (this.gameType) {
      await this.loadRanking();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['alreadySaved'] && !changes['alreadySaved'].firstChange) {
      this.loadRanking();
    }
  }
  
  async onGameTypeChange(event: any) {
    this.selectedGameTypeId = Number(event.target.value);
    await this.loadRanking();
  }

  async loadRanking() {
    try {
      this.loading = true;
      if (!this.gameType) {
        throw new Error('GameType is null');
      }
      const scores = await this.db.getTopScores(this.gameType.id, 5);  
      const users = await Promise.all(
        scores.map(score => this.db.getUserById(score.user_id))
      );

      this.ranking = scores.map((score, index) => {
      const user = users[index];
      const isPreguntados = score.game_type_id === 1;
      const isMayorMenor = score.game_type_id === 2;
      const isAhorcado = score.game_type_id === 3;
      const isDeftionary = score.game_type_id === 4;

      return {
        username: user?.username || 'Anónimo',
        score: score.score,
        game_type_id: score.game_type_id,
        // Campos condicionales
        max_streak: isPreguntados ? score.metadata?.preguntados?.streak ?? '--' : undefined,
        cant_categories: isPreguntados ? score.metadata?.preguntados?.cant_categories ?? '--' : undefined,
        correct_guesses: isMayorMenor ? score.metadata?.mayor_menor?.correct_guesses ?? '--' : undefined,
        streak: isMayorMenor ? score.metadata?.mayor_menor?.streak ?? '--' : undefined,
        time_seconds: isAhorcado ? score.metadata?.ahorcado?.time_seconds ?? '--' : undefined,
        errors: isAhorcado ? score.metadata?.ahorcado?.incorrect_guesses ?? '--' : undefined,
        words_guessed: isDeftionary ? score.metadata?.deftionary?.words_guessed ?? '--' : undefined,
        max_streak_deftionary: isDeftionary ? score.metadata?.deftionary?.streak ?? '--' : undefined,
      };
    });
    } catch (error) {
      console.error('Error loading ranking:', error);
    } finally {
      this.loading = false;
    }
  }
}
