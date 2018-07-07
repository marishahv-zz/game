import random from 'lodash/random';
import isArray from 'lodash/isArray';
import { Player } from "../model/Player";
import { PlayerController } from "../controller/PlayerController";
import { PlayerView } from "../view/PlayerView";
import { SpellController } from "../controller/SpellController";
import { SpellView } from "../view/SpellView";
import {Monster} from "../model/Monster";
import { MonsterController } from "../controller/MonsterController";
import { MonsterView } from "../view/MonsterView";
import { Audio } from "../model/Audio";
import { TaskController } from "../controller/TaskController";
import { TaskView } from "../view/TaskView";
import { MathTask } from "../model/MathTask";
import { EnglishTask } from "../model/EnglishTask";
import { DraggableTask } from "../model/DraggableTask";
import { AudioTask } from "../model/AudioTask";
import {Utils} from "../utils/Utils";
import { Timer } from "../model/Timer";
import { KEYBOARD_EVENT } from "../constants/keys";
import { MESSAGES } from "../constants/messages";
import * as APPEARANCE from "../constants/appearance";
import { GAME_COMMON } from "../constants/common";
import { ID } from "../constants/id";

export class GameController {

  constructor(view,stage) {
    this.gameView = view;
    this.stage = stage;
    this.timer = new Timer();
    this.audio = new Audio();
    this.player = null;
    this.playerController = null;
    this.playerView = null;
    this.monster = null;
    this.monsterView = null;
    this.monsterController = null;
    this.task = null;
    this.taskView = null;
    this.taskController = null;
    this.spellView = null;
    this.spellController = null;
    this.gameOverTimer = null;
    this.utils = new Utils();
    this.ansverSend = false;
  } 

  init(){
    document.addEventListener('keydown',this.keyDownListener.bind(this)); 
    document.addEventListener('keyup',this.keyUpListener.bind(this));
    this.gameView.spellButton.addEventListener("click",this.checkTaskAnsver.bind(this));
    this.gameView.spellsListContainer.addEventListener('click', this.spellList.bind(this));    
    this.gameView.spellsListContainer.addEventListener('keydown', this.arrowKeysListener.bind(this));
    this.gameView.spellsListContainer.addEventListener('keypress', this.spellList.bind(this));
    this.gameView.spellsListContainer.addEventListener('mouseover',this.startChoosingSpell.bind(this));
    this.gameView.spellsListContainer.addEventListener('mouseout',this.stopChoosingSpell.bind(this));
    this.gameView.taskForm.addEventListener("keypress", this.checkTaskAnsver.bind(this));
  }; 

  initNameOfHeroListner(){
    this.gameView.nameOfHero.addEventListener('keypress',this.checkPressedKey.bind(this));
  };

  initMenueListener(){
    this.gameView.menueContainer.addEventListener('click',this.startGame.bind(this));
  };  

  keyDownListener(ev){
    if(ev.keyCode === KEYBOARD_EVENT.rightArrow){
      this.playerController.presedKey=KEYBOARD_EVENT.right;
      if(this.playerController.playerCanWalk === true){
        this.audio.playAudio(this.audio.playerWalks);
      }
    }
    if(ev.keyCode === KEYBOARD_EVENT.leftArrow){
      this.playerController.presedKey=KEYBOARD_EVENT.left;
      if(this.playerController.playerCanWalk === true){
        this.audio.playAudio(this.audio.playerWalks);
      }
    }
  }

  keyUpListener(ev){
    if(ev.keyCode === KEYBOARD_EVENT.rightArrow){
      this.playerController.presedKey = null;
      if(this.playerController.playerCanWalk === true){
        this.audio.stopAudio(this.audio.playerWalks);
      }
    }
    if(ev.keyCode === KEYBOARD_EVENT.leftArrow){
      this.playerController.presedKey = null;
      if(this.playerController.playerCanWalk === true){
        this.audio.stopAudio(this.audio.playerWalks);
      }
    }
  }

  checkPressedKey(ev){
    if(ev.charCode >= KEYBOARD_EVENT.space && ev.charCode <= KEYBOARD_EVENT.at){
      ev.preventDefault();
    }else if(ev.charCode >= KEYBOARD_EVENT.squareBracket && ev.charCode <= KEYBOARD_EVENT.quote){
      ev.preventDefault();
    }else if(ev.charCode >= KEYBOARD_EVENT.figureBracket && ev.charCode <= KEYBOARD_EVENT.tilda){
      ev.preventDefault();
    }
  }

  startChoosingSpell(ev){
    if(ev.target.tagName === "SPAN"){     
      let selectedSpell = this.gameView.spellsListContainer.querySelector(".selected");
      if(selectedSpell){
        this.gameView.unhighlightSpell(selectedSpell);
        this.audio.stopAudio(this.audio.playerChecksSpell);        
      }     
      this.gameView.highlightSpell(ev.target);  
      this.audio.playAudio(this.audio.playerChecksSpell);           
    }
  };

