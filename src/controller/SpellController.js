import Konva from 'konva';
import { ANIMATION_SPELLS } from "../constants/canvas";
import * as APPEARANCE from "../constants/appearance";
import { ID } from "../constants/id";
import { ANIMATION_NAMES } from "../constants/animationsNames";

export class SpellController {
    constructor(view) {
    this.spellView = view;
    this.spellImgPlayer = null;
    this.spellPlayer = null;
    this.layerPlayer = new Konva.Layer();
    this.spellImgMonster = null;
    this.spellMonster = null;
    this.layerMonster = new Konva.Layer();
  }

  takeSpriteForSpell(SpellId){
    switch (SpellId) {
      case ID.fireBall:
        this.spellImgPlayer.src = 'images/spells/fireBall.png';
        this.spellPlayer.attrs.animation = ANIMATION_NAMES.fireBall;
        break;
      case ID.iceWodge:
        this.spellImgPlayer.src = 'images/spells/iceBall.png';
        this.spellPlayer.attrs.animation = ANIMATION_NAMES.iceWodge;
        break;
      case ID.cuttingWind:
        this.spellImgPlayer.src = 'images/spells/tornado.png';
        this.spellPlayer.attrs.animation = ANIMATION_NAMES.cuttingWind;
        break;
      case ID.stoneWodge:
        this.spellImgPlayer.src = 'images/spells/boulder.png';
        this.spellPlayer.attrs.animation = ANIMATION_NAMES.stoneWodge;
        break;
      default:
        return null;
    }
  }
  
  createPlayerSpell(spellName){
    this.spellImgPlayer  = new Image();
    this.spellPlayer = new Konva.Sprite({
      x: APPEARANCE.COORDINATES.player.spellX,
      y: APPEARANCE.COORDINATES.player.spellY,
      image: this.spellImgPlayer,
      animations: ANIMATION_SPELLS,
      frameRate: 8,
      frameIndex: 0
    });
    this.takeSpriteForSpell(spellName);
  };

  createMonsterSpell(){
    this.spellImgMonster  = new Image();
    this.spellMonster = new Konva.Sprite({
      x: APPEARANCE.COORDINATES.monster.spellX,
      y: APPEARANCE.COORDINATES.monster.spellY,
      image: this.spellImgMonster ,
      animations: ANIMATION_SPELLS,
      frameRate: 8,
      frameIndex: 0
    });
    this.spellImgMonster.src = 'images/spells/boulder.png';
    this.spellMonster.attrs.animation = ANIMATION_NAMES.stoneWodge;
  };

  playerCastSpell(obj){
    obj.playerCast = true;
    setTimeout(()=>{obj.playerCast=false},1000)
    setTimeout(()=>{
      this.layerPlayer.add(this.spellPlayer);
      this.spellView.displayLayer(this.layerPlayer);
      this.spellView.initObject(this.spellPlayer);
      this.spellView.initSpellAnimationPlayer(this.spellPlayerMovements.bind(this),this.layerPlayer);
      this.spellView.startAnimationPlayer();
    },500)
  }

  monsterCastSpell(){
      this.layerMonster.add(this.spellMonster);
      this.spellView.displayLayer(this.layerMonster);
      this.spellView.initObject(this.spellMonster);
      this.spellView.initSpellAnimationMonster(this.spellMonsterMovements.bind(this),this.layerMonster);
      this.spellView.startAnimationMonster();
  }

  spellMonsterMovements(){
    if(this.spellMonster.attrs.x > APPEARANCE.COORDINATES.player.x){
       this.spellMonster.setX(this.spellMonster.attrs.x - APPEARANCE.COORDINATES.monster.spellFly);
    }
    else{
      this.spellMonster.destroy();
      this.spellView.stopAnimationMonster();
    }
  }

  spellPlayerMovements(){
    if(this.spellPlayer.attrs.x < APPEARANCE.COORDINATES.player.castBorder){
       this.spellPlayer.setX(this.spellPlayer.attrs.x + APPEARANCE.COORDINATES.player.spellFly);
    }
    else{
      this.spellPlayer.destroy();
      this.spellView.stopAnimationPlayer();
    }
  }
}
