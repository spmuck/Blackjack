import {Card} from "./card";
/**
 * Created by sean on 5/30/2018.
 */
export class Hand{
  private cards: Card[];

  constructor(){
    this.emptyHand();
  }

  public receiveCard(card: Card){
    this.cards.push(card);
  }

  public emptyHand(){
    this.cards = [];
  }

  public getBlackjackScore(){
  }

  public getCards(): Card[]{
    return this.cards;
  }
}