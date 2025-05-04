export class ChatMessage {
  id: number;
  user_id?: number;
  message: string;
  is_system_message: boolean;
  created_at?: Date;

  constructor(data: Partial<ChatMessage> = {}) {
    this.id = data.id || 0;
    this.user_id = data.user_id;
    this.message = data.message || '';
    this.is_system_message = data.is_system_message || false;
    this.created_at = data.created_at ? new Date(data.created_at) : undefined;
  }
}