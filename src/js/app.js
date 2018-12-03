import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {clearVars, symbolicSubstitution} from './SymbolicSubstitution(';
import {clearView, buildView} from './View';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        clearVars();
        clearView();
        let program = symbolicSubstitution(parsedCode);
        buildView(program.toString());
    });
});