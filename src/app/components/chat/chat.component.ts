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
  groupedMessages: {date: string, messages: any[]}[] = [];

  constructor(private db: DatabaseService, private userService: UserService) {}

  ngOnInit() {
    this.loadInitialData();
  }

  private async loadInitialData() {
    this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
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
        this.message,
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
    const groups: { [key: string]: any[] } = {};
  
    this.messages.forEach(msg => {
      const dateUTC = new Date(msg.created_at);
  
      // De UTC a UTC-3
      const dateLocal = new Date(dateUTC.getTime() - 3 * 60 * 60 * 1000);
  
      const dateLabel = dateLocal.toLocaleDateString('es-AR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
  
      // HH:mm
      msg.formattedTime = dateLocal.toLocaleTimeString('es-AR', {
        hour: '2-digit',
        minute: '2-digit'
      });
  
      if (!groups[dateLabel]) {
        groups[dateLabel] = [];
      }
  
      groups[dateLabel].push(msg);
    });
  
    this.groupedMessages = Object.keys(groups).map(date => ({
      date,
      messages: groups[date]
    }));
  }

  formatMessage(text: string): string {
    if (!text) return '';
  
    // Dividir el texto en líneas automáticas si es muy largo
    const maxLineLength = 40;
    const lines = text.split('\n');
  
    // Dividir cada línea más larga que maxLineLength
    const processedLines = lines.flatMap(line => {
      const words = line.split(' ');
      let currentLine = '';
      const result = [];
  
      words.forEach(word => {
        if ((currentLine + word).length > maxLineLength) {
          result.push(currentLine.trim());
          currentLine = word;
        } else {
          currentLine += ' ' + word;
        }
      });
  
      // Agregar la última línea
      if (currentLine.trim().length > 0) {
        result.push(currentLine.trim());
      }
  
      return result;
    });
  
    const isSingleLine = processedLines.length === 1;
  
    // Generar los <span> con clases adecuadas
    const spanLines = processedLines.map((line, index) => {
      // último renglón o al único renglón
      const className = isSingleLine || index === processedLines.length - 1 ? 'inline-block pr-12' : 'inline-block';
  
      // caracteres peligrosos
      const safeLine = line.replace(/</g, '<').replace(/>/g, '>');
  
      return `<span class="${className}">${safeLine}</span>`;
    });
  
    return spanLines.join('<br>');
  }
}
