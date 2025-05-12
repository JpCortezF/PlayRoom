import { HttpClient } from '@angular/common/http';
import { Component, Output } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { UserService } from '../../services/user.service';
import { UserScore } from '../../classes/user_score';
import { RankingComponent } from "../../components/ranking/ranking.component";
import { CommonModule } from '@angular/common';
import { GameType } from '../../classes/game_type';

@Component({
  selector: 'app-ahorcado',
  standalone: true,
  imports: [RankingComponent, CommonModule],
  templateUrl: './ahorcado.component.html',
  styleUrl: './ahorcado.component.css'
})
export class AhorcadoComponent {
  // Lista de palabras para el juego
  private palabras: string[] = [
    'AHORCADO', 'COMPUTADORA', 'TELEFONO', 'ELEFANTE', 'GIRASOL', 
    'PARAGUAS', 'HELICOPTERO', 'CHOCOLATE', 'BICICLETA', 'VENTANA',
    'ESPEJO', 'LIBRERIA', 'CANGURO', 'MARIPOSA', 'TELEVISOR',
    'REFRIGERADOR', 'PANTALON', 'ZAPATILLA', 'SILLON', 'LAMPARA',
    'GALLETA', 'JIRAFA', 'PINGUINO', 'CASCADA', 'MONTANA',
    'OCEANO', 'PLATANO', 'NARANJA', 'MANZANA', 'SANDIA',
    'GLOBO', 'COHETE', 'AVION', 'TREN', 'BARCO',
    'PIZARRA', 'CUADERNO', 'LAPIZ', 'BORRADOR', 'REGLA',
    'ESCUELA', 'HOSPITAL', 'BIBLIOTECA', 'RESTAURANT', 'SUPERMERCADO',
    'DOCTOR', 'MAESTRO', 'INGENIERO', 'MUSICO', 'ARTISTA',
    'FUTBOL', 'BASQUETBOL', 'TENIS', 'NATACION', 'CICLISMO',
    'PIANO', 'GUITARRA', 'TAMBOR', 'VIOLIN', 'FLAUTA',
    'PINTURA', 'ESCULTURA', 'FOTOGRAFIA', 'CINE', 'TEATRO',
    'JARDIN', 'JARDINERO', 'FLORES', 'ARBOLES', 'PLANTAS',
    'LLUVIA', 'TORMENTA', 'ARCOIRIS', 'NIEVE', 'VIENTO',
    'DESIERTO', 'JUNGLA', 'SABANA', 'BOSQUE', 'PLAYA',
    'VOLCAN', 'TERREMOTO', 'HURACAN', 'TORNADO', 'INUNDACION',
    'DINOSAURIO', 'FOSIL', 'MUSEO', 'HISTORIA', 'GEOGRAFIA',
    'QUIMICA', 'FISICA', 'MATEMATICA', 'BIOLOGIA', 'ASTRONOMIA',
    'GALAXIA', 'PLANETA', 'ESTRELLA', 'COMETA', 'METEORITO',
    'CASTILLO', 'DONCELLA', 'CABALLERO', 'DRAGON', 'MAGIA',
    'HADA', 'DUENDE', 'BRUJA', 'HECHIZO', 'VARITA',
    'PIRATA', 'TESORO', 'ISLA', 'MAPA', 'BARCO',
    'ROBOT', 'COMPUTADOR', 'INTERNET', 'PROGRAMACION', 'ALGORITMO',
    'CELULAR', 'CAMARA', 'MICROFONO', 'AURICULAR', 'ALTAVOZ',
    'RELOJ', 'CALENDARIO', 'AGENDA', 'DIRECTORIO', 'ENCICLOPEDIA',
    'DICCIONARIO', 'NOVELA', 'POESIA', 'CUENTO', 'HISTORIETA',
    'PALOMITAS', 'HELADO', 'CHOCOLATE', 'CARAMELO', 'PASTEL',
    'GALLETA', 'PANQUEQUE', 'WAFFLE', 'JUGUETE', 'MUÑECA',
    'PELOTA', 'ROMPECABEZAS', 'LEGO', 'CONSOLA', 'VIDEOJUEGO',
    'BALON', 'RED', 'CANCHA', 'ARCO', 'PELOTA',
    'RAQUETA', 'PELOTA', 'GUANTE', 'CASCO', 'UNIFORME',
    'MEDALLA', 'TROFEO', 'PODIO', 'COMPETENCIA', 'CAMPEONATO',
    'EJERCICIO', 'GIMNASIO', 'PESAS', 'YOGA', 'PILATES',
    'CORRER', 'SALTAR', 'NADAR', 'BAILAR', 'ESCALAR',
    'VIAJAR', 'EXPLORAR', 'AVENTURA', 'SENDERISMO', 'CAMPING',
    'FOGATA', 'CARPA', 'MOCHILA', 'CANTIMPLORA', 'BINOCULARES',
    'PINCEL', 'ACUARELA', 'OLEO', 'CARBONCILLO', 'ACRILICO',
    'ESCENARIO', 'ACTUACION', 'DIRECTOR', 'GUION', 'PRODUCCION',
    'INSTRUMENTO', 'ORQUESTA', 'SINFONIA', 'MELODIA', 'ARMONIA'
  ];

