import { Component, inject, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { GameType } from '../../classes/game_type';
import { Router } from '@angular/router';
import { RankingComponent } from '../../components/ranking/ranking.component';
import { DatabaseService } from '../../services/database.service';
import { take } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-deftionary',
  standalone: true,
  imports: [RankingComponent, CommonModule],
  templateUrl: './deftionary.component.html',
  styleUrl: './deftionary.component.css'
})
export class DeftionaryComponent {
  @Output() alreadySaved = false;
  @Output() gameType: GameType | null = null;
  router = inject(Router);

  words: string[] = [
    'gato', 'martillo', 'canino', 'mesa', 'helicóptero', 'elefante', 'computadora', 'ventana', 'televisión', 'ahorcado', 'computadora', 'telefono', 'elefante', 'girasol', 'paraguas', 'helicoptero', 'chocolate', 'bicicleta', 'ventana',
    'ciudad', 'zapato', 'espejo', 'cámara', 'teléfono', 'piedra', 'camisa', 'ratón', 'teclado', 'escuela', 'hospital', 'biblioteca', 'restaurant', 'supermercado', 'doctor', 'maestro', 'ingeniero', 'musico', 'artista',
    'lámpara', 'escalera', 'cohete', 'montaña', 'barco', 'planeta', 'estrella', 'bosque', 'libro', 'futbol', 'basquetbol', 'tenis', 'natacion', 'ciclismo', 'piano', 'guitarra', 'tambor', 'violin', 'flauta',
    'tigre', 'león', 'moto', 'auto', 'tren', 'puerta', 'reloj', 'sol', 'luna', 'mar', 'río', 'pintura', 'escultura', 'fotografia', 'cine', 'teatro', 'jardin', 'jardinero', 'flores', 'arboles', 'plantas',
    'auricular', 'silla', 'caballo', 'madera', 'gallina', 'lápiz', 'pluma', 'pájaro', 'cielo', 'flor', 'lluvia', 'tormenta', 'arcoiris', 'nieve', 'viento', 'desierto', 'jungla', 'sabana', 'bosque', 'playa', 'volcan',
    'árbol', 'casa', 'banco', 'balde', 'mercado', 'pan', 'queso', 'leche', 'café', 'azúcar', 'terremoto', 'huracan', 'tornado', 'inundacion', 'dinosaurio', 'fosil', 'museo', 'historia', 'geografia',
    'sal', 'pimienta', 'fruta', 'nube', 'trueno', 'relámpago', 'pelota', 'vaso', 'billetera', 'jirafa', 'quimica', 'fisica', 'matematica', 'biologia', 'astronomia', 'galaxia', 'planeta', 'estrella', 'cometa', 'meteorito',
    'bicicleta', 'ratonera', 'botella', 'calendario', 'cama', 'carro', 'dragón', 'espejismo', 'castillo', 'doncella', 'caballero', 'dragon', 'magia', 'hada', 'duende', 'bruja', 'hechizo', 'varita', 'pirata', 'tesoro',
    'fuego', 'globo', 'huracán', 'iglesia', 'juguete', 'kilogramo', 'lavadora', 'mapa', 'naranja', 'isla', 'mapa', 'barco', 'robot', 'computador', 'internet', 'programacion', 'algoritmo', 'celular', 'camara', 'microfono', 'auricular', 'altavoz',
    'océano', 'pingüino', 'químico', 'revolución', 'serpiente', 'tortuga', 'unidad', 'viento', 'oscuridad', 'reloj', 'calendario', 'agenda', 'directorio', 'enciclopedia', 'diccionario', 'novela', 'poesia', 'cuento', 'historieta',
    'yate', 'zorro', 'águila', 'blanco', 'corazón', 'diamante', 'escritorio', 'fósil', 'glaciar', 'tenedor', 'pelota', 'rompecabezas', 'lego', 'consola', 'videojuego', 'balon', 'red', 'cancha', 'arco',
    'isla', 'poster', 'kiosco', 'lápida', 'mamut', 'nieve', 'orquesta', 'palmera', 'quimera', 'robot', 'ejercicio', 'gimnasio', 'pesas', 'yoga', 'pilates', 'correr', 'saltar', 'nadar', 'bailar', 'escalar',
    'satélite', 'tiburón', 'unicornio', 'volcán', 'whisky', 'sótano', 'granja', 'independiente', 'pincel', 'acuarela', 'oleo', 'carboncillo', 'acrilico', 'escenario', 'actuacion', 'director', 'guion', 'produccion'
  ];

  header: string = "Definición";
  currentWord = '';
  currentDefinition: string = '';
  feedbackMessage = '';
  buttonText = '';
  isDefinitionCorrect = false;
  gameStarted: boolean = false;
  loading: boolean = false;
  remainingLives = 3;
  score = 0;
  currentStreak = 0;
  maxStreak = 0;
  basePoints = 10;
  bonusPoints = 20;
  
  constructor(private db: DatabaseService, private userService: UserService, private http: HttpClient) {}

  async ngOnInit() {
    this.gameType = await this.db.getGameById(4);
  }

