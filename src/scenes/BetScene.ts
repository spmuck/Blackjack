import {textStyle} from "../constants/constants";

export class BetScene extends Phaser.Scene {
    constructor() {
        super({
            key: "BetScene"
        });
    }

    preload(): void {
        this.load.image('redChip', './assets/chipRed.png');
        this.load.image('whiteChip', './assets/chipWhite.png');
        this.load.image('blueChip', './assets/chipBlue.png')
    }

    create(): void {
        this.add.image(200,300,'whiteChip');
        let add1 = this.add.text(175,375, '$1', textStyle);
        let redImage = this.add.image(400,300, 'redChip');
        let add25 = this.add.text(360,375, '$25', textStyle);
        redImage.setInteractive();
        this.add.image(600, 300, 'blueChip');
        let add100 = this.add.text(550,375, '$100', textStyle);
        redImage.on('pointerdown', function(){
           this.scene.start('MainScene');
        }, this);
        this.data.set('money', 1000);
    }
}