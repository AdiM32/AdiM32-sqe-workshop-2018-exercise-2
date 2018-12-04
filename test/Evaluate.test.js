import assert from 'assert';
import {lines, clearEvaluator, evaluate, initIV} from '../src/js/Evaluate';

function test_Struct(test, result, init){
    initIV(init === undefined? [] : init);
    evaluate(test);
    assert.equal(JSON.stringify(lines), JSON.stringify(result));
    clearEvaluator();
}

describe('arrays', () =>{
    it('should evaluate vars with arrays', () => {
        test_Struct({'type': 'Program', 'body': [{'type': 'Function', 'name': 'goo',
            'body': [{'type': 'If', 'test': 'arr[0] < 3', 'then': [{ 'type': 'Return', 'argument': 'arr[0]'}],
                'else': {'type': 'ElseIf', 'test': 'arr[0] > 3', 'then': [{'type': 'Return', 'argument': 'arr[1]'}],
                    'else': [{'type': 'Return', 'argument': 'arr[2]'}]}}], 'params': ['arr']}, {'type': 'Call',
            'collee': 'goo', 'args': [[6, '# number 1', true]]}]}, [{'string': 'function goo(arr){',
            'color': 'black', 'tabs': 0}, {'string': 'if (arr[0] < 3){', 'color': 'red', 'tabs': 1},
        {'string': 'return arr[0];', 'color': 'black', 'tabs': 2}, {'string': '}', 'color': 'black', 'tabs': 1},
        {'string': 'else {', 'color': 'black', 'tabs': 1}, {'string': 'if (arr[0] > 3){', 'color': 'green', 'tabs': 2},
        {'string': 'return arr[1];', 'color': 'black', 'tabs': 3}, {'string': '}', 'color': 'black', 'tabs': 2},
        {'string': 'else {', 'color': 'black', 'tabs': 2}, {'string': 'return arr[2];', 'color': 'black', 'tabs': 3},
        {'string': '}', 'color': 'black', 'tabs': 2}, {'string': '}', 'color': 'black', 'tabs': 1}, {'string': '}',
            'color': 'black', 'tabs': 0}]);
    });
});

describe('assignment example 1', () =>{
    it('should evaluate example 1', () => {
        test_Struct({'type': 'Program','body': [{'type': 'Function', 'name': 'foo', 'body': [{'type': 'If',
            'test': '((x + 1) + y) < z', 'then': [{'type': 'Return', 'argument': '(((x + y) + z) + (0 + 5))'}],
            'else': {'type': 'ElseIf', 'test': '((x + 1) + y) < (z * 2)', 'then': [{'type': 'Return',
                'argument': '(((x + y) + z) + ((0 + x) + 5))'}], 'else': [{'type': 'Return',
                'argument': '(((x + y) + z) + ((0 + z) + 5))'}]}}], 'params': ['x', 'y', 'z']}, {'type': 'Call',
            'collee': 'foo', 'args': [1, 2, 3]}]}, [{'string': 'function foo(x, y, z){', 'color': 'black', 'tabs': 0},
            {'string': 'if (((x + 1) + y) < z){', 'color': 'red', 'tabs': 1},
            {'string': 'return (((x + y) + z) + (0 + 5));', 'color': 'black', 'tabs': 2}, {'string': '}',
                'color': 'black', 'tabs': 1}, {'string': 'else {', 'color': 'black', 'tabs': 1},
            {'string': 'if (((x + 1) + y) < (z * 2)){', 'color': 'green', 'tabs': 2},
            {'string': 'return (((x + y) + z) + ((0 + x) + 5));', 'color': 'black', 'tabs': 3}, {'string': '}',
                'color': 'black', 'tabs': 2}, {'string': 'else {', 'color': 'black', 'tabs': 2},
            {'string': 'return (((x + y) + z) + ((0 + z) + 5));', 'color': 'black', 'tabs': 3}, {'string': '}',
                'color': 'black', 'tabs': 2}, {'string': '}', 'color': 'black', 'tabs': 1}, {'string': '}',
                'color': 'black', 'tabs': 0}]);
    });
});

