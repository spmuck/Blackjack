import Text = Phaser.GameObjects.Text;
import ScenePlugin = Phaser.Scenes.ScenePlugin;

export class TextUtility{
    static centerTextHorizontally(text: Text, scene: ScenePlugin): void {
        text.setX(new Number(scene.manager.game.config.width).valueOf() * 0.5 - (text.displayWidth * 0.5));
    }
}