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
    if (this.isStatsPage()) {
      await this.loadGameTypes();
      this.selectedGameTypeId = this.allGameTypes[0]?.id || null;
      this.loadRanking();
    } 
    else if (this.gameType) {
      await this.loadRanking();
    }
  }

  isStatsPage(): boolean {
    return this.route.snapshot.routeConfig?.path === 'stats';
  }

  async loadGameTypes() {
    this.allGameTypes = await this.db.getAllGameTypes();
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

  getSelectedGameName(): string {
    if (!this.selectedGameTypeId || !this.allGameTypes.length) return '';
    const game = this.allGameTypes.find(g => g.id === this.selectedGameTypeId);
    return game?.name || '';
  }

  async loadRanking() {
    try {
      this.loading = true;
      const gameTypeId = this.selectedGameTypeId || this.gameType?.id;
      
      if (!gameTypeId) {
        this.ranking = [];
        return;
      }
      
      const scores = await this.db.getTopScores(gameTypeId, 5);
      const users = await Promise.all(
        scores.map(score => this.db.getUserById(score.user_id))
      );
      
      this.ranking = scores.map((score, index) => ({
        username: users[index]?.username || 'Anónimo',
        score: score.score,
        game_type_id: score.game_type_id,
        ...this.getGameSpecificFields(score)
      }));
    } catch (error) {
      console.error('Error loading ranking:', error);
      this.ranking = [];
    } finally {
      this.loading = false;
    }
  }

  private getGameSpecificFields(score: any): any {
    const metadata = score.metadata || {};
    const gameTypeId = score.game_type_id;
    
    switch(gameTypeId) {
      case 1:
        return {
          max_streak: metadata.preguntados?.streak ?? '--',
          cant_categories: metadata.preguntados?.cant_categories ?? '--'
        };
      case 2:
        return {
          correct_guesses: metadata.mayor_menor?.correct_guesses ?? '--',
          streak: metadata.mayor_menor?.streak ?? '--'
        };
      case 3:
        return {
          time_seconds: metadata.ahorcado?.time_seconds ?? '--',
          errors: metadata.ahorcado?.incorrect_guesses ?? '--'
        };
      case 4:
        return {
          words_guessed: metadata.deftionary?.words_guessed ?? '--',
          max_streak_deftionary: metadata.deftionary?.streak ?? '--'
        };
      default:
        return {};
    }
  }
}
