import isArray from 'lodash/isArray';
import { Player } from "../model/Player";
import { PlayerController } from "../playerVC/PlayerController";
import { PlayerView } from "../playerVC/PlayerView";
import { SpellController } from "../spellVC/SpellController";
import { SpellView } from "../spellVC/SpellView";
import {Monster} from "../model/Monster";
import { MonsterController } from "../monsterVC/MonsterController";
import { MonsterView } from "../monsterVC/MonsterView";
import { Audio } from "../model/Audio";
import { TaskController } from "../taskVC/TaskController";
import { TaskView } from "../taskVC/TaskView";
import { MathTask } from "../model/MathTask";
import { EnglishTask } from "../model/EnglishTask";
import { DraggableTask } from "../model/DraggableTask";
import { AudioTask } from "../model/AudioTask";
import {Utils} from "../utils/Utils";
import { Timer } from "../model/Timer";
import { keyBoardEvents } from "../constants/keys";
import { tagsNames } from "../constants/tagsNames";
import { messages } from "../constants/messages";
import { numbers } from "../constants/numbers";
import { inCase } from "../constants/inCase";
import { showLoader,hideLoader } from "../loaderComponent/index";
import { classSwitcherModal,fillOutTxtContainer } from "../madalComponent/index";

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

  initAnsverListener(){
    this.gameView.spellButton.addEventListener("click",this.checkTaskAnsver.bind(this));
  };

  initKeyDownEventListener(){
    document.addEventListener('keydown',this.keyDownListener.bind(this));
  };

  initKeyUpEventListener(){
    document.addEventListener('keyup',this.keyUpListener.bind(this));
  };

  initNameOfHeroListner(){
    this.gameView.nameOfHero.addEventListener('keypress',this.checkPressedKey.bind(this));
  };

  initMenueListener(){
    this.gameView.menueContainer.addEventListener('click',this.startGame.bind(this));
  };

  initSpellListListener(){
    this.gameView.spellsListContainer.addEventListener('click',this.spellList.bind(this));
  };

  initFirstAudioSpellListListener(){
    this.gameView.spellsListContainer.addEventListener('mouseover',this.startSoundCheckSpell.bind(this));
  };

  initSecondAudioSpellListListener(){
    this.gameView.spellsListContainer.addEventListener('mouseout',this.stopSoundCheckSpell.bind(this));
  };

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

  async  RenderingLevel(){
    if(this.playerController.character.attrs.x > numbers.endOfGameFiled){
      this.playerController.backPlayerStopMove()
      this.monster = new Monster();
      this.monsterView = new MonsterView(this.stage);
      this.monsterController = new MonsterController(this.monster,this.monsterView);
      this.gameView.renderNextLevel();
      this.gameView.createMonsterStatusBar(this.monster);
      this.gameView.showHideMonsterStatusBar();
      this.monsterController.createMonster();
      showLoader();
      await hideLoader();
      this.audio.stopAudio(this.audio.mainMusic);
      this.audio.playAudio(this.audio.battleMusic);
      this.monsterController.monsterMove();
      await this.utils.pause(numbers.renderLevelSpellsListPause);
      this.gameView.showHideSpellsList(this.player);
    }
  }

  async takeTaskForSpell(spellId){
    switch (spellId) {
      case inCase.fireBall:
        await this.utils.pause(numbers.showTaskPause);
        this.task = new MathTask();
        this.taskView = new TaskView();
        this.taskController = new TaskController(this.task, this.taskView);
        this.taskController.initMathTask();
        break;
      case inCase.iceWodge:
        await this.utils.pause(numbers.showTaskPause);
        this.task = new EnglishTask();
        this.taskView = new TaskView();
        this.taskController = new TaskController(this.task, this.taskView);
        this.taskController.initEnglishTask();
        break;
      case inCase.cuttingWind:
        await this.utils.pause(numbers.showTaskPause);
        this.task = new DraggableTask();
        this.taskView = new TaskView();
        this.taskController = new TaskController(this.task, this.taskView);
        this.taskController.initDraggableTask();
        break;
      case inCase.stoneWodge:
        await this.utils.pause(numbers.showTaskPause);
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
    if(ev.target.tagName === tagsNames.span){
        this.spellView = new SpellView(this.stage);
        this.spellController = new SpellController(this.spellView);
        this.gameView.showHideSpellsList(this.player);
        this.spellController.createPlayerSpell(ev.target.parentNode.id);
        this.spellController.createMonsterSpell();
        this.takeTaskForSpell(ev.target.parentNode.id);
      }
  }

  async playerAttack(){
    this.audio.playAudio(this.audio.taskAccept);
    this.monster.getDamaged(numbers.heroDmg);
    this.audio.playAudio(this.audio.playerCasts);
    await this.utils.pause(numbers.closeModalTaskPause);
    this.spellController.playerCastSpell(this.playerController);
    await this.utils.pause(numbers.ansverSendPause);
    this.ansverSend = false;
    this.gameView.renderHpMonster(this.monster);
  }

  async monsterAttack(){
    this.audio.playAudio(this.audio.taskDecline);
    this.player.getDamaged(numbers.monsterDmg);
    this.audio.playAudio(this.audio.playerCasts);
    await this.utils.pause(numbers.closeModalTaskPause);
    this.spellController.monsterCastSpell();
    await this.utils.pause(numbers.playerDmgedStart);
    this.playerController.palayerGetDmg = true;
    this.gameView.renderHpHero(this.player);
    await this.utils.pause(numbers.playerDmgedStop);
    this.playerController.palayerGetDmg = false;
    this.ansverSend = false;
  }

  async checkTaskAnsver(ev){
    ev.preventDefault();
    if(!this.ansverSend){
      this.ansverSend = true;
      if(ev.target.getAttribute("draggable")){
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

  async hpCharactersTrigger(){
    if(this.player.hp === numbers.zero){
      await this.utils.pause(numbers.playerDiePause);
      this.stopGame();
    }else if(this.monster.hp === numbers.zero){
      await this.utils.pause(numbers.monsterDiePause);
      this.playerController.playerCanWalk = true;
      this.audio.stopAudio(this.audio.battleMusic);
      this.audio.playAudio(this.audio.mainMusic);
      this.gameView.showHideMonsterStatusBar();
      this.monsterController.destroyMonster();
      this.player.addToScore(numbers.monsterPoints);
      this.gameView.renderHeroScore(this.player);
    }else{
      await this.utils.pause(numbers.battleSpellListPause);
      this.gameView.showHideSpellsList(this.player);
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
    this.initKeyDownEventListener();
    this.initKeyUpEventListener();
    this.initAnsverListener();
    this.playerController.setCoordinatesSprites();
    this.playerController.createPlayer();
    this.playerController.playerCanWalk = true;
    this.gameView.initRenderLevel(this.RenderingLevel.bind(this),this.playerController.layer);
    this.initSpellListListener();
    this.initFirstAudioSpellListListener();
    this.initSecondAudioSpellListListener();
  }

  startGame(ev){
    switch (ev.target.id) {
      case inCase.buttonYes:
        classSwitcherModal();
        fillOutTxtContainer();
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
