import {CARD_ATLAS_KEY, CardFactory} from "../Factories/cardFactory";
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
    let cardFactory : CardFactory = new CardFactory(this, './assets/playingCards.png', './assets/playingCards.xml')
  }

  create(): void {
    var atlasTexture = this.textures.get(CARD_ATLAS_KEY)

    var frames = atlasTexture.getFrameNames();

    for (var i = 0; i < frames.length; i++)
    {
      var x = Phaser.Math.Between(0, 800);
      var y = Phaser.Math.Between(0, 600);

      this.add.image(x, y, CARD_ATLAS_KEY, frames[i]);
    }
  }
}