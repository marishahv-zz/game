import * as TASKS from "../constants/tasks";
import random from 'lodash/random';

export class AudioTask {
    constructor(){  
        this.word = TASKS.ENGLISH.words[random(0, TASKS.ENGLISH.words.length - 1)].word;             
    }; 
    
    getSynthesisUtterance(speechSynthesis){ 
        let speechSynth = window.speechSynthesis;            
        let utterThis = new SpeechSynthesisUtterance(this.word);
        utterThis.voice = speechSynth.getVoices()[0];
        speechSynth.speak(utterThis);
    };
}