export class GameType {
  id: number;
  name: string;
  description?: string;
  icon_url: string;
  route_path: string;

  constructor(data: Partial<GameType> = {}) {
    this.id = data.id || 0;
    this.name = data.name || '';
    this.description = data.description;
    this.icon_url = data.icon_url || 'default_game_icon.webp';
    this.route_path = data.route_path || '';
  }
}