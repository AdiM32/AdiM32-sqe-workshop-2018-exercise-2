function buildView(lines) {
    let view = document.getElementById('view');
    lines.forEach((line) => buildLine(view, line.string, line.color, line.tabs));
}

function buildLine(view, string, color, tabs) {
    let div = document.createElement('div');
    div.setAttribute('class',color + '_code');
    div.appendChild(document.createTextNode(makeTabs(tabs) + string));
    view.appendChild(div);
}

function makeTabs(tabs) {
    let res = '';
    for (let i = 0; i<tabs; i++){
        res += '\t';
    }
    return res;
}
function clearView() {
    let view = document.getElementById('view');
    view.innerHTML = '';
}

export {buildView, clearView};