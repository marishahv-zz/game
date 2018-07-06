import Konva from 'konva';
import random from 'lodash/random';
import { GameController } from "./gameVC/GameController";
import { GameView } from "./gameVC/GameView";
import { classSwitcherModal,fillOutTxtContainer } from "./madalComponent/index";
const css = require("./index.css");
function importAll(r) {
  let audio = {};
  r.keys().map((item, index) => { audio[item.replace('./', '')] = r(item); });
  return audio;
}
const audio = importAll(require.context('./audio', false, /\.(mp3|wav)$/));
const canvasWidth = window.outerWidth;
const canvasHeight = window.innerHeight;
const stage = new Konva.Stage({
    container: 'canvasContainer',
    width: canvasWidth,
    height: canvasHeight
});

const gameView = new GameView();
const gameController = new GameController(gameView,stage);

gameController.initMenueListener();
gameController.initNameOfHeroListner();

classSwitcherModal();
fillOutTxtContainer();
