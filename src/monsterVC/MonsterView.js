function importAll(r) {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}
const images = importAll(require.context('./images', false, /\.(png|jpe?g|svg)$/));
import Konva from 'konva';
import { numbers } from "../constants/numbers";

export class MonsterView{

    constructor(stage){
        this.stage = stage;
    };

    displayLayer(layer){
        this.stage.add(layer);
    };

    initAnimationMove(layer){
        let that = this;
        return new Konva.Animation(function(frame) {
            let position = layer.getAbsolutePosition();
            if (position.x > -(that.stage.width() / numbers.monsterStopX)) {
                layer.move({ x: numbers.monsterMoveX, y: 0});
            }
        }, layer);
    };

    startAnimation(animation){
        animation.start();
    };

    stopAnimation(animation){
        if(animation.isRunning()){
            animation.stop();
        }
    };
    removeLayer(layer){
        layer.destroyChildren();
        layer.destroy();
    };
}
