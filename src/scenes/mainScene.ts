import {CARD_ATLAS_KEY, CARD_HEIGHT, CARD_WIDTH, CardFactory} from "../Factories/cardFactory";
import {Deck} from "../models/deck";
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
        console.log(frame);
        x+= cardImage.displayWidth;
      }
    }
    this.add.text(100, 400, 'BlackJack').setFontFamily('Arial').setFontSize(64).setColor('black');
  }

}