  // Estado del juego
  currentWord: string = '';
  displayedWord: string[] = [];
  letters: string[] = 'A,B,C,D,E,F,G,H,I,J,K,L,M,N,Ñ,O,P,Q,R,S,T,U,V,W,X,Y,Z'.split(',');
  selectedLetters: string[] = [];
  letterStatus: { [key: string]: 'correct' | 'incorrect' | 'not-selected' } = {};
  
  // Estadísticas
  errors: number = 0;
  maxErrors: number = 8;
  gameFinished: boolean = false;
  @Output() gameWon: boolean = false;
  startTime: Date | null = null;
  endTime: Date | null = null;
  
  // UI
  hangmanImage: string = 'hangman0.webp';
  @Output() gameType: GameType | null = null;

  constructor(private db: DatabaseService, private userService: UserService) {}

  async ngOnInit() {
    this.initializeLetterStatus();
    this.gameType = await this.db.getGameById(3);
  }

  ngOnDestroy() {
    if (this.startTime && !this.endTime) {
      this.endTime = new Date();
      this.saveGameResult(false);
    }
  }

  private initializeLetterStatus() {
    this.letters.forEach(letter => {
      this.letterStatus[letter] = 'not-selected';
    });
  }

  startGame() {
    // Seleccionar palabra aleatoria
    const randomIndex = Math.floor(Math.random() * this.palabras.length);
    this.currentWord = this.palabras[randomIndex];
    
    // Inicializar estado del juego
    this.displayedWord = Array(this.currentWord.length).fill('_');
    this.selectedLetters = [];
    this.errors = 0;
    this.hangmanImage = 'hangman0.webp';
    this.gameFinished = false;
    this.gameWon = false;
    this.startTime = new Date();
    this.endTime = null;
    this.initializeLetterStatus();
  }

  selectLetter(letter: string) {
    if (this.gameFinished || this.letterStatus[letter] !== 'not-selected') {
      return;
    }

    this.selectedLetters.push(letter);
    
    if (this.currentWord.includes(letter)) {
      this.letterStatus[letter] = 'correct';
      this.updateDisplayedWord(letter);
      
      // Verificar si ganó
      if (!this.displayedWord.includes('_')) {
        this.gameWon = true;
        this.finishGame(true);
      }
    } else {
      this.letterStatus[letter] = 'incorrect';
      this.errors++;
      this.hangmanImage = `hangman${this.errors}.webp`;
      
      if (this.errors >= this.maxErrors) {
        this.finishGame(false);
      }
    }
  }

  updateDisplayedWord(letter: string) {
    for (let i = 0; i < this.currentWord.length; i++) {
      if (this.currentWord[i] === letter) {
        this.displayedWord[i] = letter;
      }
    }
  }

  finishGame(isWinner: boolean) {
    this.gameFinished = true;
    this.gameWon = isWinner;
    this.endTime = new Date();
    
    if (isWinner) {
      this.saveGameResult(true);
    }
  }

  async saveGameResult(won: boolean) {
    if (!won || !this.startTime || !this.endTime) return;

    const gameDuration = Math.round((this.endTime.getTime() - this.startTime.getTime()) / 1000);
    this.userService.currentUser$.subscribe(async currentUser => {
      const scoreData = new UserScore({
        user_id: currentUser.id,
        game_type_id: 3,
        score: this.calculateScore(gameDuration, this.errors),
        metadata: {
          ahorcado: {
            time_seconds: gameDuration,
            incorrect_guesses: this.errors          
          }
        }
      });
      console.log('Datos del score:', scoreData);
      try {
        await this.db.saveUserScore(scoreData);
        console.log('Resultado guardado exitosamente');
      } catch (error) {
        console.error('Error guardando resultado:', error);
      }
    });
  }

  private calculateScore(timeSeconds: number, errors: number): number {
    // Fórmula de ejemplo: 1000 puntos base - (tiempo en segundos * 2) - (errores * 30)
    return Math.max(100, 1000 - (timeSeconds * 2) - (errors * 30));
  }
}
