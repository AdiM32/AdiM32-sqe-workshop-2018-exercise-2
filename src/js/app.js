import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {clearVars, symbolicSubstitution, out_vars} from './SymbolicSubstitution';
import {clearView, buildView} from './View';
import {lines, clearEvaluator, evaluate, initIV} from './Evaluate';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        clearVars();
        clearEvaluator();
        clearView();
        let program = symbolicSubstitution(parsedCode);
        initIV(out_vars);
        evaluate(program);
        buildView(lines);
        // $('#parsedCode').val(JSON.stringify(lines, null, 2));
    });
});