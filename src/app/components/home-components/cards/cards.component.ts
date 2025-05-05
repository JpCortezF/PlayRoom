import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.css'
})
export class CardsComponent {
  @Input() imageUrl!: string;
  @Input() gameName!: string;
  @Input() gameRoute!: string;
}