  startGame(): void {
  this.gameStarted = true;
  this.generateRandomWord();
}

generateRandomWord(): void {
  this.loading = true;
  const randomIndex = Math.floor(Math.random() * this.words.length);
  this.currentWord = this.words[randomIndex];
  console.log('Current word:', this.currentWord);
  
  this.isDefinitionCorrect = false;
  this.fetchDefinition(this.currentWord);
  this.feedbackMessage = '';
  this.buttonText = "Verificar";
}

fetchDefinition(word: string): void {
  const url = `https://es.wiktionary.org/w/api.php?action=query&format=json&origin=*&prop=extracts&titles=${word}&explaintext=true`;

  this.http.get<any>(url).subscribe({
    next: (response) => {
      const pages = response.query.pages;
      const pageId = Object.keys(pages)[0];
      const extract = pages[pageId].extract;
      this.currentDefinition = this.cleanDefinition(extract);
      this.header = "Definición";
      this.loading = false;
    },
    error: (error) => {
      console.error('Error fetching definition:', error);
      // Podríamos intentar con otra palabra si falla
      this.generateRandomWord();
    }
  });
}

cleanDefinition(extract: string): string {
  const regex = /\n1\s([\s\S]+?)(?=\n[2-9]|\n={2,}|\n==)/;
  const match = extract.match(regex);
  
  if (match) {
    let definition = match[1]
      .split(/Ejemplo:|Sinónimos?:|Sinónimo:|macho:|Hiperónimo:|Hiperónimos:/)[0]
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    return definition;
  }

  return 'No se pudo obtener la definición';
}

checkAnswer(userInput: string, inputElement: HTMLInputElement): void {
  if (this.buttonText === "Reiniciar") {
    this.resetGame();
    inputElement.value = '';
    return;
  }

  if (this.isDefinitionCorrect || this.buttonText === "Siguiente palabra") {
    this.generateRandomWord();
    inputElement.value = '';
    return;
  }

  const normalizedInput = this.normalizeText(userInput);
  const normalizedWord = this.normalizeText(this.currentWord);

  if (normalizedInput === normalizedWord) {
    this.handleCorrectAnswer();
  } else {
    this.handleIncorrectAnswer(inputElement);
  }
}

  normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }
  private handleCorrectAnswer(): void {
    this.currentStreak++;
    this.maxStreak = Math.max(this.maxStreak, this.currentStreak);
    
    // Calcular puntos con bonus por racha
    const pointsToAdd = this.currentStreak > 3 ? 20 : 10;
    this.score += pointsToAdd;
    
    this.isDefinitionCorrect = true;
    this.header = "¡Correcto!";
    
    // Mensaje especial si ganó bonus
    if (this.currentStreak > 3) {
      this.feedbackMessage = `¡Racha de ${this.currentStreak}! +${this.bonusPoints} puntos`;
    } else {
      this.feedbackMessage = '';
    }
    
    this.buttonText = "Siguiente palabra";
  }

  private handleIncorrectAnswer(inputElement: HTMLInputElement): void {
    this.currentStreak = 0;
    this.remainingLives--;
    this.header = "¡Incorrecto!";
    this.feedbackMessage = `La palabra era ${this.currentWord}`;
    this.buttonText = "Siguiente palabra";

    if (this.remainingLives <= 0) {
      this.finishGame(inputElement);
    }
  }

  async finishGame(inputElement: HTMLInputElement) {
    this.userService.currentUser$.pipe(take(1)).subscribe(async (user) => {  
      const scoreData = {
        user_id: user.id,
        game_type_id: this.gameType?.id,
        score: this.score,
        metadata: {
          deftionary: {
            words_guessed: this.score / this.basePoints,
            streak: this.maxStreak,
          }
        }
      };
      
      try {
        await this.db.saveUserScore(scoreData);
        this.alreadySaved = true;
        this.showGameOverAlert(inputElement);
      } catch (error) {
        console.error('Error al guardar el resultado:', error);
        this.showGameOverAlert(inputElement);
      }
    });
  }

  showGameOverAlert(inputElement: HTMLInputElement): void {
    Swal.fire({
      title: '¡Juego Terminado!',
      html: `
        <div class="text-center">
          <p class="text-2xl font-bold mb-4">Puntaje: <span class="text-blue-600">${this.score}</span></p>
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div class="bg-gray-100 p-3 rounded-lg">
              <p class="font-semibold">Palabras acertadas</p>
              <p class="text-green-600 text-xl">${Math.floor(this.score / this.basePoints)}</p>
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
        this.resetGame();
        inputElement.value = '';
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.router.navigate(['/']);
      }
    });
  }

  resetGame(): void {
    this.resetGameState();
    this.generateRandomWord();
  }

  private resetGameState(): void {
    this.remainingLives = 3;
    this.score = 0;
    this.currentStreak = 0;
    this.maxStreak = 0;
    this.isDefinitionCorrect = false;
    this.feedbackMessage = '';
    this.buttonText = "Verificar";
    this.alreadySaved = false;
    this.loading = false;
  }
}
