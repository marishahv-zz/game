import floor from 'lodash/floor';
import random from 'lodash/random';
import { MATH } from "../constants/tasks";

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
        return MATH.operations[random(0, MATH.operations.length - 1)];
    };

    createMathExpression(operand1, operand2, operator, result){
        return {operand_1: operand1,
                operand_2:  operand2,
                operator: operator,
                result: result};
    };

    getSumExpression(){
      let operand1 = random(MATH.sum.upperBound);
      let operand2 =  random(MATH.sum.upperBound);
      return this.createMathExpression(operand1, operand2, "+", operand1 + operand2);
    };

    getSubtractionExpression(){
        let operand1 = random(MATH.subtraction.upperBound);
        let operand2 =  random(MATH.subtraction.upperBound);
        if((operand1 - operand2) < 0){
            return this.createMathExpression(operand2, operand1, "-", operand2 - operand1);
        }
        else
            return this.createMathExpression(operand1, operand2, "-", operand1 - operand2);
    };

    getDivideExpression (){
        let dividend = random(MATH.division.lowerDividend, MATH.division.upperDividend);
        let divisor =  random(MATH.division.lowerDivisor, MATH.division.upperDivisor);
        dividend = floor(dividend / divisor) * divisor;
        return this.createMathExpression(dividend, divisor,"/", dividend / divisor);
    };

    getMultiplyExpression(){
        let operand1 = random(MATH.multiplication.upperBound);
        let operand2 =  random(MATH.multiplication.lowerBound);
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
