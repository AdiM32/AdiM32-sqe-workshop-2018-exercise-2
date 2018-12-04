import {Var, Program, Function, If, Call, Assignment, Return, While} from './Structs';

let vars = [];
let out_vars = [];
let substitute = false;

// noinspection JSAnnotator
const type_func = {'Program': (pc) => Program('Program', subBody(pc.body)),
    'FunctionDeclaration': (pc) => subFunctionDeclaration(pc.id.name, pc.body.body, pc.params),
    'VariableDeclaration': (pc) => subVariableDeclaration(pc.declarations),
    'IfStatement': (pc) => subIfStatement('If', pc.test, pc.consequent, pc.alternate),
    'ElseIfStatement': (pc) => subIfStatement('ElseIf', pc.test, pc.consequent, pc.alternate),
    'BlockStatement': (pc) => subBody(pc.body),
    'CallExpression': (pc) => subCallExpression(pc.callee, pc.arguments),
    'ExpressionStatement': (pc) => symbolicSubstitution(pc.expression),
    'AssignmentExpression': (pc) => subAssignmentExpression(pc.left, pc.operator, pc.right),
    'ReturnStatement': (pc) => subReturnStatement(pc.argument),
    'WhileStatement': (pc) => subWhileStatement(pc.test, pc.body)};

const sideType_func = {'Identifier': (s) => subIdentifier(s),
    'Literal': (s) => {return s.value;},
    'BinaryExpression': (s) => {return '(' + subBinaryExpression(s) + ')';},
    'MemberExpression': (s) => {return s.object.name + '[' + subOneSide(s.property) + ']';},
    'ArrayExpression': (s) => subArrayExpression(s.elements)};

function symbolicSubstitution(parsedCode) {
    return type_func[parsedCode.type](parsedCode);
}

function subBody(body) {
    let newBody = [];
    body.forEach((b) => {
        let res = symbolicSubstitution(b);
        if (res === '' || (Array.isArray(res) && res.length === 0)) {
            return;
        }
        newBody.push(res);});
    return newBody;
}

function subFunctionDeclaration(name, body, params) {
    let paramsNames = [];
    params.forEach((p) => {paramsNames.push(p.name); vars.push(Var(p.name, '', false));});
    substitute = true;
    let newBody = subBody(body);
    substitute = false;
    return Function('Function', name, newBody, paramsNames);
}

function subIdentifier(s) {
    let res = s.name;
    vars.forEach((v) => {if (substitute && v.name === s.name && v.isLocal){res = v.value;}});
    return res;
}

function subVariableDeclaration(declarations) {
    declarations.forEach((element) => {
        let _var = Var(element.id.name, element.init === null? null : subOneSide(element.init), substitute);
        vars.push(_var);
        if (!substitute){
            out_vars.push(_var);
        }
    });
    return [];
}

function subOneSide(side) {
    return sideType_func[side.type](side);
}

function subBinaryExpression(binaryExpression) {
    return subOneSide(binaryExpression.left) + ' ' +
        binaryExpression.operator + ' ' +
        subOneSide(binaryExpression.right);
}

function subIfStatement(type, test, consequent, alternate) {
    let _test = subBinaryExpression(test);
    let save_vars = JSON.parse(JSON.stringify(vars));
    let _then = symbolicSubstitution(consequent);
    vars = JSON.parse(JSON.stringify(save_vars));
    let _else;
    if (alternate !== null) {
        if (alternate.type === 'IfStatement') {
            alternate.type = 'ElseIfStatement';
        }
        _else = symbolicSubstitution(alternate);
    }
    return If(type, _test, _then, _else);
}

function subCallExpression(callee, args) {
    let _args = [];
    args.forEach((arg) => _args.push(subOneSide(arg)));
    return Call('Call', callee.name , _args);
}

function subAssignmentExpression(left, operator, right) {
    let _left = left.name;
    let _right = subOneSide(right);
    let res = [];
    vars.forEach((v) => {if (v.name === _left){
        v.value = _right;
        if(substitute && !v.isLocal){
            res = Assignment('Assignment', _left, operator, _right);
        }}});
    return res;
}

function subReturnStatement(argument) {
    return Return('Return', subOneSide(argument));
}

function subWhileStatement(test, body) {
    let _test = subBinaryExpression(test);
    let _body = symbolicSubstitution(body);
    return While('While', _test, _body);
}

function subArrayExpression(elements) {
    let _elements = [];
    elements.forEach((e) => _elements.push(subOneSide(e)));
    return _elements;
}

function clearVars() {
    vars = [];
    out_vars = [];
    substitute = false;
}
export {symbolicSubstitution, clearVars, out_vars};