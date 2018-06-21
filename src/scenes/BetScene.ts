import {textStyle} from "../constants/constants";
import Image = Phaser.GameObjects.Image;
import Text = Phaser.GameObjects.Text;
import {TextUtility} from "../utility/TextUtility";

export class BetScene extends Phaser.Scene {
    constructor() {
        super({
            key: "BetScene"
        });
    }

    public moneyText: Text;

    preload(): void {
        this.load.image('redChip', './assets/chipRed.png');
        this.load.image('whiteChip', './assets/chipWhite.png');
        this.load.image('blueChip', './assets/chipBlue.png')
    }

    create(): void {
        this.setUpTitle();
        let whiteChip = this.add.image(200,300,'whiteChip');
        whiteChip.setInteractive();
        this.setUpHoverButtons(whiteChip);
        let add1 = this.add.text(175,375, '$1', textStyle);
        let redChip = this.add.image(400,300, 'redChip');
        let add25 = this.add.text(360,375, '$25', textStyle);
        redChip.setInteractive();
        this.setUpHoverButtons(redChip);
        let blueChip = this.add.image(600, 300, 'blueChip');
        blueChip.setInteractive();
        this.setUpHoverButtons(blueChip);
        let add100 = this.add.text(550,375, '$100', textStyle);
        redChip.on('pointerdown', function(){
           this.scene.start('MainScene');
        }, this);
        this.data.set('money', 1000);
    }

    setUpHoverButtons(image: Image): void {
        image.on('pointerover',function(){
            image.setScale(1.2);
        });
        image.on('pointerout', function(){
            image.setScale(1);
        });
    }

    private setUpMoneyText(): void{
        this.moneyText = this.add.text(600, 0, '', textStyle);
        this.moneyText.setFontSize(24);
        this.updateMoneyText();
    }

    private updateMoneyText(): void{
        //this.moneyText.setText('Money: $' + this.money);
    }

    private setUpTitle(): void {
        let textTitle: Text = this.add.text(0, 20, 'Place your bet', textStyle);
        TextUtility.centerTextHorizontally(textTitle, this.scene);
    }
}