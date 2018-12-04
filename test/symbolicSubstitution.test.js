import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';
import {symbolicSubstitution, clearVars} from '../src/js/SymbolicSubstitution';

function test_Struct(test, result){
    let subProgram = symbolicSubstitution(parseCode(test));
    assert.equal(JSON.stringify(subProgram), JSON.stringify(result));
    clearVars();
}
describe('arrays', () =>{
    it('should substituted vars with arrays', () => {
        test_Struct('function goo(arr){\n\tlet a = arr[0];\n\tlet b = arr[1];\n\tlet c = arr[2];\n\n\tif (a < 3){\n' +
            '\t\treturn a;\n\t}\n\telse if (a > 3){\n\t\treturn b;\n\t} else {\n\t\treturn c;\n\t}\n}\n' +
            'goo([6, "# number 1", true]);', {'type': 'Program', 'body': [{'type': 'Function', 'name': 'goo',
            'body': [{'type': 'If', 'test': 'arr[0] < 3', 'then': [{ 'type': 'Return', 'argument': 'arr[0]'}],
                'else': {'type': 'ElseIf', 'test': 'arr[0] > 3', 'then': [{'type': 'Return', 'argument': 'arr[1]'}],
                    'else': [{'type': 'Return', 'argument': 'arr[2]'}]}}], 'params': ['arr']}, {'type': 'Call',
            'collee': 'goo', 'args': [[6, '# number 1', true]]}]});
    });
});