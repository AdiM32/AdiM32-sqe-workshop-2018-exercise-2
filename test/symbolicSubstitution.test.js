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

describe('assignment example 1', () =>{
    it('should substituted example 1', () => {
        test_Struct('function foo(x, y, z){\n\tlet a = x + 1;\n\tlet b = a + y;\n\tlet c = 0;\n\t\n\tif (b < z) {\n' +
            '\t\tc = c + 5;\n\t\treturn x + y + z + c;\n\t} else if (b < z * 2) {\n\t\tc = c + x + 5;\n' +
            '\t\treturn x + y + z + c;\n\t} else {\n\t\tc = c + z + 5;\n\treturn x + y + z + c;\n\t}\n}\n' +
            'foo(1, 2, 3);', {'type': 'Program','body': [{'type': 'Function', 'name': 'foo', 'body': [{'type': 'If',
            'test': '((x + 1) + y) < z', 'then': [{'type': 'Return', 'argument': '(((x + y) + z) + (0 + 5))'}],
            'else': {'type': 'ElseIf', 'test': '((x + 1) + y) < (z * 2)', 'then': [{'type': 'Return',
                'argument': '(((x + y) + z) + ((0 + x) + 5))'}], 'else': [{'type': 'Return',
                'argument': '(((x + y) + z) + ((0 + z) + 5))'}]}}], 'params': ['x', 'y', 'z']}, {'type': 'Call',
            'collee': 'foo', 'args': [1, 2, 3]}]});
    });
});

describe('assignment example 2', () =>{
    it('should substituted example 2', () => {
        test_Struct('function foo(x, y, z){\n\tlet a = x + 1;\n\tlet b = a + y;\n\tlet c = 0;\n\t\n\twhile (a < z) {\n'+
            '\t\tc = a + b;\n\t\tz = c * 2;\n\t}\n\t\n\treturn z;\n}\nfoo(1, 2, 3);', {'type': 'Program',
            'body': [{'type': 'Function', 'name': 'foo', 'body': [{'type': 'While', 'test': '(x + 1) < z',
                'body': [{'type': 'Assignment', 'left': 'z', 'op': '=', 'right': '(((x + 1) + ((x + 1) + y)) * 2)'}]},
            {'type': 'Return', 'argument': 'z'}], 'params': ['x', 'y', 'z']}, {'type': 'Call', 'collee': 'foo',
                'args': [1, 2, 3]}]});
    });
});

describe('no substituted ', () =>{
    it('should not substituted x outside of foo', () => {
        test_Struct('function foo(x, y, z){\n\tlet a = x + 1;\n\tlet b = a + y;\n\tlet c;\n\tc = z;\n\t' +
            '\n\tif(a < b + c) {\n\t\treturn a + b + c;\n\t}\n\t\n\treturn a + b;\n}\nlet x = 2;\nfoo(1, x, 3.17);',
        {'type': 'Program', 'body': [{'type': 'Function', 'name': 'foo', 'body': [{'type': 'If',
            'test': '(x + 1) < (((x + 1) + y) + z)', 'then': [{'type': 'Return',
                'argument': '(((x + 1) + ((x + 1) + y)) + z)'}]}, {'type': 'Return',
            'argument': '((x + 1) + ((x + 1) + y))'}], 'params': ['x', 'y', 'z']}, {'type': 'Call', 'collee': 'foo',
            'args': [1, 'x', 3.17]}]});
    });
});

describe('no substituted ', () =>{
    it('should not substituted x and y outside of foo', () => {
        test_Struct('function foo(x, y){\n\tlet a = x + 1;\n\t\n\tif(a > y) {\n\t\tx = 4;\n\t}\n\tx = x + 1;\t\n' +
            '\treturn x;\n}\nlet x = 2;\nlet y;\ny = 5;\nfoo(y, x);', {'type': 'Program', 'body': [{'type': 'Function',
            'name': 'foo', 'body': [{'type': 'If', 'test': '(x + 1) > y', 'then': [{'type': 'Assignment', 'left': 'x',
                'op': '=', 'right': 4}]}, {'type': 'Assignment', 'left': 'x', 'op': '=', 'right': '(x + 1)'},
            {'type': 'Return', 'argument': 'x'}], 'params': ['x', 'y']}, {'type': 'Call', 'collee': 'foo',
            'args': ['y', 'x']}]});
    });
});