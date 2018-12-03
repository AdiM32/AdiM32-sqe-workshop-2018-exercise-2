import {Line} from './Structs';

let tabs = 0;
let lines = [];
let inputVector = [];

const type_func = {'Program': (p) => evaluateBody(p.body),
    'Function': (p) => evaluateFunction(p.name, p.body, p.params),
    'If': (p) => evaluateIf(p.test, p.then, p.else),
    'ElseIf': (p) => p,
    'Call': (p) => p,
    'Assignment': (p) => p,
    'Return': (p) => p};


function evaluate(program) {
    if (program.type in type_func){
        return type_func[program.type](program);
    }
    return [];
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

function evaluateIf(type, test, then, _else) {
    let isTrue = evaluatePred(test);
    let color = isTrue? 'green':'red';
    type = type === 'If'? 'if' : 'else if';
    lines.push(Line(type + ' (' + test + '){', color, tabs));
    tabs++;
    evaluateBody(then);
    tabs--;
    lines.push(Line('}', 'black', tabs));
    if (_else !== null){
        lines.push(Line('else {', 'black', tabs));
        tabs++;
        evaluateBody(_else);
        tabs--;
        lines.push(Line('}', 'black', tabs));
    }
}

function evaluatePred(pred){
    return pred;
}

export {evaluate, lines};