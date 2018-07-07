
import { Audio } from "../model/Audio";
import isArray from 'lodash/isArray';
import $ from "jquery";
import 'webpack-jquery-ui/sortable';
import { KEYBOARD_EVENT } from "../constants/keys";
import { MESSAGES } from "../constants/messages";
import { GAME_COMMON } from "../constants/common";
import {Utils} from "../utils/Utils";

export class TaskController {
    constructor(model, view) {
        this.view = view;
        this.model = model;
        this.backMusic = new Audio();        
        this.result = "";
        this.isCorrect = null;
        this.utils = new Utils();
        this.checkDraggableResult = async (evt) => {
            evt.preventDefault();
            let isCorrect = this.isDraggableCorrect();
            if(isCorrect){
                this.view.displayHeading(MESSAGES.win);
                this.isCorrect = true;
            }
            if(!isCorrect){
                this.view.displayHeading(MESSAGES.lost);
                this.isCorrect = false;
            }
            await this.utils.pause(700);
            this.closeModal();
        };

        this.checkInputResult = async (evt) => {
            evt.preventDefault();
            let isCorrect;
            if(isArray(this.result)){
                isCorrect = this.result.some((element) => {
                    return this.view.inputResult.value.toLowerCase() === element;
                });
            }
            else {
                isCorrect = this.view.inputResult.value.toLowerCase() == this.result;
            }
            this.view.changeInputStyle(isCorrect);

            if(isCorrect){
                this.view.displayHeading(MESSAGES.win);
                this.isCorrect = true;
            }
            if(!isCorrect){
                this.view.displayHeading(MESSAGES.lost);
                this.isCorrect = false;
            }
            await this.utils.pause(700);
            this.closeModal();
        };        
    }; 

    closeModal(){
        this.view.toggleModal();
        this.view.clearEnglish();
        this.view.clearAudio();
        this.view.clearMath();
        this.view.hideElement(this.view.draggableDiv);
        this.view.spellButton.removeAttribute("draggable");
    };

    initMathTask(){
        this.view.toggleModal();
        this.view.displayMath(this.model.mathExpressionObj);
        this.result = this.model.mathExpressionObj.result;
    };

    initEnglishTask(){
        this.view.toggleModal();
        this.view.displayEnglish(this.model.english.word);
        this.result = this.model.english.trans;
    };

    initDraggableTask() {
        this.view.toggleModal();
        this.view.hideElement(this.view.taskDiv);
        
        $("#wordblock").sortable();
        $("#wordblock").disableSelection();
        
        this.view.spellButton.setAttribute("draggable", "true");
        let word = this.model.draggbleLetters.correct;
        let letters = this.model.shuffleItems(word);
        this.result = word;
        this.view.displayDraggable(letters);

        $('#wordblock>div').attr('tabindex', 0).bind('keydown', function(event) {            
           if(event.which == KEYBOARD_EVENT.rightArrow){    
            $(this).insertAfter($(this).next());
           }
           if(event.which == KEYBOARD_EVENT.leftArrow) {
            $(this).insertBefore($(this).prev());
          } 
          $(this).focus();            
        });         
    };

    isDraggableCorrect(){
        let resultWord = '';
        $('#wordblock>div').each(function(e) {
            resultWord += $(this).text();
        });
       return resultWord == this.result;
    };

    initAudioTask(){
        this.backMusic.battleMusic.volume = GAME_COMMON.battleMusicMinVolume;
        this.view.toggleModal();
        this.view.displayAudio();        
        this.result = this.model.word;  
        
        const listenToWord = (evt) => {
            evt.preventDefault();
            this.model.getSynthesisUtterance();
            evt.stopPropagation();
        };   
        
        this.view.listenBtn.onclick = listenToWord;
        this.view.listenBtn.onkeypress = listenToWord;        
    };    
}
