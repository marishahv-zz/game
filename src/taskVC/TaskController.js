import { Audio } from "../model/Audio";
import isArray from 'lodash/isArray';
import $ from "jquery";
import 'webpack-jquery-ui/sortable';
import { messages } from "../constants/messages";
import { numbers } from "../constants/numbers";
import { keyBoardEvents } from "../constants/keys";
import {Utils} from "../utils/Utils";

export class TaskController {
    constructor(model, view) {
        this.view = view;
        this.model = model;
        this.backMusic = new Audio();
        this.utils = new Utils();
        this.result = "";
        this.isCorrect = null;
        this.checkDraggableResult = async (evt) => {
            evt.preventDefault();
            let isCorrect = this.isDraggableCorrect();
            if(isCorrect){
                this.view.displayHeading(messages.win);
                this.isCorrect = true;
            }
            if(!isCorrect){
                this.view.displayHeading(messages.lost);
                this.isCorrect = false;
            }
            await this.utils.pause(numbers.closeModalTaskPause);
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
                this.view.displayHeading(messages.win);
                this.isCorrect = true;
            }
            if(!isCorrect){
                this.view.displayHeading(messages.lost);
                this.isCorrect = false;
            }
            await this.utils.pause(numbers.closeModalTaskPause);
            this.closeModal();
        };
        this.init();
    };

    init() {
        this.view.inputResult.addEventListener("keypress", this.preventDefaultEvent, false);
    };

    preventDefaultEvent(evt){
        if (evt.keyCode == keyBoardEvents.enter) {
            evt.preventDefault();
            return false;
        }
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
    };

    isDraggableCorrect(){
        let resultWord = '';
        $('#wordblock>div').each(function(e) {
            resultWord += $(this).text();
        });
       return resultWord == this.result;
    };

    initAudioTask(){
        this.backMusic.battleMusic.volume = numbers.battleMusicMinvolume;
        this.view.toggleModal();
        this.view.displayAudio();
        this.result = this.model.word;

        this.view.listenBtn.onclick = (event) => {
            event.preventDefault();
            this.model.getSynthesisUtterance();
        }
    };
}
