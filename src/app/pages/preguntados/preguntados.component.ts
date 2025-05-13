import { Component, Output } from '@angular/core';
import { RankingComponent } from '../../components/ranking/ranking.component';
import { CommonModule } from '@angular/common';
import { GameType } from '../../classes/game_type';
import { DatabaseService } from '../../services/database.service';
import { UserService } from '../../services/user.service';
import { QuizApiService } from '../../services/quiz-api.service';

@Component({
  selector: 'app-preguntados',
  standalone: true,
  imports: [RankingComponent, CommonModule],
  templateUrl: './preguntados.component.html',
  styleUrl: './preguntados.component.css'
})
export class PreguntadosComponent {
  @Output() alreadySaved = false;
  @Output() gameType: GameType | null = null;

  gameStarted: boolean = false;
  gameFinished: boolean = false;
  loading: boolean = false;

  lives: number = 3;
  score: number = 0;
  correctGuesses: number = 0;
  currentStreak: number = 0;
  maxStreak: number = 0;

  categories = [
  { title: 'Geografía', used: false },
  { title: 'Arte y Literatura', used: false },
  { title: 'Entretenimiento', used: false },
  { title: 'Ciencia y Naturaleza', used: false },
  { title: 'Deportes y Ocio', used: false },
  { title: 'Historia', used: false }
];

  constructor(private db: DatabaseService, private userService: UserService, private apiService: QuizApiService) {}

  async ngOnInit() {
    this.gameType = await this.db.getGameById(1);
  }

  startGame() {
    this.gameStarted = true;
    this.gameFinished = false;
  }

  restartGame() {
    this.gameStarted = false;
    this.gameFinished = false;
    this.lives = 3;
    this.score = 0;
    this.correctGuesses = 0;
    this.currentStreak = 0;
    this.maxStreak = 0;
  }

  selectCategory(category: any) {
    category.used = true;
    this.loadQuestions(category.title);
  }

  async loadQuestions(categoryTitle: string) {
    const questions = await this.apiService.getQuestionsByCategory(categoryTitle);
    console.log('Preguntas recibidas:', questions);
    // Lógica para mostrar preguntas al usuario...
  }
}
