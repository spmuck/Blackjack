import Image = Phaser.GameObjects.Image;
import ScenePlugin = Phaser.Scenes.ScenePlugin;

export class ImageUtility{
    static spaceOutImagesEvenlyHorizontally(images: Image[], scene: ScenePlugin){
        for(let i: number =0; i < images.length; i++){
            //we want to space out the images so there's even spaces on all sides
            //this means dividing the screen into one more division then we have imsages
            //and then placing the center of the images on the 1st division to the 2nd to last
            images[i].setX(new Number(scene.manager.game.config.width).valueOf() * (i+1)/(images.length+1));
        }
    }
}