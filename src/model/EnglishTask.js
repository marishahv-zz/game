import * as TASKS from "../constants/tasks";
import random from 'lodash/random';

export class EnglishTask {
    constructor(){
        this.english = TASKS.ENGLISH.words[random(0, TASKS.ENGLISH.words.length - 1)];
    };
} 
