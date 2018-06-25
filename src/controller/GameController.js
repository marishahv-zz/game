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
import { Task } from "../model/Task";
import {Utils} from "../utils/Utils";
import { Timer } from "../model/Timer";
import { keyBoardEvents } from "../constants/keys";
import { tagsNames } from "../constants/tagsNames";
import { messages } from "../constants/messages";
import { numbers } from "../constants/numbers";
import { inCase } from "../constants/inCase";

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

  keyDownListener(ev){
    if(ev.keyCode === keyBoardEvents.rightArrow){
      this.playerController.presedKey=keyBoardEvents.right;
      if(this.playerController.playerCanWalk === true){
        this.audio.playAudio(this.audio.playerWalks);
      }
    }
    if(ev.keyCode === keyBoardEvents.leftArrow){
      this.playerController.presedKey=keyBoardEvents.left;
      if(this.playerController.playerCanWalk === true){
        this.audio.playAudio(this.audio.playerWalks);
      }
    }
  }

  keyUpListener(ev){
    if(ev.keyCode === keyBoardEvents.rightArrow){
      this.playerController.presedKey = null;
      if(this.playerController.playerCanWalk === true){
        this.audio.stopAudio(this.audio.playerWalks);
      }
    }
    if(ev.keyCode === keyBoardEvents.leftArrow){
      this.playerController.presedKey = null;
      if(this.playerController.playerCanWalk === true){
        this.audio.stopAudio(this.audio.playerWalks);
      }
    }
  }

  checkPressedKey(ev){
    if(ev.charCode >= keyBoardEvents.space && ev.charCode <= keyBoardEvents.at){
      ev.preventDefault();
    }else if(ev.charCode >= keyBoardEvents.squareBracket && ev.charCode <= keyBoardEvents.quote){
      ev.preventDefault();
    }else if(ev.charCode >= keyBoardEvents.figureBracket && ev.charCode <= keyBoardEvents.tilda){
      ev.preventDefault();
    }
  }

  startSoundCheckSpell(ev){
    if(ev.target.tagName === tagsNames.span){
        this.audio.playAudio(this.audio.playerChecksSpell);
        this.gameView.showHideSpellView(ev.target.parentNode.children[1]);
    }
  }

  stopSoundCheckSpell(ev){
    if(ev.target.tagName === tagsNames.span){
        this.audio.stopAudio(this.audio.playerChecksSpell);
        this.gameView.showHideSpellView(ev.target.parentNode.children[1]);
    }
  }

  checkNameHero(){
    if(this.gameView.nameOfHero.value === messages.emptyNameLength){
      alert(messages.emptyName);
      return false;
    }else if (this.gameView.nameOfHero.value.length < messages.messages) {
      alert(messages.shortName);
      return false;
    }else{
      return true;
    }
  }

  RenderingLevel(){
    if(this.playerController.character.attrs.x > numbers.endOfGameFiled){
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
        this.gameView.showHideSpellsList(this.player)
      },200);
      this.audio.stopAudio(this.audio.mainMusic);
      this.audio.playAudio(this.audio.battleMusic);
    }
  }

  takeTaskForSpell(spellId){
    switch (spellId) {
      case inCase.fireBall:
        setTimeout(()=>{
          this.taskController.initMathTask()
        },1000);
        break;
      case inCase.iceWodge:
        setTimeout(()=>{
          this.taskController.initEnglishTask()
        },1000);
        break;
      case inCase.cuttingWind:
        setTimeout(()=>{
          this.taskController.initDraggableTask()
        },1000);
        break;
      case inCase.stoneWodge:
        setTimeout(()=>{
          this.taskController.initAudioTask()
        },1000);
        break;
      default:
        return null;
      }
  }

  spellList(ev){
    if(ev.target.tagName === tagsNames.span){
        this.spellView = new SpellView(this.stage);
        this.spellController = new SpellController(this.spellView);
        this.gameView.showHideSpellsList(this.player);
        this.spellController.createPlayerSpell(ev.target.parentNode.id);
        this.spellController.createMonsterSpell();
        this.task = new Task();
        this.taskView = new TaskView();
        this.taskController = new TaskController(this.task, this.taskView);
        this.takeTaskForSpell(ev.target.parentNode.id);
      }
  }

