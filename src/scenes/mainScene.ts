import {CARD_ATLAS_KEY, CardFactory} from "../Factories/cardFactory";
import {Deck} from "../models/deck";
import {Hand} from "../models/hand";
import {Card} from "../models/card";
import Text = Phaser.GameObjects.Text;
import Texture = Phaser.Textures.Texture;
import Image = Phaser.GameObjects.Image;
import {HIGH_SCORE_STORAGE, textStyle} from "../constants/constants";
import {BetScene} from "./BetScene";
import Zone = Phaser.GameObjects.Zone;
import {GameResult} from "../models/gameResult";

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
  private moneyText: Text;
  private cardImages: Image[];
  private betScene: BetScene;
  private gameZone: Zone;
  private stayButton: Image;
  private hitButton: Image;

  constructor() {
    super({
      key: "MainScene"
    });
  }

  preload(): void {
    let cardFactory: CardFactory = new CardFactory(this, './assets/playingCards.png', './assets/playingCards.xml');
    this.load.image('cardBack', './assets/card_back_red.png');
    this.atlasTexture = this.textures.get(CARD_ATLAS_KEY);
    this.betScene = <BetScene>this.scene.get('BetScene');
    this.load.image('orangeChip', './assets/chipOrange.png');
    this.load.image('yellowChip', './assets/chipYellow.png');
  }

  create(): void {
    let width: number = new Number(this.scene.manager.game.config.width).valueOf();
    let height: number = new Number(this.scene.manager.game.config.height).valueOf();
    this.gameZone = this.add.zone(width * 0.5, height * 0.5, width, height);
    this.setUpMoneyText();
    this.setUpNewGame();
  }

  private setUpMoneyText(): void{
    this.moneyText = this.add.text(0, 0, '', textStyle);
    let betText: Text = this.add.text(0, 0, '', textStyle);

    this.updateMoneyText();
    this.updateBetText(betText);
  }

  private updateMoneyText(): void{
    this.moneyText.setText('Money: $' + this.betScene.money);
    Phaser.Display.Align.In.TopRight(this.moneyText, this.gameZone, -20, -20);
  }

  private updateBetText(text: Text){
      text.setText('Bet: $' + this.betScene.bet);
      Phaser.Display.Align.To.BottomLeft(text, this.moneyText);
  }

  private setUpDealerScoreText(): void {
    this.dealerScoreText = this.add.text(0, 200, '', textStyle);
    this.setDealerScoreText();
    Phaser.Display.Align.In.TopCenter(this.dealerScoreText, this.gameZone,0 ,-20);
  }

  private setUpPlayerScoreText(): void {
    this.playerScoreText = this.add.text(0, 300, '', textStyle);
    this.setPlayerScoreText();
    Phaser.Display.Align.In.BottomCenter(this.playerScoreText, this.gameZone, 0, -20);
  }

  private setUpHitButton(): void{
    this.hitButton = this.add.image(this.gameZone.width*0.33,this.gameZone.height * 0.5,
      'yellowChip').setScale(1.2 * this.betScene.scale);
    this.textHit = this.add.text(this.gameZone.width*0.33, this.gameZone.height * 0.5, 'Hit', textStyle);
    Phaser.Display.Align.In.Center(this.textHit, this.hitButton);
    this.hitButton.setInteractive();
    this.setUpHoverStyles(this.hitButton);
    this.setUpClickHandler(this.hitButton, this.handleHit);
  }

  private setUpStayButton(): void {
    this.stayButton = this.add.image(this.gameZone.width*0.66,this.gameZone.height * 0.5,
      'orangeChip').setScale(1.2 * this.betScene.scale);
    this.textStay = this.add.text(this.gameZone.width*0.66, this.gameZone.height * 0.5, 'Stay', textStyle);
    Phaser.Display.Align.In.Center(this.textStay, this.stayButton);
    this.stayButton.setInteractive();
    this.setUpHoverStyles(this.stayButton);
    this.setUpClickHandler(this.stayButton, this.handleStay);
  }

  private setUpHoverStyles(image: Image){
    image.on('pointerover', function () {
      image.setScale(1.4 * this.betScene.scale);
    },this);
    image.on('pointerout', function () {
      image.setScale(1 * this.betScene.scale);
    },this);
  }

  private setUpNewGame(){
    this.deck = new Deck();
    this.dealerHand =  new Hand();
    this.playerHand= new Hand();
    this.playerHand.receiveCard(this.deck.drawCard());
    this.dealerHand.receiveCard(this.deck.drawCard());
    this.playerHand.receiveCard(this.deck.drawCard());
    this.dealerHand.receiveCardFaceDown(this.deck.drawCard());
    if(this.playerHand.getBlackjackScore() === 21){
      this.endHand(GameResult.BLACKJACK);
    }
    this.setUpHitButton();
    this.setUpStayButton();
    this.setUpDealerScoreText();
    this.setUpPlayerScoreText();

    this.refreshDrawHands();
  }

  private setUpClickHandler(image: Image, handlerFunction: Function){
    let mainScene: MainScene = this;
    image.on('pointerdown', function () {
      handlerFunction(mainScene);
    });
  }

  private handleHit(mainScene: MainScene): void{
    mainScene.playerHand.receiveCard(mainScene.deck.drawCard());
    mainScene.refreshDrawHands();
    mainScene.setPlayerScoreText();
    if(mainScene.playerHand.getBlackjackScore() > 21) {
      mainScene.textHit.destroy();
      mainScene.textStay.destroy();
      mainScene.endHand(GameResult.LOSS);
    }
  }

  private handleStay(mainScene: MainScene): void {
    mainScene.textStay.destroy();
    mainScene.textHit.destroy();
    mainScene.dealerHand.getCards().forEach(card=>{card.setFaceDown(false)});
    mainScene.refreshDrawHands();
    mainScene.setDealerScoreText();
    let dealerScore: number = mainScene.dealerHand.getBlackjackScore();
    let playerScore: number = mainScene.playerHand.getBlackjackScore();
    while( dealerScore < 17){
      mainScene.dealerHand.receiveCard(mainScene.deck.drawCard());
      mainScene.refreshDrawHands();
      mainScene.setDealerScoreText();
      dealerScore = mainScene.dealerHand.getBlackjackScore();
    }
    if(dealerScore > 21 || ( playerScore < 22 && playerScore > dealerScore)){
      mainScene.endHand(GameResult.WIN);
    }
    else if(dealerScore === playerScore){
      mainScene.endHand(GameResult.PUSH);
    }
    else {
      mainScene.endHand(GameResult.LOSS);
    }

  }

  private refreshDrawHands() {
    if(this.cardImages) {
      this.cardImages.forEach(function(cardImage: Image){
        cardImage.destroy();
      });
    }
    this.cardImages = [];

    this.drawHand(this.dealerHand, false);
    this.drawHand(this.playerHand, true);
  }

  private drawHand(hand: Hand, isPlayerHand: boolean) {

    let cards: Card[] = hand.getCards();
    let scene: MainScene = this;
    let cardMargin: number = this.CARD_MARGIN;
    let cardImage: Image;
    cards.forEach(function(card: Card, index: number, cards: Card[]) {
      if(!card.getFaceDown()){
       cardImage = scene.add.image(0, 0, CARD_ATLAS_KEY, card.getAtlasFrame());
      }
      else{
        cardImage = scene.add.image(0,0,'cardBack');
      }
      if(isPlayerHand){
        Phaser.Display.Align.To.TopLeft(cardImage,scene.playerScoreText,
          -((index * cardImage.displayWidth) + (index * scene.CARD_MARGIN)),20);
      }
      else {
        Phaser.Display.Align.To.BottomLeft(cardImage,scene.dealerScoreText,
          -((index * cardImage.displayWidth) + (index * scene.CARD_MARGIN)),20);
      }
      scene.cardImages.push(cardImage);
    });
  }

  private setDealerScoreText() {
    this.dealerScoreText.setText("Dealer Score: " + this.dealerHand.getBlackjackScore());
  }

  private setPlayerScoreText() {
    this.playerScoreText.setText("Your Score: " + this.playerHand.getBlackjackScore());
  }

  private endHand(result: GameResult) {
    this.payout(result);
    let graphics = this.add.graphics({fillStyle: {color: 0x000000, alpha: 0.75}});
    let square = new Phaser.Geom.Rectangle(0, 0, new Number(this.scene.manager.game.config.width).valueOf(),
      new Number(this.scene.manager.game.config.height).valueOf());
    graphics.fillRectShape(square);
    let resultText: Text = this.add.text(0, 0, <string> result, textStyle);
    resultText.setColor("#ffde3d");
    //resultText.setStroke("#000000", 5);
    //resultText.setFontSize(60);
    Phaser.Display.Align.In.Center(resultText, this.gameZone);
    this.input.once('pointerdown', function (event){
      this.input.once('pointerup', function (event){
        this.scene.start('BetScene');
      },this);
    },this);

  }

  private payout(result: GameResult){
    if(result === GameResult.WIN){
      this.betScene.money += (this.betScene.bet * 2);
    }
    else if(result === GameResult.PUSH){
      this.betScene.money += this.betScene.bet;
    }
    else if(result === GameResult.BLACKJACK){
      this.betScene.money += (this.betScene.bet * 3);
    }
    this.updateMoneyText();
    let highScore = localStorage.getItem(HIGH_SCORE_STORAGE);
    if(!highScore || (this.betScene.money > new Number(highScore).valueOf()) ){
      localStorage.setItem(HIGH_SCORE_STORAGE, new String(this.betScene.money).valueOf());
    }
  }

}