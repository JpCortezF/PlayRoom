import { Component, inject, Output } from '@angular/core';
import { RankingComponent } from '../../components/ranking/ranking.component';
import { CommonModule } from '@angular/common';
import { GameType } from '../../classes/game_type';
import { DatabaseService } from '../../services/database.service';
import { UserService } from '../../services/user.service';
import { QuizApiService } from '../../services/quiz-api.service';
import { QuizInterface } from '../../interfaces/quiz-interface';
import { UserScore } from '../../classes/user_score';
import { take } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

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
  router = inject(Router);

  gameStarted: boolean = false;
  gameFinished: boolean = false;
  loading: boolean = false;
  showCategorySelection: boolean = false;

  lives: number = 3;
  score: number = 0;
  correctGuesses: number = 0;
  currentStreak: number = 0;
  maxStreak: number = 0;
  cantCategories: number = 0;

  categories = [
    { title: 'Geografía', used: false },
    { title: 'Arte y Literatura', used: false },
    { title: 'Entretenimiento', used: false },
    { title: 'Ciencia y Naturaleza', used: false },
    { title: 'Deportes y Ocio', used: false },
    { title: 'Historia', used: false }
  ];

  usedCategories: string[] = [];
  currentCategory: string | null = null;
  currentQuestionIndex = 0;
  questionsAnsweredInCurrentCategory = 0;
  currentQuestion: QuizInterface | null = null;
  currentOptions: string[] = [];
  correctAnswer: string = '';
  selectedAnswer: string = '';
  answerSelected: boolean = false;
  timeLeft: number = 30;
  timerInterval: any;

  constructor(private db: DatabaseService, private userService: UserService, private apiService: QuizApiService) {}

  async ngOnInit() {
    this.gameType = await this.db.getGameById(1);
  }

  startGame() {
    this.gameStarted = true;
    this.gameFinished = false;
    this.showCategorySelection = true;
  }

  restartGame() {
    this.gameStarted = false;
    this.gameFinished = false;
    this.lives = 3;
    this.score = 0;
    this.correctGuesses = 0;
    this.currentStreak = 0;
    this.maxStreak = 0;
    this.usedCategories = [];
    this.showCategorySelection = true;
  }

  handleCategoryCycle() {
    if (this.usedCategories.length === this.categories.length) {
      this.usedCategories = [];
      this.categories.forEach(category => category.used = false);
    }
    this.showCategorySelection = true;
  }

  selectCategory(category: any) {
    category.used = true;
    this.currentCategory = category.title;
    this.questionsAnsweredInCurrentCategory = 0;
    this.cantCategories++;
    this.loadQuestions(category.title);
  }

  loadQuestions(categoryTitle: string) {
  this.loading = true;
  
  const randomPage = Math.floor(Math.random() * 30) + 1;
  this.apiService.getQuestion(1, randomPage, categoryTitle).subscribe({
    next: (res) => {
      if(res.questions && res.questions.length > 0) {
        this.setCurrentQuestion(res.questions[0]);
        this.showCategorySelection = false;
      } else {
        console.warn('No se encontraron preguntas para esta categoría');
        this.handleCategoryCycle();
      }
      this.loading = false;
    },
    error: (err) => {
      console.error('Error cargando pregunta:', err);
      this.loading = false;
      this.handleCategoryCycle();
    }
  });
}

  setCurrentQuestion(question: QuizInterface) {    
    this.currentQuestion = question;
    this.correctAnswer = question.correctAnswers;
    this.selectedAnswer = '';
    this.answerSelected = false;

    const allOptions = [...question.incorrectAnswers, question.correctAnswers];
    this.currentOptions = this.shuffleOptions(allOptions);

    this.startTimer();
  }

  shuffleOptions(options: string[]): string[] {
    return options
      .map(option => ({ option, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ option }) => option);
  }

  startTimer() {
    this.timeLeft = 30;
    clearInterval(this.timerInterval);

    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        clearInterval(this.timerInterval);
        const randomOption = this.currentOptions[Math.floor(Math.random() * this.currentOptions.length)];
        this.handleAnswer(randomOption);
      }
    }, 1000);
  }

  handleAnswer(option: string) {
    if (this.answerSelected) return;

    clearInterval(this.timerInterval);
    this.selectedAnswer = option;
    this.answerSelected = true;

    const isCorrect = option === this.correctAnswer;
    if (isCorrect) {
      this.score += this.currentStreak >= 3 ? 2 : 1;
      this.correctGuesses++;
      this.currentStreak++;
      this.maxStreak = Math.max(this.maxStreak, this.currentStreak);
    } else {
      this.lives--;
      this.currentStreak = 0;
    }

    setTimeout(() => {
      this.questionsAnsweredInCurrentCategory++;

      if (this.lives <= 0) {
        this.finishGame();
        return;
      }

      if (this.questionsAnsweredInCurrentCategory >= 3) {
        if (this.currentCategory) {
          this.usedCategories.push(this.currentCategory);
        }
        this.handleCategoryCycle();
      } else {
        if (this.currentCategory) {
          this.loadQuestions(this.currentCategory);
        }
      }
    }, 1500);
  }

  async finishGame() {
    this.userService.currentUser$.pipe(take(1)).subscribe(async user => {
      const scoreData = new UserScore({
        user_id: user.id,
        game_type_id: this.gameType?.id,
        score: this.score * this.cantCategories,
        metadata: {
          preguntados: {
            streak: this.maxStreak,
            cant_categories: this.cantCategories
          }
        }
      });

      try {
        await this.db.saveUserScore(scoreData);
        this.gameFinished = true;
        this.alreadySaved = true;
        console.log('Resultado guardado');
        this.showGameOverAlert();
      } catch (err) {
        console.error('Error guardando score:', err);
        this.showGameOverAlert();
      }
    });
  }

  showGameOverAlert(): void {
    Swal.fire({
      title: '¡Juego Terminado!',
      html: `
        <div class="text-center">
          <p class="text-2xl font-bold mb-4">Puntaje: <span class="text-blue-600">${this.score * this.cantCategories}</span></p>
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div class="bg-gray-100 p-3 rounded-lg">
              <p class="font-semibold">Respuestas correctas</p>
              <p class="text-green-600 text-xl">${this.correctGuesses}</p>
            </div>
            <div class="bg-gray-100 p-3 rounded-lg">
              <p class="font-semibold">Racha máxima</p>
              <p class="text-purple-600 text-xl">${this.maxStreak}</p>
            </div>
          </div>
          <p class="text-sm text-gray-500">Categorías jugadas: ${this.cantCategories}</p>
        </div>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Jugar de nuevo',
      cancelButtonText: 'Volver al inicio',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      reverseButtons: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.restartGame();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.router.navigate(['/']);
      }
    });
  }
}
