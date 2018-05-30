/// <reference path="./bindings/phaser.d.ts"/>

import 'phaser';
import {MainScene} from "./scenes/mainScene";

const config : GameConfig = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  scene: MainScene
};

export class Game extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);
  }
}

window.onload = () => {
  var game = new Game(config);
};
