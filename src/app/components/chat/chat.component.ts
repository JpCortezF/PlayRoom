import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatabaseService } from '../../services/database.service';
import { UserService } from '../../services/user.service';
import { ChatMessage } from '../../classes/chat';

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
  groupedMessages: {date: string, messages: any[]}[] = [];

  constructor(private db: DatabaseService, private userService: UserService) {}

  ngOnInit() {
    this.loadInitialData();
  }

  private async loadInitialData() {
    this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
      console.log('initials:', user.initials);
      if (user) {
        this.welcomeMessage = `¡Hola ${user.username}, bienvenido al chat!`;
        this.loadMessages();
      } else {
        this.welcomeMessage = 'Por favor inicia sesión para chatear';
      }
    });
  }

  async loadMessages() {
    this.messages = await this.db.getMessages();
    this.groupMessagesByDate();
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
        this.message
      );
      
      this.message = '';
      await this.loadMessages();
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

  handleEnter(event: KeyboardEvent) {
    if (!event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  private groupMessagesByDate() {
    const groups: {[key: string]: any[]} = {};
    
    this.messages.forEach(msg => {
      const date = new Date(msg.created_at).toLocaleDateString('es-AR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
    });
    
    this.groupedMessages = Object.keys(groups).map(date => ({
      date,
      messages: groups[date]
    }));
  }
}
