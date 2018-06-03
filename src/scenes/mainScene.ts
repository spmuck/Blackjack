import {CARD_ATLAS_KEY, CARD_HEIGHT, CARD_WIDTH, CardFactory} from "../Factories/cardFactory";
import {Deck} from "../models/deck";
import Text = Phaser.GameObjects.Text;
import {Hand} from "../models/hand";
import Texture = Phaser.Textures.Texture;
import {Card} from "../models/card";
import Scene = Phaser.Scene;
/**
 * Created by sean on 5/29/2018.
 */
export class MainScene extends Phaser.Scene {
  private textStyle = {
    font: "normal 48px Arial",
    fill: '#000000',
  };
  private dealerHand: Hand;
  private playerHand: Hand;
  private deck: Deck;
  private atlasTexture: Texture;
  private CARD_MARGIN = 10;
  private dealerScoreText: Text;
  private playerScoreText: Text;

  constructor() {
    super({
      key: "MainScene"
    });
  }

  preload(): void {
    let cardFactory: CardFactory = new CardFactory(this, './assets/playingCards.png', './assets/playingCards.xml');
    this.atlasTexture = this.textures.get(CARD_ATLAS_KEY);
  }

  create(): void {
    this.setUpNewGame();
    this.setUpTitle();
    this.setUpHitButton();
    this.setUpStayButton();
    this.setUpDealerScoreText();
    this.setUpPlayerScoreText();

    var x = 0 + CARD_WIDTH/4;
    var y = 0 + CARD_HEIGHT/4;

    this.drawHand(this.dealerHand, 400, 100);
    this.drawHand(this.playerHand, 400, 400);
    // for (let i = deck.getDeckSize() - 1; i > 0; i--) {
    //   {
    //     if (x > (800 - CARD_WIDTH / 4)) {
    //       x = CARD_WIDTH/4;
    //       y += CARD_HEIGHT/2;
    //     }
    //     let frame = deck.drawCard().getAtlasFrame();
    //     let cardImage = this.add.image(x, y, CARD_ATLAS_KEY, frame).setScale(0.5);
    //     cardImage.setInteractive();
    //     cardImage.on('pointerover', function () {
    //
    //       this.setTint(Math.random() * 16000000);
    //     });
    //     console.log(frame);
    //     x+= cardImage.displayWidth;
    //   }
    // }




  }


  private setUpTitle(): void {
    let textTitle: Text = this.add.text(0, 0, 'BlackJack', this.textStyle);
    textTitle.setX(400 - (textTitle.displayWidth * 0.5))
  }

  private setUpDealerScoreText(): void {
    this.dealerScoreText = this.add.text(0, 200, '', this.textStyle);
    this.setDealerScoreText();
    this.dealerScoreText.setX(400 - (this.dealerScoreText.displayWidth * 0.5));
  }

  private setUpPlayerScoreText(): void {
    this.playerScoreText = this.add.text(0, 300, '', this.textStyle);
    this.setPlayerScoreText()
    this.playerScoreText.setX(400 - (this.playerScoreText.displayWidth * 0.5));
  }

  private setUpHitButton(): void{
    let textHit: Text = this.add.text(0, 500, 'Hit', this.textStyle);
    textHit.setX(200 - (textHit.displayWidth * 0.5));
    textHit.setInteractive();
    this.setUpHoverStyles(textHit);
    this.setUpClickHandler(textHit, this.handleHit);
  }

  private setUpStayButton(): void {
    let textStay: Text = this.add.text(0, 500, 'Stay', this.textStyle);
    textStay.setX(600 - (textStay.displayWidth * 0.5));

    textStay.setInteractive();
    this.setUpHoverStyles(textStay);
    this.setUpClickHandler(textStay, this.handleStay);
  }

  private setUpHoverStyles(text: Text){
    text.on('pointerover', function () {

      text.setColor('red');
    });
    text.on('pointerout', function () {

      text.setColor('black');
    });
  }

  private setUpNewGame(){
    this.deck = new Deck();
    this.dealerHand =  new Hand();
    this.playerHand= new Hand();
    this.dealerHand.receiveCard(this.deck.drawCard());
    this.playerHand.receiveCard(this.deck.drawCard());
    this.playerHand.receiveCard(this.deck.drawCard());
  }

  private setUpClickHandler(text: Text, handlerFunction: Function){
    let mainScene: MainScene = this;
    text.on('pointerdown', function () {
      handlerFunction(mainScene);
    });
  }

  private handleHit(mainScene: MainScene): void{
    mainScene.playerHand.receiveCard(mainScene.deck.drawCard());
    mainScene.drawHand(mainScene.playerHand, 400, 400);
    mainScene.setPlayerScoreText();
    if(mainScene.playerHand.getBlackjackScore() > 21) {
      mainScene.add.text(0,0, 'BUST!', mainScene.textStyle);
    }
  }

  private handleStay(mainScene: MainScene): void {
    let dealerScore: number = mainScene.dealerHand.getBlackjackScore();
    let playerScore: number = mainScene.playerHand.getBlackjackScore();
    while( dealerScore < 17){
      mainScene.dealerHand.receiveCard(mainScene.deck.drawCard());
      mainScene.drawHand(mainScene.dealerHand, 400, 100);
      mainScene.setDealerScoreText();
      dealerScore = mainScene.dealerHand.getBlackjackScore();
    }
    if(dealerScore > 21 || ( playerScore < 22 && playerScore > dealerScore)){
      mainScene.add.text(0,0, 'WIN!', mainScene.textStyle);
    }
    else if(dealerScore === playerScore){
      mainScene.add.text(0,0, 'Push', mainScene.textStyle);
    }
    else {
      mainScene.add.text(0,0, 'YOU LOSE FOOL', mainScene.textStyle);
    }

  }

  private drawHand(hand: Hand, x: number, y: number, ) {
    let cards: Card[] = hand.getCards();
    let scene: Scene = this;
    let cardMargin: number = this.CARD_MARGIN;
    cards.forEach(function(card: Card) {
      let cardImage = scene.add.image(x, y, CARD_ATLAS_KEY, card.getAtlasFrame()).setScale(0.5);
      x += cardImage.displayWidth + cardMargin;
    });
  }

  private setDealerScoreText() {
    this.dealerScoreText.setText("Dealer: " + this.dealerHand.getBlackjackScore());
  }

  private setPlayerScoreText() {
    this.playerScoreText.setText("Player: " + this.playerHand.getBlackjackScore());
  }
}