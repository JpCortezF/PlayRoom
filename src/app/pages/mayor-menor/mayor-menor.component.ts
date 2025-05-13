import { Component, inject, Output } from '@angular/core';
import { RankingComponent } from '../../components/ranking/ranking.component';
import { CommonModule } from '@angular/common';
import { GameType } from '../../classes/game_type';
import { DatabaseService } from '../../services/database.service';
import { UserService } from '../../services/user.service';
import { DeckService } from '../../services/deck.service';
import { take } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mayor-menor',
  standalone: true,
  imports: [RankingComponent, CommonModule],
  templateUrl: './mayor-menor.component.html',
  styleUrl: './mayor-menor.component.css'
})
export class MayorMenorComponent {
  @Output() alreadySaved = false;
  @Output() gameType: GameType | null = null;
  router = inject(Router);

  gameStarted: boolean = false;
  gameFinished: boolean = false;
  lives: number = 3;
  score: number = 0;
  currentCard: any = null;
  nextCard: any = null;
  loading: boolean = false;
  spin: boolean = false;
  correctGuesses: number = 0;
  currentStreak: number = 0;
  maxStreak: number = 0;

  constructor(private deckService: DeckService, private db: DatabaseService, private userService: UserService) {}

  async ngOnInit() {
    this.gameType = await this.db.getGameById(2);
  }

  async startGame() {
    this.gameStarted = true;
    this.gameFinished = false;
    this.lives = 3;
    this.score = 0;
    this.correctGuesses = 0;
    this.currentStreak = 0;
    this.maxStreak = 0;
    this.loading = false;
    
    await this.deckService.initDeck();
    this.currentCard = await this.deckService.drawCard();
    this.spin = true;
  }

  async guess(option: 'mayor' | 'menor') {
    if (this.loading || this.gameFinished) return;
    this.loading = true;

    this.nextCard = await this.deckService.drawCard();

    const valorActual = this.deckService.getCardValue(this.currentCard.value);
    const valorSiguiente = this.deckService.getCardValue(this.nextCard.value);

    const esMayor = valorSiguiente > valorActual;
    const esCorrecto = (option === 'mayor' && esMayor) || (option === 'menor' && !esMayor);

    if (esCorrecto) {
      this.correctGuesses++;
      this.currentStreak++;
      if (this.currentStreak > this.maxStreak) {
        this.maxStreak = this.currentStreak;
      }
      this.score += this.currentStreak > 3 ? 2 : 1;
    } else {
      this.lives--;
      this.currentStreak = 0;
    }

    if (this.lives <= 0) {
      this.currentCard = this.nextCard;
      this.finishGame();
      return;
    } else {
      this.currentCard = this.nextCard;
    }

    this.loading = false;
  }

  async finishGame() {
    this.gameFinished = true;
    
    this.userService.currentUser$.pipe(take(1)).subscribe(async (user) => {
      const scoreData = {
        user_id: user.id,
        game_type_id: 2,
        score: this.score,
        metadata: {
          mayor_menor: {
            correct_guesses: this.correctGuesses,
            streak: this.maxStreak
          }
        }
      };
      console.log('Datos del score:', scoreData);
      try {
        await this.db.saveUserScore(scoreData);
        this.alreadySaved = true;
        console.log('Resultado guardado exitosamente');
        this.showGameOverAlert();
      } catch (error) {
        console.error('Error al guardar el resultado:', error);
      }
    });
  }

  async restartGame() {
    await this.startGame();
  }

  showGameOverAlert(): void {
      Swal.fire({
        title: '¡Juego Terminado!',
        html: `
          <div class="text-center">
            <p class="text-2xl font-bold mb-4">Puntaje: <span class="text-blue-600">${this.score}</span></p>
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div class="bg-gray-100 p-3 rounded-lg">
                <p class="font-semibold">Predicciones acertadas</p>
                <p class="text-green-600 text-xl">${this.correctGuesses}</p>
              </div>
              <div class="bg-gray-100 p-3 rounded-lg">
                <p class="font-semibold">Racha máxima</p>
                <p class="text-purple-600 text-xl">${this.maxStreak}</p>
              </div>
            </div>
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
