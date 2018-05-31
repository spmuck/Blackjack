import {CARD_ATLAS_KEY, CARD_HEIGHT, CARD_WIDTH, CardFactory} from "../Factories/cardFactory";
import {Deck} from "../models/deck";
import Text = Phaser.GameObjects.Text;
/**
 * Created by sean on 5/29/2018.
 */
export class MainScene extends Phaser.Scene {
  private phaserImage: Phaser.GameObjects.Image;

  constructor() {
    super({
      key: "MainScene"
    });
  }

  preload(): void {
    let cardFactory: CardFactory = new CardFactory(this, './assets/playingCards.png', './assets/playingCards.xml')
  }

  create(): void {
    var atlasTexture = this.textures.get(CARD_ATLAS_KEY)

    let deck: Deck = new Deck();
    var x = 0 + CARD_WIDTH/4;
    var y = 0 + CARD_HEIGHT/4;
    for (let i = deck.getDeckSize() - 1; i > 0; i--) {
      {
        if (x > (800 - CARD_WIDTH / 4)) {
          x = CARD_WIDTH/4;
          y += CARD_HEIGHT/2;
        }
        let frame = deck.drawCard().getAtlasFrame();
        let cardImage = this.add.image(x, y, CARD_ATLAS_KEY, frame).setScale(0.5);
        cardImage.setInteractive();
        cardImage.on('pointerover', function () {

          this.setTint(Math.random() * 16000000);
        });
        console.log(frame);
        x+= cardImage.displayWidth;
      }
    }
    let textStyle = {
      font: "normal 48px Arial",
      fill: '#000000',
      align: 'center',
      boundsAlignH: "center", // bounds center align horizontally
      boundsAlignV: "middle" // bounds center align vertically
    };
    let text: Text = this.add.text(0, 0, 'BlackJack', textStyle);
    text.setX(400 - (text.displayWidth * 0.5))
    text.setInteractive();
    text.on('pointerover', function () {

      text.setColor('red')
    });
    text.on('pointerout', function () {

      text.setColor('black')
    });
  }



}