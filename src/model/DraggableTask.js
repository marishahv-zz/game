import * as TASKS from "../constants/tasks";
import random from 'lodash/random';

export class DraggableTask {
    constructor(){
        this.draggbleLetters = TASKS.DRAGGABLE_LETTER.words[random(0, TASKS.DRAGGABLE_LETTER.words.length - 1)]
    };

    shuffleItems (string){
        let lettersArr = string.split('');
        let currentIndex = lettersArr.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

          // Pick a remaining element...
          randomIndex = random(0, currentIndex-1);
          currentIndex -= 1;

          // And swap it with the current element.
          temporaryValue = lettersArr[currentIndex];
          lettersArr[currentIndex] = lettersArr[randomIndex];
          lettersArr[randomIndex] = temporaryValue;
        }
        return lettersArr;
    };
}
