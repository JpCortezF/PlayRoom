type UserData = {
  username: string;
  initials: string;
};

export class ChatMessage {
  id: number;
  user_id?: number;
  message: string;
  is_system_message: boolean;
  created_at?: Date;
  users?: UserData | UserData[];

  constructor(data: Partial<ChatMessage> = {}) {
    this.id = data.id || 0;
    this.user_id = data.user_id;
    this.message = data.message || '';
    this.is_system_message = data.is_system_message || false;
    this.created_at = data.created_at;
    if (Array.isArray(data.users)) {
      this.users = data.users[0];
    } else {
      this.users = data.users;
    }
  }
}