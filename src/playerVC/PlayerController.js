import Konva from 'konva';
import { elfMale , elfFemale } from "../constants/canvas";
import { numbers } from "../constants/numbers";
import { inCase } from "../constants/inCase";
import { animationsNames } from "../constants/animationsNames";
import { keyBoardEvents } from "../constants/keys";
import {Utils} from "../utils/Utils";

export class PlayerController {

  constructor(model,view) {
    this.player = model;
    this.playerView = view;
    this.layer = new Konva.Layer(); ;
    this.animationsCharacter = null;
    this.characterImg = null;
    this.character  = null;
    this.stringSrcPart = null;
    this.presedKey = null;
    this.palayerGetDmg = false;
    this.playerCanWalk = false;
    this.playerCast = false;
    this.utils = new Utils();
  }

  createPlayer(){
    this.characterImg = new Image();
    this.characterImg.src = `images/${this.stringSrcPart}-stay.png`;
    this.character = new Konva.Sprite({
        x: numbers.playerInitialCoordinateX,
        y: numbers.playerInitialCoordinateY,
        image: this.characterImg,
        animation: animationsNames.heroStay,
        animations: this.animationsCharacter,
        frameRate: 6,
        frameIndex: 0
    });
    this.layer.add(this.character);
    this.playerView.displayLayer(this.layer);
    this.playerView.initObject(this.character);
    this.playerView.initMoveAnimation(this.animationMovements.bind(this),this.layer)
    this.playerView.startAnimation();
  }

  setCoordinatesSprites(){
    switch (`${this.player.race+this.player.gender}`) {
      case inCase.heroWoman:
        this.animationsCharacter = elfFemale;
        this.stringSrcPart = inCase.srcWoman;
        break;
      case inCase.heroMan:
        this.animationsCharacter = elfMale;
        this.stringSrcPart = inCase.srcMan;
        break;
      default:
        return null;
    };
  }

  animationMovements(){
    if(this.presedKey === keyBoardEvents.left && this.character.attrs.x!==numbers.playerInitialCoordinateX && this.playerCanWalk){
        this.characterImg.src=`images/${this.stringSrcPart}-walk.png`;
        this.character.attrs.animation = animationsNames.heroWalking;
        this.character.setX(this.character.attrs.x - numbers.playerGoBack);
    }
    if(this.presedKey === keyBoardEvents.right && this.playerCanWalk) {
      this.characterImg.src=`images/${this.stringSrcPart}-walk.png`;
      this.character.attrs.animation = animationsNames.heroWalking;
      this.character.setX(this.character.attrs.x + numbers.playerGo);
    }
    if(this.presedKey === null && !this.playerCast){
      this.characterImg.src=`images/${this.stringSrcPart}-stay.png`;
      this.character.attrs.animation = animationsNames.heroStay;
    }
    if(this.playerCast){
      this.characterImg.src=`images/${this.stringSrcPart}-cast.png`;
      this.character.attrs.animation = animationsNames.heroCast;
    }
    if(this.palayerGetDmg){
      this.characterImg.src=`images/${this.stringSrcPart}-get-damaged.png`;
      this.character.attrs.animation = animationsNames.heroGetDamaged;
    }
  }

  backPlayerStopMove(){
    this.character.setX(numbers.playerInitialCoordinateX);
    this.playerCanWalk = false;
  }

  async playerDoCast(){
    this.playerCast = true;//каст игрока
    await this.utils.pause(numbers.playerCastSpellPause);
    this.playerCast=false;
  }
}