//?
  checkTaskAnsver(ev){
    ev.preventDefault();
    setTimeout(()=>{
      this.taskController.view.spellButton.removeEventListener("click", this.taskController.checkInputResult, false);
      this.taskController.view.spellButton.removeEventListener("click", this.taskController.checkDraggableResult, false);
      if(!this.ansverSend){
        this.ansverSend = true;
        if(this.taskController.isCorrect){
          this.audio.playAudio(this.audio.taskAccept);
          this.monster.getDamaged(numbers.heroDmg);
          setTimeout(()=>{
            this.audio.playAudio(this.audio.playerCasts);
            this.spellController.playerCastSpell(this.playerController);
            this.ansverSend = false;
          },2000);
          setTimeout(()=>{
            this.gameView.renderHpMonster(this.monster);
          },2000);
        }else{
          this.audio.playAudio(this.audio.taskDecline);
          this.player.getDamaged(numbers.monsterDmg);
          setTimeout(()=>{
            this.audio.playAudio(this.audio.playerCasts);
            this.spellController.monsterCastSpell();
            this.ansverSend = false
          },2000);
          setTimeout(()=>{
            this.playerController.palayerGetDmg = true;
          },3200)
          setTimeout(()=>{
            this.playerController.palayerGetDmg = false;
          },4000);
          setTimeout(()=>{
            this.gameView.renderHpHero(this.player);
          },2000);
        }
        this.hpCharactersTrigger();
      }
    },100);
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
    if(this.player.hp === numbers.zero){
      setTimeout(()=>{
        this.stopGame();
      },4000);
    }else if(this.monster.hp === numbers.zero){
      setTimeout(()=>{
        this.playerController.playerCanWalk = true;
        this.audio.stopAudio(this.audio.battleMusic);
        this.audio.playAudio(this.audio.mainMusic);
        this.gameView.showHideMonsterStatusBar();
        this.monsterController.destroyMonster();
        this.player.addToScore(numbers.monsterPoints);
        this.gameView.renderHeroScore(this.player);
      },4000);
    }else{
      setTimeout(()=>{
        this.gameView.showHideSpellsList(this.player);
      },4000);
    }
  }

  startGameOverTimer(){
    this.gameOver = setInterval(()=>{
      if(this.timer.minutes >= numbers.gameOverTime){
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
    this.gameView.initKeyDownEventListener(this.keyDownListener.bind(this));
    this.gameView.initKeyUpEventListener(this.keyUpListener.bind(this));
    this.gameView.initAnsverListener(this.checkTaskAnsver.bind(this));
    this.playerController.setCoordinatesSprites();
    this.playerController.createPlayer();
    this.playerController.playerCanWalk = true;
    this.gameView.initRenderLevel(this.RenderingLevel.bind(this),this.playerController.layer);
    this.gameView.initSpellListListener(this.spellList.bind(this));
    this.gameView.initFirstAudioSpellListListener(this.startSoundCheckSpell.bind(this));
    this.gameView.initSecondAudioSpellListListener(this.stopSoundCheckSpell.bind(this));
  }

  startGame(ev){
    switch (ev.target.id) {
      case inCase.buttonYes:
        this.gameView.switchClasses(this.gameView.menueContainer.children[0]);
        this.gameView.switchClasses(this.gameView.menueContainer.children[1]);
        this.gameView.createHeroImg(this.gameView.heroImg);
        this.audio.playAudio(this.audio.mainMusic);
        break;
      case inCase.raceRadio:
        this.gameView.createHeroImg(this.gameView.heroImg);
        break;
      case inCase.radioMan:
        this.gameView.createHeroImg(this.gameView.heroImg);
        break;
      case inCase.radioWoman:
        this.gameView.createHeroImg(this.gameView.heroImg);
        break;
      case inCase.start:
        if(this.checkNameHero()){
          this.createGame();
        }
        break;
      default:
        return null;
    }
  }
}