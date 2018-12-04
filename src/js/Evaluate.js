import {Var, Line} from './Structs';

let tabs = 0;
let lines = [];
let inputVector = [];

const char_to_keep = ['(', ')', '[', ']', '+', '-', '=', '<', '>', '*', '/', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

const type_func = {'Program': (p) => evaluateBody(p.body),
    'Function': (p) => inputVector.push(Var(p.name, [p.params, p.body], false)),
    'If': (p) => evaluateIf(p.test, p.then, p.else),
    'ElseIf': (p) => evaluateIf(p.test, p.then, p.else),
    'Call': (p) => evaluateCall(p.collee, p.args),
    'Assignment': (p) => lines.push(Line(p.left + ' ' + p.op + ' ' + p.right + ';', 'black', tabs)),
    'Return': (p) => lines.push(Line('return ' + p.argument + ';', 'black', tabs)),
    'While': (p) => evaluateWhile(p.test, p.body)};


function evaluate(program) {
    return type_func[program.type](program);
}

function evaluateBody(body) {
    body.forEach((b) => evaluate(b));
}

function evaluateFunction(name, body, params) {
    let _prams = '';
    for (let i=0; i<params.length; i++){
        _prams += params[i];
        if (i !== params.length -1){
            _prams += ', ';
        }
    }
    lines.push(Line('function ' + name +'(' + _prams + '){', 'black', tabs));
    tabs++;
    evaluateBody(body);
    tabs--;
    lines.push(Line('}', 'black', tabs));
}

function evaluateIf(test, then, _else) {
    let isTrue = evaluatePred(test);
    let color = isTrue? 'green':'red';
    lines.push(Line('if (' + test + '){', color, tabs));
    tabs++;
    evaluateBody(then);
    tabs--;
    lines.push(Line('}', 'black', tabs));
    if (_else !== null && _else !== undefined){
        lines.push(Line('else {', 'black', tabs));
        tabs++;
        Array.isArray(_else)? evaluateBody(_else) : evaluate(_else);
        tabs--;
        lines.push(Line('}', 'black', tabs));
    }
}

function evaluateCall(collee, args) {
    for (let i = 0; i<inputVector.length; i++){
        if (inputVector[i].name === collee){
            let saveIV = JSON.parse(JSON.stringify(inputVector));
            insertToIV((inputVector[i].value)[0], args);
            evaluateFunction(collee, (inputVector[i].value)[1], (inputVector[i].value)[0]);
            inputVector = JSON.parse(JSON.stringify(saveIV));
            break;
        }
    }
}

function insertToIV(params, args) {
    for (let i = 0; i<params.length; i++){
        inputVector.push(Var(params[i], args[i], false));
    }
}

function evaluatePred(pred){
    let temp = '';

    for (let i = 0; i<pred.length; i++){
        if (toKeep(pred[i])){
            temp += pred[i];
        }
        else if (pred[i] === ' '){
            continue;
        }
        else {
            let j = findEndOfName(pred, i);
            let val = getValue(pred.substr(i, j-i));
            val = fixVal(val);
            i = j - 1;
            temp += val;
        }
    }
    return eval(temp);
}

function fixVal(val) {
    let res = '';
    if (Array.isArray(val)){
        res += '[';
        val.forEach((e) => res += fixVal(e) + ', ');
        res = res.substr(0, res.length - 2) + ']';
    } else if (typeof val === 'string'){
        res += '"' + val + '"';
    } else
        res = val;
    return res;
}

function toKeep(char) {
    let index = char_to_keep.indexOf(char);
    return  index !== -1;
}

function findEndOfName(string, i) {
    let j = i + 1;
    let string_j = string[j];
    while (j < string.length && string_j !== ' ' && string_j !== ')' && string_j !== '[') {
        j++;
        string_j = string[j];
    }
    return j;
}

function getValue(name) {
    for(let i = 0; i<inputVector.length; i++){
        if (inputVector[i].name === name){
            return inputVector[i].value;
        }
    }
}

function evaluateWhile(test, body) {
    let isTrue = evaluatePred(test);
    let color = isTrue? 'green' : 'red';
    lines.push(Line('while (' + test + '){', color, tabs));
    tabs++;
    evaluateBody(body);
    tabs--;
    lines.push(Line('}', 'black', tabs));
}

function clearEvaluator() {
    lines = [];
    inputVector = [];
}

function initIV(out_vars) {
    inputVector = JSON.parse(JSON.stringify(out_vars));
}

export {evaluate, lines, clearEvaluator, initIV};