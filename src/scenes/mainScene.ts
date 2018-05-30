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
    this.load.image("logo", "./assets/logo.png");
  }

  create(): void {
    this.phaserImage = this.add.image(400, 150, "logo");
    this.tweens.add({
      targets: this.phaserImage,
      y: 450,
      duration: 2000,
      ease: 'Power2',
      yoyo: true,
      loop: -1
    });
  }
}