import { Component, inject } from '@angular/core';
import { CardsComponent } from "../../components/home-components/cards/cards.component";
import { CarouselComponent } from "../../components/home-components/carousel/carousel.component";
import { DatabaseService } from "../../services/database.service";
import { GameType } from '../../classes/game_type';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardsComponent, CarouselComponent,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  db = inject(DatabaseService);
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
}