describe('assignment example 2', () =>{
    it('should evaluate example 2 while green', () => {
        test_Struct({'type': 'Program',
            'body': [{'type': 'Function', 'name': 'foo', 'body': [{'type': 'While', 'test': '(x + 1) < z',
                'body': [{'type': 'Assignment', 'left': 'z', 'op': '=', 'right': '(((x + 1) + ((x + 1) + y)) * 2)'}]},
            {'type': 'Return', 'argument': 'z'}], 'params': ['x', 'y', 'z']}, {'type': 'Call', 'collee': 'foo',
                'args': [1, 2, 3]}]}, [{'string': 'function foo(x, y, z){', 'color': 'black', 'tabs': 0},
            {'string': 'while ((x + 1) < z){', 'color': 'green', 'tabs': 1},
            {'string': 'z = (((x + 1) + ((x + 1) + y)) * 2);', 'color': 'black', 'tabs': 2}, {'string': '}',
                'color': 'black', 'tabs': 1}, {'string': 'return z;', 'color': 'black', 'tabs': 1}, {'string': '}',
                'color': 'black', 'tabs': 0}]);
    });
});

describe('assignment example 2', () =>{
    it('should evaluate example 2 while red', () => {
        test_Struct({'type': 'Program',
            'body': [{'type': 'Function', 'name': 'foo', 'body': [{'type': 'While', 'test': '(x + 1) < z',
                'body': [{'type': 'Assignment', 'left': 'z', 'op': '=', 'right': '(((x + 1) + ((x + 1) + y)) * 2)'}]},
            {'type': 'Return', 'argument': 'z'}], 'params': ['x', 'y', 'z']}, {'type': 'Call', 'collee': 'foo',
                'args': [10, 2, 3]}]}, [{'string': 'function foo(x, y, z){', 'color': 'black', 'tabs': 0},
            {'string': 'while ((x + 1) < z){', 'color': 'red', 'tabs': 1},
            {'string': 'z = (((x + 1) + ((x + 1) + y)) * 2);', 'color': 'black', 'tabs': 2}, {'string': '}',
                'color': 'black', 'tabs': 1}, {'string': 'return z;', 'color': 'black', 'tabs': 1}, {'string': '}',
                'color': 'black', 'tabs': 0}]);
    });
});

describe('no substituted ', () =>{
    it('should not evaluate x outside of foo', () => {
        test_Struct({'type': 'Program', 'body': [{'type': 'Function', 'name': 'foo', 'body': [{'type': 'If',
            'test': '(x + 1) < (((x + 1) + y) + z)', 'then': [{'type': 'Return',
                'argument': '(((x + 1) + ((x + 1) + y)) + z)'}]}, {'type': 'Return',
            'argument': '((x + 1) + ((x + 1) + y))'}], 'params': ['x', 'y', 'z']}, {'type': 'Call', 'collee': 'foo',
            'args': [1, 'x', 3.17]}]}, [{'string': 'function foo(x, y, z){', 'color': 'black', 'tabs': 0},
            {'string': 'if ((x + 1) < (((x + 1) + y) + z)){', 'color': 'red', 'tabs': 1},
            {'string': 'return (((x + 1) + ((x + 1) + y)) + z);', 'color': 'black', 'tabs': 2},
            {'string': '}', 'color': 'black', 'tabs': 1}, {'string': 'return ((x + 1) + ((x + 1) + y));',
                'color': 'black', 'tabs': 1}, {'string': '}', 'color': 'black', 'tabs': 0}], [{'name': 'x', 'value': 2,
            'isLocal': false}]);
    });
});

describe('no substituted ', () =>{
    it('should not substituted x and y outside of foo', () => {
        test_Struct({'type': 'Program', 'body': [{'type': 'Function',
            'name': 'foo', 'body': [{'type': 'If', 'test': '(x + 1) > y', 'then': [{'type': 'Assignment', 'left': 'x',
                'op': '=', 'right': 4}]}, {'type': 'Assignment', 'left': 'x', 'op': '=', 'right': '(x + 1)'},
            {'type': 'Return', 'argument': 'x'}], 'params': ['x', 'y']}, {'type': 'Call', 'collee': 'foo',
            'args': ['y', 'x']}]}, [{'string': 'function foo(x, y){', 'color': 'black', 'tabs': 0},
            {'string': 'if ((x + 1) > y){', 'color': 'red', 'tabs': 1}, {'string': 'x = 4;', 'color': 'black',
                'tabs': 2}, {'string': '}', 'color': 'black', 'tabs': 1}, {'string': 'x = (x + 1);', 'color': 'black',
                'tabs': 1}, {'string': 'return x;', 'color': 'black', 'tabs': 1}, {'string': '}', 'color': 'black',
                'tabs': 0}], [{'name': 'x', 'value': 2, 'isLocal': false}, {'name': 'y', 'value': 5,
            'isLocal': false}]);
    });
});