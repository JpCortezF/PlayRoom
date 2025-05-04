import { Component, inject } from '@angular/core';
import { CardsComponent } from "../../components/home-components/cards/cards.component";
import { CarouselComponent } from "../../components/home-components/carousel/carousel.component";
 import { DatabaseService } from "../../services/database.service";
import { User } from '../../classes/user';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardsComponent, CarouselComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  db = inject(DatabaseService);

  constructor() {
    // this.db.getAllUsers();
    
  }
}
