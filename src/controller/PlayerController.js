import Konva from 'konva';
import { ELF_MALE , ELF_FEMALE } from "../constants/canvas";
import * as APPEARANCE from "../constants/appearance";
import { ID } from "../constants/id";
import { ANIMATION_NAMES } from "../constants/animationsNames";
import { KEYBOARD_EVENT } from "../constants/keys";

export class PlayerController {

  constructor(model,view) {
    this.player = model;
    this.playerView = view;
    this.layer = new Konva.Layer();
    this.animationsCharacter = null;
    this.characterImg = null;
    this.character  = null;
    this.stringSrcPart = null;
    this.presedKey = null;
    this.palayerGetDmg = false;
    this.playerCanWalk = false;
    this.playerCast = false;
  }

  createPlayer(){
    this.characterImg = new Image();
    this.characterImg.src = `images/heroes-icons/${this.stringSrcPart}-stay.png`;
    this.character = new Konva.Sprite({
        x: APPEARANCE.COORDINATES.player.x,  
        y: APPEARANCE.COORDINATES.player.y,
        image: this.characterImg,
        animation: ANIMATION_NAMES.heroStay,
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
      case ID.heroWoman:
        this.animationsCharacter = ELF_FEMALE
        this.stringSrcPart = ID.srcWoman;
        break;
      case ID.heroMan:
        this.animationsCharacter = ELF_MALE;
        this.stringSrcPart = ID.srcMan;
        break;
      default:
        return null;
    };
  }

  animationMovements(){
    if(this.presedKey === KEYBOARD_EVENT.left && this.character.attrs.x !== APPEARANCE.COORDINATES.player.x && this.playerCanWalk){
        this.characterImg.src=`images/heroes-icons/${this.stringSrcPart}-walk.png`;
        this.character.attrs.animation = ANIMATION_NAMES.heroWalking;
        this.character.setX(this.character.attrs.x - APPEARANCE.COORDINATES.player.goBack);  
    }
    if(this.presedKey === KEYBOARD_EVENT.right && this.playerCanWalk) {
      this.characterImg.src=`images/heroes-icons/${this.stringSrcPart}-walk.png`;
      this.character.attrs.animation = ANIMATION_NAMES.heroWalking;
      this.character.setX(this.character.attrs.x + APPEARANCE.COORDINATES.player.go);
    }
    if(this.presedKey === null && !this.playerCast){
      this.characterImg.src=`images/heroes-icons/${this.stringSrcPart}-stay.png`;
      this.character.attrs.animation = ANIMATION_NAMES.heroStay;
    }
    if(this.playerCast){
      this.characterImg.src=`images/heroes-icons/${this.stringSrcPart}-cast.png`;
      this.character.attrs.animation = ANIMATION_NAMES.heroCast;
    }
    if(this.palayerGetDmg){
      this.characterImg.src=`images/heroes-icons/${this.stringSrcPart}-get-damaged.png`;
      this.character.attrs.animation = ANIMATION_NAMES.heroGetDamaged;
    }
  }

  backPlayerStopMove(){
    this.character.setX(APPEARANCE.COORDINATES.player.x);
    this.playerCanWalk = false;
  }

  playerDoCast(){
    this.playerCast = true;//каст игрока
    setTimeout(()=>{
      this.playerCast=false
    },1000)
  }
}
