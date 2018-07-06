function importAll(r) {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}
const images = importAll(require.context('./images', false, /\.(png|jpe?g|svg)$/));
import Konva from 'konva';

export class PlayerView {
  constructor(stage) {
    this.stage = stage;
    this.playerLoop = null;
  }

  displayLayer(layer){
    this.stage.add(layer);
  }

  initObject(obj){
    obj.start();
  }

  initMoveAnimation(animationMovements,layer){
    this.playerLoop = new Konva.Animation(function(frame) {
        animationMovements();
    }, layer);
  }
  startAnimation(){
    this.playerLoop.start();
  }
}
