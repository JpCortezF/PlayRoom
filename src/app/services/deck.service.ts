import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeckService {
  private deckId: string = '';

  async initDeck(): Promise<void> {
    const res = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
    const data = await res.json();
    this.deckId = data.deck_id;
  }

  async drawCard(): Promise<any> {
    if (!this.deckId) throw new Error('Deck not initialized');
    const res = await fetch(`https://deckofcardsapi.com/api/deck/${this.deckId}/draw/?count=1`);
    const data = await res.json();
    return data.cards[0]; // contiene: value, image, suit, code
  }

  getCardValue(value: string): number {
    switch (value) {
      case 'ACE': return 14;
      case 'KING': return 13;
      case 'QUEEN': return 12;
      case 'JACK': return 11;
      default: return parseInt(value);
    }
  }
}
