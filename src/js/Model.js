let model = [];
let vars = [];
const buildStruct = (...keys) => ((...values) => keys.reduce((obj, key, i) => {obj[key] = values[i]; return obj;} , {}));
const Row = buildStruct('Line', 'Type', 'Name', 'Condition', 'Value');
const Var = buildStruct('name', 'value', 'isLocal');


const type_func = {'Program': (pc) => parseBody(pc.body),
    'FunctionDeclaration': (pc) => parseFunctionDeclaration(pc.loc.start.line, pc.params, pc.id.name, pc.body),
    'BlockStatement': (pc) => parseBody(pc.body),
    'VariableDeclaration': (pc) => parseVariableDeclaration(pc.declarations),
    'ExpressionStatement': (pc) => buildModel(pc.expression),
    'AssignmentExpression': (pc) => parseAssignmentExpression(pc.left, pc.right, pc.loc.start.line),
    'WhileStatement': (pc) => parseWhileStatement(pc.test, pc.body, pc.loc.start.line),
    'IfStatement': (pc) => parsedIfStatement(pc.loc.start.line, pc.type, pc.test, pc.consequent, pc.alternate),
    'ElseIfStatement': (pc) => parsedIfStatement(pc.loc.start.line, pc.type, pc.test, pc.consequent, pc.alternate),
    'ReturnStatement': (pc) => parsedReturnStatement(pc.loc.start.line, pc.argument),
    'ForStatement': (pc) => parseForStatement(pc.loc.start.line, pc.body, pc.init, pc.test, pc.update)};

const sideType_func = {'Identifier': (s) => {return s.name;},
    'Literal': (s) => {return s.raw;},
    'BinaryExpression': (s) => {return '(' + parseBinaryExpression(s) + ')';},
    'MemberExpression': (s) => {return s.object.name + '[' + pareOneSide(s.property) + ']';},
    'UnaryExpression': (s) =>  {return s.operator + pareOneSide(s.argument);},
    'UpdateExpression': (s) => {return s.argument.name + s.operator;}};

const type_func_sub = {'VariableDeclaration': (pc) => subVariableDeclaration(pc.declarations),
    'IfStatement': (pc) => subIfStatement(pc.test, pc.consequent, pc.alternate)};

const sideType_func_sub = {'Identifier': (s) => subIdentifier(s),
    'Literal': (s) => {return s.raw;},
    'BinaryExpression': (s) => {return '(' + subBinaryExpression(s) + ')';},
    'MemberExpression': (s) => {return s.object.name + '[' + subOneSide(s.property) + ']';},
    'UnaryExpression': (s) =>  {return s.operator + subOneSide(s.argument);},
    'UpdateExpression': (s) => {return s.argument.name + s.operator;}};

function subIdentifier(s) {
    let res = s.name;
    vars.forEach((v) => {if (v.name === s.name && v.isLocal){res = v.value;}});
    return res;
}

function buildModel(parsedCode) {
    if (parsedCode.type in type_func){
        type_func[parsedCode.type](parsedCode);
    }
}

function parseBody(body) {
    body.forEach((element) => buildModel(element));
}

function parseFunctionDeclaration(line, params, name, body) {
    let paramsNames = parseParam(params);
    symbolicSubstitution(body.body, paramsNames);
}

function symbolicSubstitution(body, prams) {
    body.forEach((b) => {if (b.type in type_func_sub){type_func_sub[b.type](b);}});
    return body + prams;
}

function parseParam(params) {
    let paramsNames = [];
    params.forEach((param) => {paramsNames.push(param.name); vars.push(Var(param.name, null, false));});
    return paramsNames;
}

function parseVariableDeclaration(declarations) {
    declarations.forEach((element) => {
        model.push(Row(element.loc.start.line, 'variable declaration', element.id.name, '' ,
            element.init === null? 'null (or nothing)': pareOneSide(element.init)));
    });
}

function subVariableDeclaration(declarations) {
    declarations.forEach((element) => {
        vars.push(Var(element.id.name, element.init === null? null : subOneSide(element.init), true));
    });
}

function pareOneSide(side) {
    return sideType_func[side.type](side);
}

function subOneSide(side) {
    return sideType_func_sub[side.type](side);
}

function parseBinaryExpression(binaryExpression) {
    return pareOneSide(binaryExpression.left) + ' ' +
        binaryExpression.operator + ' ' +
        pareOneSide(binaryExpression.right);
}

function subBinaryExpression(binaryExpression) {
    return subOneSide(binaryExpression.left) + ' ' +
        binaryExpression.operator + ' ' +
        subOneSide(binaryExpression.right);
}

function parseWhileStatement(test, body, line) {
    model.push(Row(line, 'while statement', '', parseBinaryExpression(test), ''));
    buildModel(body);
}

function parseAssignmentExpression(left, right, line) {
    model.push(Row(line, 'assignment expression', left.name, '', find_init(right)));
}

function parsedIfStatement(line, type, test, consequent, alternate) {
    model.push(Row(line, type[0] === 'E'? 'else if statement': 'if statement', '', parseBinaryExpression(test), ''));
    buildModel(consequent);
    if (alternate !== null) {
        if (alternate.type === 'IfStatement') {
            alternate.type = 'ElseIfStatement';
        }
        buildModel(alternate);
    }
}

function subIfStatement(test, consequent, alternate) {
    let sub_test = subBinaryExpression(test);
    buildModel(consequent);
    if (alternate !== null) {
        if (alternate.type === 'IfStatement') {
            alternate.type = 'ElseIfStatement';
        }
        buildModel(alternate);
    }
}

function parsedReturnStatement(line, argument) {
    model.push(Row(line, 'return statement', '', '', pareOneSide(argument)));
}

function find_init(init) {
    if (init.type === 'Literal')
        return init.raw;
    return parseBinaryExpression(init);
}

function parseForStatement(line, body, init, test, update) {
    let Condition = init.declarations[0].id.name + ' = ' + pareOneSide(init.declarations[0].init) + '; ' +
        parseBinaryExpression(test) + '; ' + pareOneSide(update);
    model.push(Row(line, 'for statement', '', Condition, ''));
    buildModel(body);
}
function clearModel() {
    model = [];
}

export {buildModel, clearModel, model};