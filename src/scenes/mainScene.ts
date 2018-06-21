import {CARD_ATLAS_KEY, CardFactory} from "../Factories/cardFactory";
import {Deck} from "../models/deck";
import {Hand} from "../models/hand";
import {Card} from "../models/card";
import Text = Phaser.GameObjects.Text;
import Texture = Phaser.Textures.Texture;
import Image = Phaser.GameObjects.Image;
import {textStyle} from "../constants/constants";

/**
 * Created by sean on 5/29/2018.
 */
export class MainScene extends Phaser.Scene {
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
  private moneyText: Text;
  private cardImages: Image[];
  private money: number = 1000;
  private bet: number = 0;

  constructor() {
    super({
      key: "MainScene"
    });
  }

  preload(): void {
    let cardFactory: CardFactory = new CardFactory(this, './assets/playingCards.png', './assets/playingCards.xml');
    this.atlasTexture = this.textures.get(CARD_ATLAS_KEY);
    alert(this.scene.get('BetScene').data.get('money'));
  }

  create(): void {
    this.setUpTitle();
    this.setUpMoneyText();
    this.promptBet();
  }


  private setUpTitle(): void {
    let textTitle: Text = this.add.text(0, 0, 'BlackJack', textStyle);
    textTitle.setX(400 - (textTitle.displayWidth * 0.5))
  }

  private setUpMoneyText(): void{
    this.moneyText = this.add.text(600, 0, '', textStyle);
    this.moneyText.setFontSize(24);
    this.updateMoneyText();
  }

  private updateMoneyText(): void{
    this.moneyText.setText('Money: $' + this.money);
  }

  private setUpDealerScoreText(): void {
    this.dealerScoreText = this.add.text(0, 200, '', textStyle);
    this.setDealerScoreText();
    this.dealerScoreText.setX(400 - (this.dealerScoreText.displayWidth * 0.5));
  }

  private setUpPlayerScoreText(): void {
    this.playerScoreText = this.add.text(0, 300, '', textStyle);
    this.setPlayerScoreText();
    this.playerScoreText.setX(400 - (this.playerScoreText.displayWidth * 0.5));
  }

  private setUpHitButton(): void{
    this.textHit = this.add.text(0, 500, 'Hit', textStyle);
    this.textHit.setX(200 - (this.textHit.displayWidth * 0.5));
    this.textHit.setInteractive();
    this.setUpHoverStyles(this.textHit);
    this.setUpClickHandler(this.textHit, this.handleHit);
  }

  private setUpStayButton(): void {
    this.textStay = this.add.text(0, 500, 'Stay', textStyle);
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

  private promptBet() {
    let mainScene: MainScene = this;
    if(mainScene.bet > mainScene.money) mainScene.bet = mainScene.money;
    let betPrompt = this.add.text(0, 400, '', textStyle);
    this.updateBetText(betPrompt);
    let add1 = this.add.text(0,500, '$1', textStyle);
    add1.setInteractive();
    let add25 = this.add.text(100, 500, '$25', textStyle);
    add25.setInteractive();
    let add100 = this.add.text(240, 500, '$100', textStyle);
    add100.setInteractive()
    let clearBet = this.add.text(500, 500, 'Clear', textStyle);
    clearBet.setInteractive();
    let deal = this.add.text(700,500, 'Deal', textStyle);
    deal.setInteractive();
    this.setUpHoverStyles(add1);
    this.setUpHoverStyles(add25);
    this.setUpHoverStyles(add100);
    this.setUpHoverStyles(clearBet);
    this.setUpHoverStyles(deal);
    add1.on('pointerdown', function () {
      mainScene.bet++;
      if(mainScene.bet > mainScene.money) mainScene.bet = mainScene.money;
      mainScene.updateBetText(betPrompt);
    });
    add25.on('pointerdown', function () {
      mainScene.bet += 25;
      if(mainScene.bet > mainScene.money) mainScene.bet = mainScene.money;
      mainScene.updateBetText(betPrompt);
    });
    add100.on('pointerdown', function () {
      mainScene.bet += 100;
      if(mainScene.bet > mainScene.money) mainScene.bet = mainScene.money;
      mainScene.updateBetText(betPrompt);
    });
    clearBet.on('pointerdown', function () {
      mainScene.bet = 0;
      if(mainScene.bet > mainScene.money) mainScene.bet = mainScene.money;
      mainScene.updateBetText(betPrompt);
    });
    deal.on('pointerdown', function () {
      mainScene.money -= mainScene.bet;
      if(mainScene.dealerScoreText)mainScene.dealerScoreText.destroy();
      if(mainScene.playerScoreText) mainScene.playerScoreText.destroy();
      if(mainScene.resultText) mainScene.resultText.destroy();
      mainScene.updateMoneyText();
      betPrompt.destroy();
      add1.destroy();
      add25.destroy();
      add100.destroy();
      clearBet.destroy();
      deal.destroy();
      mainScene.setUpNewGame()
    });
  }

  private updateBetText(text: Text){
    text.setText('Your bet: $' + this.bet);
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
      mainScene.resultText = mainScene.add.text(0,0, 'BUST!', textStyle);
      mainScene.textHit.destroy();
      mainScene.textStay.destroy();
      mainScene.endHand();
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
      mainScene.resultText = mainScene.add.text(0,0, 'WIN!', textStyle);
      mainScene.money += mainScene.bet * 2;
    }
    else if(dealerScore === playerScore){
      mainScene.resultText = mainScene.add.text(0,0, 'Push', textStyle);
    }
    else {
      mainScene.resultText = mainScene.add.text(0,0, 'Loss', textStyle);
    }
    mainScene.endHand();
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

  private endHand() {
    let mainScene: MainScene = this;
    mainScene.updateMoneyText();
    mainScene.promptBet();
  }
}