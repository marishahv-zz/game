import floor from 'lodash/floor';
import random from 'lodash/random';

export class MathTask {
    constructor(){          
        this.mathExpressionObj = this.getMathExpression();         
    };    

    getMathExpression(){
        let mathOperation = this.getMathOperation();
        switch (mathOperation) {
            case "+":   
                return this.getSumExpression();
                break;   
            case "-":  
                return this.getSubtractionExpression();
                break;
            case "*":  
                return this.getMultiplyExpression();
                break; 
            case "/":  
                return this.getDivideExpression();
                break;                             
        }   
    };

    getMathOperation(){
        return ["+", "-", "/", "*"][random(0, 3)];
    };

    createMathExpression(operand1, operand2, operator, result){
        return {operand_1: operand1,
                operand_2:  operand2,
                operator: operator,
                result: result};
    };

    getSumExpression(){
        let operand1 = random(500);    // TODO: magic numbers !!!!!!!!!!!!!!!!!
        let operand2 =  random(500);
        return this.createMathExpression(operand1, operand2, "+", operand1 + operand2);
    };

    getSubtractionExpression(){
        let operand1 = random(500);     // TODO: magic numbers !!!!!!!!!!!!!!!!!
        let operand2 =  random(500);
        if((operand1 - operand2) < 0){
            return this.createMathExpression(operand2, operand1, "-", operand2 - operand1);
        }
        else
            return this.createMathExpression(operand1, operand2, "-", operand1 - operand2);
    };

    getDivideExpression (){
        let dividend = random(10, 1000);    // TODO: magic numbers !!!!!!!!!!!!!!!!!
        let divisor =  random(1, 10);
        dividend = floor(dividend / divisor) * divisor;
        return this.createMathExpression(dividend, divisor,"/", dividend / divisor);
    };

    getMultiplyExpression(){
        let operand1 = random(300); // TODO: magic numbers !!!!!!!!!!!!!!!!!
        let operand2 =  random(10);
        return this.createMathExpression(operand1, operand2, "*", operand1 * operand2);
    };

    preventCharacter(evt){
        var charval= String.fromCharCode(evt.keyCode);
        if(isNaN(charval)){
            evt.preventDefault();
        }
        return true;
    };
}