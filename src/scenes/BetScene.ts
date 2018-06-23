import {textStyle} from "../constants/constants";
import Image = Phaser.GameObjects.Image;
import Text = Phaser.GameObjects.Text;
import {TextUtility} from "../utility/TextUtility";
import {ImageUtility} from "../utility/ImageUtility";

export class BetScene extends Phaser.Scene {
    public money: number = 1000;
    public bet: number = 0;
    public moneyText: Text;
    public betText: Text;

    constructor() {
        super({
            key: "BetScene"
        });
    }

    preload(): void {
        this.load.image('redChip', './assets/chipRed.png');
        this.load.image('whiteChip', './assets/chipWhite.png');
        this.load.image('blueChip', './assets/chipBlue.png');
        this.load.image('orangeChip', './assets/chipOrange.png');
        this.load.image('yellowChip', './assets/chipYellow.png')
    }

    create(): void {
        this.setUpTitle();
        this.setUpButtons();
        this.setUpMoneyText();
        this.setUpBetText();
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
        this.moneyText = this.add.text(0, 80, '', textStyle);
        this.updateMoneyText();
    }

    private updateMoneyText(): void{
        this.moneyText.setText('Your total Money: $' + this.money);
        TextUtility.centerTextHorizontally(this.moneyText, this.scene);
    }

    private setUpTitle(): void {
        let textTitle: Text = this.add.text(0, 20, 'Place your bet', textStyle);
        TextUtility.centerTextHorizontally(textTitle, this.scene);
    }

    private setUpBetText() {
        this.betText = this.add.text(0, 140, '', textStyle);
        this.updateBetText();
    }

    private updateBetText(): void{
        this.betText.setText('Your Bet: $' + this.bet);
        TextUtility.centerTextHorizontally(this.betText, this.scene);
    }

    private setUpButtons(): void{
        let whiteChip = this.add.image(200,300,'whiteChip');
        whiteChip.setInteractive();
        whiteChip.setDataEnabled();
        whiteChip.data.set('value', 1);
        this.setUpHoverButtons(whiteChip);
        let add1 = this.add.text(175,375, '1', textStyle);

        let redChip = this.add.image(400,300, 'redChip');
        let add25 = this.add.text(360,375, '25', textStyle);
        redChip.setInteractive();
        redChip.setDataEnabled();
        redChip.data.set('value',25);
        this.setUpHoverButtons(redChip);
        let blueChip = this.add.image(600, 300, 'blueChip');
        blueChip.setInteractive();
        blueChip.setDataEnabled();
        blueChip.data.set('value',100);
        this.setUpHoverButtons(blueChip);
        let add100 = this.add.text(550,375, '100', textStyle);
        this.data.set('money', 1000);
        let chips: Image[] = new Array<Image>();
        chips.push(whiteChip);
        chips.push(redChip);
        chips.push(blueChip);
        let clearButton = this.add.image(0,500,'yellowChip');
        let clearText = this.add.text(0,575,'Clear',textStyle);
        let dealButton = this.add.image(0,500,'orangeChip');
        let dealText = this.add.text(0,575, 'Deal', textStyle);
        clearButton.setInteractive();
        dealButton.setInteractive();
        this.setUpHoverButtons(clearButton);
        this.setUpHoverButtons(dealButton);
        clearButton.on('pointerdown',function(){
            this.bet = 0;
            this.updateBetText();
        },this);
        dealButton.on('pointerdown', function(){
            this.money -= this.bet;
            this.scene.start('MainScene');
        }, this);
        let buttons: Image[] = new Array<Image>();
        buttons.push(clearButton);
        buttons.push(dealButton);
        ImageUtility.spaceOutImagesEvenlyHorizontally(buttons, this.scene)
        ImageUtility.spaceOutImagesEvenlyHorizontally(chips, this.scene);
        Phaser.Display.Align.In.Center(add1,whiteChip);
        Phaser.Display.Align.In.Center(add25, redChip);
        Phaser.Display.Align.In.Center(add100, blueChip);
        Phaser.Display.Align.In.Center(clearText, clearButton);
        Phaser.Display.Align.In.Center(dealText, dealButton);
        this.setUpBetButtonHandlers(chips);
    }

    private setUpBetButtonHandlers(buttons: Image[]){
        buttons.forEach(button => {
            button.on('pointerdown', function(event){
              this.addChip(button.data.get('value'));
            },this);
        },this);
    }

    private addChip(value: number){
        this.bet += value;
        if(this.bet > this.money) this.bet = this.money;
        this.updateBetText();
    }
}