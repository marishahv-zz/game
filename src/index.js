import Konva from 'konva';
import random from 'lodash/random';
import { GameController } from "./controller/GameController";
import { GameView } from "./view/GameView";

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
