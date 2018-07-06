import * as TASKS from "../constants/tasks";
import random from 'lodash/random';

export class AudioTask {
    constructor(){
        this.word = TASKS.ENGLISH.words[random(0, TASKS.ENGLISH.words.length - 1)].word;
        this.speechSynth = window.speechSynthesis;
    };

    getSynthesisUtterance(){
        let utterThis = new SpeechSynthesisUtterance(this.word);
        utterThis.voice = this.speechSynth.getVoices()[0];
        this.speechSynth.speak(utterThis);
    };
}
