import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {clearModel, buildModel} from './Model';
import {clearView, buildView} from './View';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        clearModel();
        clearView();
        buildModel(parsedCode);
        buildView();
    });
});