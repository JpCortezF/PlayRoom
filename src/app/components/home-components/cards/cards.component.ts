import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.css'
})
export class CardsComponent {
  @Input() imageUrl: string = '';
  @Input() gameName: string = '';
  // @Output() cardClicked: new EventEmitter<string>();

  // onCardClick() {
  //   this.cardClicked.emit(this.gameName);
  // }
}
