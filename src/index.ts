/**
 * Created by sean on 5/29/2018.
 */
/// <reference path="./bindings/phaser.d.ts"/>

import 'phaser';
import {MainScene} from "./scenes/mainScene"
import {BetScene} from "./scenes/BetScene";

const config : GameConfig = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: window.innerWidth,
  height: window.innerHeight,
  scene: [BetScene, MainScene],
  backgroundColor:'#26723B'
};

export class Game extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);
  }
}

window.onload = () => {
  var game = new Game(config);
};
