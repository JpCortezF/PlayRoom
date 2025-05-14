import { Component, inject } from '@angular/core';
import { CardsComponent } from "../../components/home-components/cards/cards.component";
import { CarouselComponent } from "../../components/home-components/carousel/carousel.component";
import { DatabaseService } from "../../services/database.service";
import { GameType } from '../../classes/game_type';
import { CommonModule } from '@angular/common';
import { ChatComponent } from "../../components/chat/chat.component";
import { AuthService } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardsComponent, CarouselComponent, CommonModule, ChatComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  db = inject(DatabaseService);
  auth = inject(AuthService)
  router = inject(Router);
  games: GameType[] = [];
  isLoading = true;

  async ngOnInit() {
    try {
      this.games = await this.db.getAllGames();
    } catch (error) {
      console.error('Error loading games:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async handleGameClick(route: string) {
    const { data: { session } } = await this.auth.sb.supabase.auth.getSession();

    if (!session?.user) {
      Swal.fire({
        title: '¡Ups!',
        text: 'Debes iniciar sesión para jugar.',
        icon: 'warning',
        background: '#1a1a2e',
        color: '#ffffff',
        confirmButtonColor: '#4f46e5',
        confirmButtonText: 'Iniciar sesión',
        iconColor: '#facc15',
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/login']);
        }
      });
      return;
    }

    this.router.navigate(['/games', route.toLowerCase()]);
  }
}