  stopChoosingSpell(ev){
    if(ev.target.tagName === "SPAN"){        
        this.gameView.unhighlightSpell(ev.target)
        this.audio.stopAudio(this.audio.playerChecksSpell);        
    }
  }  

  selectSpellItem(shiftIndex){
    let spanElements = Array.from(document.querySelectorAll(".spells-list-item span"));
    let spanSelectedIndex = spanElements.findIndex((li) => {
      return li.classList.contains("selected");
    });
    if(spanSelectedIndex > -1){        
      this.gameView.unhighlightSpell(spanElements[spanSelectedIndex]); 
      this.audio.stopAudio(this.audio.playerChecksSpell);     

      let currentIndex = this.сheckArrIndex(spanSelectedIndex + shiftIndex, spanElements.length - 1);            
     
      this.gameView.highlightSpell(spanElements[currentIndex]); 
      this.audio.playAudio(this.audio.playerChecksSpell);     
    } 
    else {       
      this.gameView.highlightSpell(spanElements[0]);
      this.audio.playAudio(this.audio.playerChecksSpell);
    }    
  };

  сheckArrIndex(currentIndex, endIndex){         
    if (currentIndex > endIndex)          
        currentIndex = 0;
    if (currentIndex < 0)
        currentIndex = endIndex;  
    return currentIndex;
  };  

  arrowKeysListener(ev){    
    let shiftIndex;
    if(ev.keyCode == KEYBOARD_EVENT.downArrow){
      shiftIndex = 1;
      this.selectSpellItem(shiftIndex);
    }if(ev.keyCode == KEYBOARD_EVENT.upArrow){
      shiftIndex = -1;
      this.selectSpellItem(shiftIndex);
    }      
  };

  checkNameHero(){
    if(this.gameView.nameOfHero.value === MESSAGES.emptyNameLength){
      alert(MESSAGES.emptyName);
      return false;
    }else if (this.gameView.nameOfHero.value.length < MESSAGES.length) {
      alert(MESSAGES.shortName);
      return false;
    }else{
      return true;
    }
  }

  RenderingLevel(){
    if(this.playerController.character.attrs.x > APPEARANCE.COORDINATES.endOfGameFiled){
      this.playerController.backPlayerStopMove()
      this.monster = new Monster();
      this.monsterView = new MonsterView(this.stage);
      this.monsterController = new MonsterController(this.monster,this.monsterView);
      this.gameView.renderNextLevel();
      this.gameView.createMonsterStatusBar(this.monster);
      this.gameView.showHideMonsterStatusBar();
      this.monsterController.createMonster();
      this.monsterController.monsterMove();
      setTimeout(()=>{        
        this.gameView.showHideSpellsList()
      },200);
      this.audio.stopAudio(this.audio.mainMusic);
      this.audio.playAudio(this.audio.battleMusic);
    }
  }

  async takeTaskForSpell(spellId){
    switch (spellId) {
      case ID.fireBall:
        await this.utils.pause(1000);
        this.task = new MathTask();
        this.taskView = new TaskView();
        this.taskController = new TaskController(this.task, this.taskView);
        this.taskController.initMathTask();
        break;
      case ID.iceWodge:
        await this.utils.pause(1000);
        this.task = new EnglishTask();
        this.taskView = new TaskView();
        this.taskController = new TaskController(this.task, this.taskView);
        this.taskController.initEnglishTask();
        break;
      case ID.cuttingWind:
        await this.utils.pause(1000);
        this.task = new DraggableTask();
        this.taskView = new TaskView();
        this.taskController = new TaskController(this.task, this.taskView);
        this.taskController.initDraggableTask();
        break;
      case ID.stoneWodge:
        await this.utils.pause(1000);
        this.task = new AudioTask();
        this.taskView = new TaskView();
        this.taskController = new TaskController(this.task, this.taskView);
        this.taskController.initAudioTask();
        break;
      default:
        return null;
      }      
  }

  spellList(ev){    
      let spallSpan = false;
      if(ev.target.tagName === "SPAN"){
        spallSpan = ev.target;
      }
      if(ev.keyCode == KEYBOARD_EVENT.enter || ev.keyCode == KEYBOARD_EVENT.space){        
        spallSpan = this.gameView.spellsListContainer.querySelector(".selected");;
      }
      if(spallSpan){
        this.spellView = new SpellView(this.stage);
        this.spellController = new SpellController(this.spellView);
        this.gameView.showHideSpellsList();        
        this.spellController.createPlayerSpell(spallSpan.parentNode.id);
        this.spellController.createMonsterSpell();        
        this.takeTaskForSpell(spallSpan.parentNode.id);
      }     
  }; 
 
