import Konva from 'konva';
import { animationsSpells } from "../constants/canvas";
import { numbers } from "../constants/numbers";
import { inCase } from "../constants/inCase";
import { animationsNames } from "../constants/animationsNames";
import {Utils} from "../utils/Utils";

export class SpellController {
    constructor(view) {
    this.spellView = view;
    this.spellImgPlayer = null;
    this.spellPlayer = null;
    this.layerPlayer = new Konva.Layer();
    this.spellImgMonster = null;
    this.spellMonster = null;
    this.layerMonster = new Konva.Layer();
    this.utils = new Utils();
  }

  takeSpriteForSpell(SpellId){
    switch (SpellId) {
      case inCase.fireBall:
        this.spellImgPlayer.src = 'images/fireBall.png';
        this.spellPlayer.attrs.animation = animationsNames.fireBall;
        break;
      case inCase.iceWodge:
        this.spellImgPlayer.src = 'images/iceBall.png';
        this.spellPlayer.attrs.animation = animationsNames.iceWodge;
        break;
      case inCase.cuttingWind:
        this.spellImgPlayer.src = 'images/tornado.png';
        this.spellPlayer.attrs.animation = animationsNames.cuttingWind;
        break;
      case inCase.stoneWodge:
        this.spellImgPlayer.src = 'images/boulder.png';
        this.spellPlayer.attrs.animation = animationsNames.stoneWodge;
        break;
      default:
        return null;
    }
  }

  createPlayerSpell(spellName){
    this.spellImgPlayer  = new Image();
    this.spellPlayer = new Konva.Sprite({
      x: numbers.playerSpellInitialCoordinateX,
      y: numbers.playerSpellInitialCoordinateY,
      image: this.spellImgPlayer ,
      animations: animationsSpells,
      frameRate: 8,
      frameIndex: 0
    });
    this.takeSpriteForSpell(spellName);
  };

  createMonsterSpell(){
    this.spellImgMonster  = new Image();
    this.spellMonster = new Konva.Sprite({
      x: numbers.monsterSpellInitialCoordinateX,
      y: numbers.monsterSpellInitialCoordinateY,
      image: this.spellImgMonster ,
      animations: animationsSpells,
      frameRate: 8,
      frameIndex: 0
    });
    this.spellImgMonster.src = 'images/boulder.png';
    this.spellMonster.attrs.animation = animationsNames.stoneWodge;
  };

  async playerCastSpell(obj){
    obj.playerDoCast();
    await this.utils.pause(numbers.showSpellPause);
    this.layerPlayer.add(this.spellPlayer);
    this.spellView.displayLayer(this.layerPlayer);
    this.spellView.initObject(this.spellPlayer);
    this.spellView.initSpellAnimationPlayer(this.spellPlayerMovements.bind(this),this.layerPlayer);
    this.spellView.startAnimationPlayer();
  }

  monsterCastSpell(){
      this.layerMonster.add(this.spellMonster);
      this.spellView.displayLayer(this.layerMonster);
      this.spellView.initObject(this.spellMonster);
      this.spellView.initSpellAnimationMonster(this.spellMonsterMovements.bind(this),this.layerMonster);
      this.spellView.startAnimationMonster();
  }

  spellMonsterMovements(){
    if(this.spellMonster.attrs.x > numbers.playerInitialCoordinateX){
       this.spellMonster.setX(this.spellMonster.attrs.x - numbers.monsterSpellFly);
    }
    else{
      this.spellMonster.destroy();
      this.spellView.stopAnimationMonster();
    }
  }

  spellPlayerMovements(){
    if(this.spellPlayer.attrs.x < numbers.playerCastBorder){
       this.spellPlayer.setX(this.spellPlayer.attrs.x + numbers.playerSpellFly);
    }
    else{
      this.spellPlayer.destroy();
      this.spellView.stopAnimationPlayer();
    }
  }
}
