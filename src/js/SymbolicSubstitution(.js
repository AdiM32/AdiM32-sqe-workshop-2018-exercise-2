import {Var, Program, Function, If, Call, Assignment, Return} from './Structs';

let vars = [];
let substitute = false;

const type_func = {'Program': (pc) => Program('Program', subBody(pc.body)),
    'FunctionDeclaration': (pc) => subFunctionDeclaration(pc.id.name, pc.body.body, pc.params),
    'VariableDeclaration': (pc) => subVariableDeclaration(pc.declarations),
    'IfStatement': (pc) => subIfStatement('If', pc.test, pc.consequent, pc.alternate),
    'ElseIfStatement': (pc) => subIfStatement('ElseIf', pc.test, pc.consequent, pc.alternate),
    'BlockStatement': (pc) => subBody(pc.body),
    'CallExpression': (pc) => subCallExpression(pc.callee, pc.arguments),
    'ExpressionStatement': (pc) => symbolicSubstitution(pc.expression),
    'AssignmentExpression': (pc) => subAssignmentExpression(pc.left, pc.operator, pc.right),
    'ReturnStatement': (pc) => subReturnStatement(pc.argument)};

const sideType_func = {'Identifier': (s) => subIdentifier(s),
    'Literal': (s) => {return s.raw;},
    'BinaryExpression': (s) => {return '(' + subBinaryExpression(s) + ')';},
    'MemberExpression': (s) => {return s.object.name + '[' + subOneSide(s.property) + ']';},
    'UnaryExpression': (s) =>  {return s.operator + subOneSide(s.argument);},
    'UpdateExpression': (s) => {return s.argument.name + s.operator;}};

function symbolicSubstitution(parsedCode) {
    if (parsedCode.type in type_func){
        return type_func[parsedCode.type](parsedCode);
    }
    return [];
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
    return Function('Function', name, newBody, paramsNames);
}

function subIdentifier(s) {
    let res = s.name;
    vars.forEach((v) => {if (substitute && v.name === s.name && v.isLocal){res = v.value;}});
    return res;
}

function subVariableDeclaration(declarations) {
    let _vars = [];
    declarations.forEach((element) => {
        let _var = Var(element.id.name, element.init === null? null : subOneSide(element.init), substitute);
        vars.push(_var);
        if (!substitute){
            _vars.push(_var);
        }
    });
    return _vars;
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
    vars.forEach((v) => {if (v.name === _left){
        v.value = _right;
        if(!v.isLocal){
            return Assignment('Assignment', _left, operator, _right);
        }}});
    return [];
}

function subReturnStatement(argument) {
    return Return('Return', subOneSide(argument));
}

function clearVars() {
    vars = [];
    substitute = false;
}
export {symbolicSubstitution, clearVars};