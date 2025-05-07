import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatabaseService } from '../../services/database.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  showChat = false;
  message = '';
  messages: any[] = [];
  welcomeMessage = '';
  currentUser: any;

  constructor(
    private db: DatabaseService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
      console.log('Usuario actual:', this.currentUser);
      if (user) {
        // Mensaje de bienvenida local (no se guarda en BD)
        this.welcomeMessage = `¡Hola ${user.username}, bienvenido al chat!`;
        this.loadMessages();
      }
    });
  }

  async loadMessages() {
    this.messages = await this.db.getMessages();
    this.scrollToBottom();
  }

  toggleChat() {
    this.showChat = !this.showChat;
    if (this.showChat) {
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  async sendMessage() {
    if (!this.message.trim() || !this.currentUser) return;

    try {
      await this.db.sendUserMessage(
        this.currentUser.id,
        this.currentUser.username,
        this.message
      );
      
      this.message = '';
      await this.loadMessages(); // Recargar mensajes
    } catch (error) {
      console.error('Error enviando mensaje:', error);
    }
  }

  private scrollToBottom() {
    setTimeout(() => {
      const chatContainer = document.querySelector('.overflow-y-auto');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 50);
  }
}
