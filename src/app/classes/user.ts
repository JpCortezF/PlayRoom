export class User {
  id: number;
  auth_id?: string;
  username: string;
  name?: string;
  last_name?: string;
  age?: number;
  avatar_url?: string;

  constructor(data: Partial<User> = {}) {
    this.id = data.id || 0;
    this.auth_id = data.auth_id;
    this.username = data.username || '';
    this.name = data.name || '';
    this.last_name = data.last_name || '';
    this.age = data.age || 0;
    this.avatar_url = data.avatar_url;
  }
}