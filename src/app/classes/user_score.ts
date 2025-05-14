type PreguntadosMetadata = {
  streak?: number;
  cant_categories?: number;
};

type MayorMenorMetadata = {
  correct_guesses: number;
  streak?: number;
};

type AhorcadoMetadata = {
  time_seconds: number;
  incorrect_guesses: number;
};

type DeftionaryMetadata = {
  words_guessed: number;
  streak?: number;
};

export class UserScore {
  id?: number;
  user_id: number;
  game_type_id: number;
  score?: number;
  created_at?: Date;
  metadata: {
    ahorcado?: AhorcadoMetadata;
    mayor_menor?: MayorMenorMetadata;
    preguntados?: PreguntadosMetadata;
    deftionary?: DeftionaryMetadata;
  } = {};

  constructor(data: Partial<UserScore> = {}) {
    if (data.id !== undefined && data.id !== 0) {
      this.id = data.id;
    }
    this.user_id = data.user_id || 0;
    this.game_type_id = data.game_type_id || 0;
    this.score = data.score;
    this.created_at = data.created_at;
    this.metadata = data.metadata || {};
  }
}