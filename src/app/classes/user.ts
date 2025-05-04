export class User {
  id: number;
  auth_id?: string;
  username: string;
  avatar_url?: string;
  created_at?: Date;
  last_login?: Date;

  constructor(data: Partial<User> = {}) {
    this.id = data.id || 0;
    this.auth_id = data.auth_id;
    this.username = data.username || '';
    this.avatar_url = data.avatar_url;
    this.created_at = data.created_at ? new Date(data.created_at) : undefined;
    this.last_login = data.last_login ? new Date(data.last_login) : undefined;
  }
}