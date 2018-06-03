import {CARD_ATLAS_KEY, CARD_HEIGHT, CARD_WIDTH, CardFactory} from "../Factories/cardFactory";
import {Deck} from "../models/deck";
import Text = Phaser.GameObjects.Text;
import {Hand} from "../models/hand";
import Texture = Phaser.Textures.Texture;
import {Card} from "../models/card";
import Scene = Phaser.Scene;
import Image = Phaser.GameObjects.Image;
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
  private textHit: Text;
  private textStay: Text;
  private resultText: Text;
  private cardImages: Image[];

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
    this.setUpTitle();
    this.setUpNewGame();
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
    this.setPlayerScoreText();
    this.playerScoreText.setX(400 - (this.playerScoreText.displayWidth * 0.5));
  }

  private setUpHitButton(): void{
    this.textHit = this.add.text(0, 500, 'Hit', this.textStyle);
    this.textHit.setX(200 - (this.textHit.displayWidth * 0.5));
    this.textHit.setInteractive();
    this.setUpHoverStyles(this.textHit);
    this.setUpClickHandler(this.textHit, this.handleHit);
  }

  private setUpStayButton(): void {
    this.textStay = this.add.text(0, 500, 'Stay', this.textStyle);
    this.textStay.setX(600 - (this.textStay.displayWidth * 0.5));

    this.textStay.setInteractive();
    this.setUpHoverStyles(this.textStay);
    this.setUpClickHandler(this.textStay, this.handleStay);
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
    this.setUpHitButton();
    this.setUpStayButton();
    this.setUpDealerScoreText();
    this.setUpPlayerScoreText();

    this.refreshDrawHands();
  }

  private setUpClickHandler(text: Text, handlerFunction: Function){
    let mainScene: MainScene = this;
    text.on('pointerdown', function () {
      handlerFunction(mainScene);
    });
  }

  private handleHit(mainScene: MainScene): void{
    mainScene.playerHand.receiveCard(mainScene.deck.drawCard());
    mainScene.refreshDrawHands();
    mainScene.setPlayerScoreText();
    if(mainScene.playerHand.getBlackjackScore() > 21) {
      mainScene.resultText = mainScene.add.text(0,0, 'BUST!', mainScene.textStyle);
      mainScene.textHit.destroy();
      mainScene.textStay.destroy();
      mainScene.setUpNewGameText();
    }
  }

  private handleStay(mainScene: MainScene): void {
    mainScene.textStay.destroy();
    mainScene.textHit.destroy();
    let dealerScore: number = mainScene.dealerHand.getBlackjackScore();
    let playerScore: number = mainScene.playerHand.getBlackjackScore();
    while( dealerScore < 17){
      mainScene.dealerHand.receiveCard(mainScene.deck.drawCard());
      mainScene.refreshDrawHands()
      mainScene.setDealerScoreText();
      dealerScore = mainScene.dealerHand.getBlackjackScore();
    }
    if(dealerScore > 21 || ( playerScore < 22 && playerScore > dealerScore)){
      mainScene.resultText = mainScene.add.text(0,0, 'WIN!', mainScene.textStyle);
    }
    else if(dealerScore === playerScore){
      mainScene.resultText = mainScene.add.text(0,0, 'Push', mainScene.textStyle);
    }
    else {
      mainScene.resultText = mainScene.add.text(0,0, 'Loss', mainScene.textStyle);
    }
    mainScene.setUpNewGameText();
  }

  private refreshDrawHands() {
    if(this.cardImages) {
      this.cardImages.forEach(function(cardImage: Image){
        cardImage.destroy();
      });
    }
    this.cardImages = [];

    this.drawHand(this.dealerHand, 400, 100);
    this.drawHand(this.playerHand, 400, 400);
  }

  private drawHand(hand: Hand, x: number, y: number, ) {

    let cards: Card[] = hand.getCards();
    let scene: MainScene = this;
    let cardMargin: number = this.CARD_MARGIN;
    cards.forEach(function(card: Card) {
      let cardImage = scene.add.image(x, y, CARD_ATLAS_KEY, card.getAtlasFrame()).setScale(0.5);
      x += cardImage.displayWidth + cardMargin;
      scene.cardImages.push(cardImage);
    });
  }

  private setDealerScoreText() {
    this.dealerScoreText.setText("Dealer: " + this.dealerHand.getBlackjackScore());
  }

  private setPlayerScoreText() {
    this.playerScoreText.setText("Player: " + this.playerHand.getBlackjackScore());
  }

  private setUpNewGameText() {
    let newGameText: Text = this.add.text(0, 500, 'New Game', this.textStyle);
    newGameText.setX(400 - (newGameText.displayWidth * 0.5));
    newGameText.setInteractive();
    this.setUpHoverStyles(newGameText);
    let mainScene: MainScene = this;
    newGameText.on('pointerdown', function () {
      newGameText.destroy();
      mainScene.dealerScoreText.destroy();
      mainScene.playerScoreText.destroy();
      mainScene.resultText.destroy();
      mainScene.setUpNewGame();
    });
  }
}