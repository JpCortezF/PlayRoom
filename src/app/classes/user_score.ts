export class UserScore {
  id: number;
  user_id: number;
  game_type_id: number;
  score: number;
  metadata?: any;
  created_at?: Date;

  constructor(data: Partial<UserScore> = {}) {
    this.id = data.id || 0;
    this.user_id = data.user_id || 0;
    this.game_type_id = data.game_type_id || 0;
    this.score = data.score || 0;
    this.metadata = data.metadata;
    this.created_at = data.created_at ? new Date(data.created_at) : undefined;
  }
}