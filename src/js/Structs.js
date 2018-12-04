const buildStruct = (...keys) => ((...values) => keys.reduce((obj, key, i) => {obj[key] = values[i]; return obj;} , {}));

const Var = buildStruct('name', 'value', 'isLocal');

const Program = buildStruct('type', 'body');
const Function = buildStruct('type', 'name', 'body', 'params');
const If = buildStruct('type', 'test', 'then', 'else');
const Call = buildStruct('type', 'collee', 'args');
const Assignment = buildStruct('type', 'left', 'op', 'right');
const Return = buildStruct('type', 'argument');
const While = buildStruct('type', 'test', 'body');
const Line = buildStruct('string', 'color', 'tabs');


export {Var, Program, Function, If, Call, Assignment, Return, While, Line};