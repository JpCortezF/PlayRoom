import { Component, inject } from '@angular/core';
import { CardsComponent } from "../../components/home-components/cards/cards.component";
import { CarouselComponent } from "../../components/home-components/carousel/carousel.component";
import { DatabaseService } from "../../services/database.service";
import { Games } from '../../classes/games';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardsComponent, CarouselComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  databaseSerivice = inject(DatabaseService);

  constructor() {
    this.databaseSerivice.getAllGames();
    const game = new Games("League of legends", "2010-01-01");
    //game.id = 1;
    //this.databaseSerivice.insertGame(game);
    // this.databaseSerivice.modifyGame(game);
    //this.databaseSerivice.deleteGame(6);
  }
}