  playerAttack(){
    this.audio.playAudio(this.audio.taskAccept);
    this.monster.getDamaged(APPEARANCE.HEROES.player.damage);   
    setTimeout(()=>{
      this.audio.playAudio(this.audio.playerCasts);
      this.spellController.playerCastSpell(this.playerController);
      this.ansverSend = false;
      this.gameView.renderHpMonster(this.monster);
    },2000);
  }

  monsterAttack(){
    this.audio.playAudio(this.audio.taskDecline);
    this.player.getDamaged(APPEARANCE.HEROES.monster.damage);   
    setTimeout(()=>{
      this.audio.playAudio(this.audio.playerCasts);
      this.spellController.monsterCastSpell();
      this.ansverSend = false;
      this.gameView.renderHpHero(this.player);
    },2000);
    setTimeout(()=>{
      this.playerController.palayerGetDmg = true;
    },3200)
    setTimeout(()=>{
      this.playerController.palayerGetDmg = false;
    },4000);
  }

  async checkTaskAnsver(ev){    
    if(ev.target == this.taskView.spellButton || ev.keyCode == KEYBOARD_EVENT.enter){
      ev.preventDefault();
      if(!this.ansverSend){
        this.ansverSend = true;
        if(this.taskView.spellButton.hasAttribute("draggable")){
          await this.taskController.checkDraggableResult(ev);
        }else{
          await this.taskController.checkInputResult(ev);
        }
        if(this.taskController.isCorrect){
          this.playerAttack()
        }else{
          this.monsterAttack()
        }
        this.hpCharactersTrigger();
      }
    }
  };

  stopGame(){
    this.audio.stopAudio(this.audio.battleMusic);
    this.audio.stopAudio(this.audio.mainMusic);
    this.utils.updateLocalStorageData(this.player.name,this.player.defeatedMonster);
    let storageData = this.utils.getLocalStorageData();
    if(isArray(storageData)){
      this.gameView.renderScoreTable(storageData);
    }
    this.gameView.callGameOver();
    this.stopGameOverTimer();
    this.timer.stop();
  }

  hpCharactersTrigger(){
    if(this.player.hp === 0){
      setTimeout(()=>{
        this.stopGame();
      },4000);
    }else if(this.monster.hp === 0){
      setTimeout(()=>{
        this.playerController.playerCanWalk = true;
        this.audio.stopAudio(this.audio.battleMusic);
        this.audio.playAudio(this.audio.mainMusic);
        this.gameView.showHideMonsterStatusBar();
        this.monsterController.destroyMonster();
        this.player.addToScore(APPEARANCE.HEROES.monster.points);    
        this.gameView.renderHeroScore(this.player);
      },4000);
    }else{
      setTimeout(()=>{
        this.gameView.showHideSpellsList();
      },4000);
    }
  }

  startGameOverTimer(){
    this.gameOver = setInterval(()=>{
      if(this.timer.minutes >= GAME_COMMON.gameOverTime){
        this.stopGame()
      }
    },1000)
  }

  stopGameOverTimer(){
    clearInterval(this.gameOver);
  }

  createGame(){
    this.startGameOverTimer();
    this.gameView.hideMainHeaderBlocks();
    this.timer.start();
    this.player = new Player(this.gameView.nameOfHero.value,this.gameView.returnCheckedRadioGender()[1],this.gameView.returnCheckedRadioGender()[0]);
    this.gameView.switchClasses(this.gameView.gameFieldContainer);
    this.gameView.createHeroImg(this.gameView.characterIcon);
    this.gameView.createHeroStatusBar(this.player);
    this.playerView = new PlayerView(this.stage);
    this.playerController = new PlayerController(this.player,this.playerView);   
    this.playerController.setCoordinatesSprites();
    this.playerController.createPlayer();
    this.playerController.playerCanWalk = true;
    this.gameView.initRenderLevel(this.RenderingLevel.bind(this),this.playerController.layer);    
    this.init();   
  }

  startGame(ev){
    switch (ev.target.id) {
      case ID.buttonYes:
        this.gameView.switchClasses(this.gameView.menueContainer.children[0]);
        this.gameView.switchClasses(this.gameView.menueContainer.children[1]);
        this.gameView.createHeroImg(this.gameView.heroImg);
        this.audio.playAudio(this.audio.mainMusic);
        break;
      case ID.raceRadio:
        this.gameView.createHeroImg(this.gameView.heroImg);
        break;
      case ID.radioMan:
        this.gameView.createHeroImg(this.gameView.heroImg);
        break;
      case ID.radioWoman:
        this.gameView.createHeroImg(this.gameView.heroImg);
        break;
      case ID.start:
        if(this.checkNameHero()){
          this.createGame();
        }
        break;
      default:
        return null;
    }
  }
}
