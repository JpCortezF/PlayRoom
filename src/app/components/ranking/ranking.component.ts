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
  @Input() gameWon: boolean = false;
  ranking: any[] = [];
  loading = true;
  
  constructor(private db: DatabaseService) {}
  
  
  async ngOnInit() {
    await this.loadRanking();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['gameWon'] && !changes['gameWon'].firstChange) {
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
      this.ranking = scores.map((score, index) => ({
        username: users[index]?.username || 'Anónimo',
        score: score.score,
        time_seconds: score.metadata?.ahorcado?.time_seconds || '--',
        errors: score.metadata?.ahorcado?.incorrect_guesses || '--',
        game_type_id: score.game_type_id
      }));
    } catch (error) {
      console.error('Error loading ranking:', error);
    } finally {
      this.loading = false;
    }
  }

  // columns: { key: string; label: string; align?: 'left' | 'right' | 'center' }[] = [];


  // ngOnInit(): void {
  //   this.setColumns();
  // }

  // setColumns(): void {
  //   this.columns = [
  //     { key: 'username', label: 'Usuario', align: 'left' },
  //     { key: 'score', label: 'Puntuación', align: 'center' },
  //   ];

  //   if (this.gameType?.name === 'Ahorcado') {
  //     this.columns.push(
  //       { key: 'time_seconds', label: 'Tiempo', align: 'center' },
  //       { key: 'errors', label: 'Errores', align: 'center' }
  //     );
  //   } else if (this.gameType?.name === 'Mayor Menor') {
  //     this.columns.push(
  //       { key: 'correct_guesses', label: 'Correctas', align: 'center' },
  //       { key: 'total_cards', label: 'Cartas', align: 'center' },
  //       { key: 'streak', label: 'Racha', align: 'center' }
  //     );
  //   }
  // }

  // getColumns(): { key: string; label: string; align?: 'left' | 'right' | 'center' }[] {
  //   return this.columns;
  // }

  // getProperty(item: any, key: string): any {
  //   if (key === 'time_seconds') {
  //     return item.time_seconds !== '--' ? `${item.time_seconds}s` : '--';
  //   } else if (key === 'errors') {
  //     return item.errors;
  //   } else if (key === 'correct_guesses') {
  //     return item.metadata?.mayor_menor?.correct_guesses || '--';
  //   } else if (key === 'total_cards') {
  //     return item.metadata?.mayor_menor?.total_cards || '--';
  //   } else if (key === 'streak') {
  //     return item.metadata?.mayor_menor?.streak || '--';
  //   }
  //   return item[key];
  // }
}
