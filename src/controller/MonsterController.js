import {Monster} from "../model/Monster";
import * as APPEARANCE from "../constants/appearance";
import {MonsterView} from "../view/MonsterView";
import {Utils} from "../utils/Utils";
import Konva from 'konva';

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
            x: APPEARANCE.COORDINATES.monster.x,
            y: APPEARANCE.COORDINATES.monster.y,
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
                return APPEARANCE.HEROES.monster.width.head;    
                break;
            case 1:
                return APPEARANCE.HEROES.monster.width.body;
                break;
            case 2:
                return APPEARANCE.HEROES.monster.width.feet;
                break;
        }
    };

    getBodyPartHeight(index){
        switch (index) {
            case 0:
                return APPEARANCE.HEROES.monster.height.head;
                break;
            case 1:
                return APPEARANCE.HEROES.monster.height.body;
                break;
            case 2:
                return APPEARANCE.HEROES.monster.height.feet;
                break;
        }
    };

    getBodyPartPositionX(index){
        switch (index) {
            case 0:
                return APPEARANCE.HEROES.monster.bodyPartPositionX.head;
                break;
            case 1:
                return APPEARANCE.HEROES.monster.bodyPartPositionX.body;
                break;
            case 2:
                return APPEARANCE.HEROES.monster.bodyPartPositionX.feet;
                break;
        }
    };

    getBodyPartPositionY(index){
        switch (index) {
            case 0:
                return APPEARANCE.HEROES.monster.bodyPartPositionY.head;
                break;
            case 1:
                return APPEARANCE.HEROES.monster.bodyPartPositionY.body;
                break;
            case 2:
                return APPEARANCE.HEROES.monster.bodyPartPositionY.feet;
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
