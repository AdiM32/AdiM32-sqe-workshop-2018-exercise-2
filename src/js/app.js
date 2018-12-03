import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {clearVars, symbolicSubstitution} from './SymbolicSubstitution(';
import {clearView, buildView} from './View';
import {lines, evaluate} from './Evaluate';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        clearVars();
        clearView();
        let program = symbolicSubstitution(parsedCode);
        evaluate(program);
        buildView(lines.toString());
    });
});