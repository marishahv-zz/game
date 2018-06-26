import Konva from 'konva';
import * as APPEARANCE from "../constants/appearance";

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
            if (position.x > -(that.stage.width() / APPEARANCE.COORDINATES.monster.xStop)) {//
                layer.move({ x: APPEARANCE.COORDINATES.monster.xShift, y: 0}); //
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
