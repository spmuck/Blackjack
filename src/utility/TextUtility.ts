import Text = Phaser.GameObjects.Text;
import ScenePlugin = Phaser.Scenes.ScenePlugin;
import Image = Phaser.GameObjects.Image;

export class TextUtility{
    static centerTextHorizontally(text: Text, scene: ScenePlugin): void {
        text.setX(new Number(scene.manager.game.config.width).valueOf() * 0.5 - (text.displayWidth * 0.5));
    }

    static centerTextOnImageHorizontally(text: Text, image: Image){
        let centerX = image.x;
        text.setX(image.x - (text.displayWidth * 0.5))
    }

  static spaceOutImagesEvenlyHorizontally(texts: Text[], scene: ScenePlugin){
    for(let i: number =0; i < texts.length; i++){
      //we want to space out the images so there's even spaces on all sides
      //this means dividing the screen into one more division then we have imsages
      //and then placing the center of the images on the 1st division to the 2nd to last
      texts[i].setX(new Number(scene.manager.game.config.width).valueOf() * (i+1)/(texts.length+1));
    }
  }
}