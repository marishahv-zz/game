import {Monster} from "../model/Monster";
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
            x: (window.innerWidth - (window.innerWidth / 5)),
            y: window.innerHeight - 420,
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
                    width: (function(){
                            switch (index) {
                                case 0:
                                    return 210;     
                                    break;
                                case 1:
                                    return 215;
                                    break;
                                default: return 220;
                            }
                        })(),
                    height: (function(){
                            switch (index) {
                                case 0:
                                    return 190;
                                    break;
                                case 1:
                                    return 215;
                                    break;
                                default: return 220;
                            }
                        })(),
                    x: (function(){
                            switch (index) {
                                case 0:
                                    return 39;
                                    break;
                                case 1:
                                    return 5;
                                    break;
                                case 2:
                                    return 2;
                                    break;
                            }
                        })(),
                    y:  (function(){
                        switch (index) {
                            
                            case 1:
                                return 72;
                                break;
                            case 2:
                                return 158;
                                break;
                            default: return 0;
                        }
                    })()
                });
                this.group.add(konvaImage);
                this.layer.add(this.group);
                this.monsterView.displayLayer(this.layer);           
            });
        });
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
