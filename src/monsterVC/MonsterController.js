import {Monster} from "../model/Monster";
import {MonsterView} from "../monsterVC/MonsterView";
import {Utils} from "../utils/Utils";
import Konva from 'konva';
import { numbers } from "../constants/numbers";

export class MonsterController {
    constructor(model, view){
        this.monster = model;
        this.monsterView = view;
        this.animationMove = null;
        this.utils = new Utils();
        this.layer = new Konva.Layer({
            listening: true
        });
        this.group = new Konva.Group({
            x: numbers.monsterInitialCoordinateX,
            y: numbers.monsterInitialCoordinateY,
            id: "monsterId"
        });
    };

    createMonster (){
        let monsterBodyArr = [];
        let y, x, width, height;

        this.utils.getImages(this.monster.body)
        .then((images) => {
            images.forEach((bodyPart, index) => {
                let konvaImage = new Konva.Image({
                    image: bodyPart,
                    width: this.getBodyPartWidth(index),
                    height: this.getBodyPartHeight(index),
                    x: this.getBodyPartPositionX(index),
                    y: this.getBodyPartPositionY(index)
                });
                this.group.add(konvaImage);
                this.layer.add(this.group);
                this.monsterView.displayLayer(this.layer);
            });
        });
    };
    getBodyPartWidth(index){
        switch (index) {
            case 0:
                return numbers.monsterWidth.head;
                break;
            case 1:
                return numbers.monsterWidth.body;
                break;
            case 2:
                return numbers.monsterWidth.feet;
                break;
        }
    };

    getBodyPartHeight(index){
        switch (index) {
            case 0:
                return numbers.monsterHeight.head;
                break;
            case 1:
                return numbers.monsterHeight.body;
                break;
            case 2:
                return numbers.monsterHeight.feet;
                break;
        }
    };

    getBodyPartPositionX(index){
        switch (index) {
            case 0:
                return numbers.monsterBodyPartPositionX.head;
                break;
            case 1:
                return numbers.monsterBodyPartPositionX.body;
                break;
            case 2:
                return numbers.monsterBodyPartPositionX.feet;
                break;
        }
    };

    getBodyPartPositionY(index){
        switch (index) {
            case 0:
                return numbers.monsterBodyPartPositionY.head;
                break;
            case 1:
                return numbers.monsterBodyPartPositionY.body;
                break;
            case 2:
                return numbers.monsterBodyPartPositionY.feet;
                break;
        }
    };
    monsterMove (){
        this.animationMove =  this.monsterView.initAnimationMove(this.layer);
        this.monsterView.startAnimation(this.animationMove);
    };

    destroyMonster() {
        this.monsterView.stopAnimation(this.animationMove);
        this.monsterView.removeLayer(this.layer);
    };
}
