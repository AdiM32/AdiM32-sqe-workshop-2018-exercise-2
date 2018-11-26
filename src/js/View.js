import {model} from './Model';

function buildView() {
    model.forEach(do_this);
}

function do_this(x) {
    let view = document.getElementById('view');

    let red_div = document.createElement('div');
    red_div.setAttribute('class', 'red_code');
    red_div.appendChild(document.createTextNode('red text'));
    view.appendChild(red_div);

    let green_div = document.createElement('div');
    green_div.setAttribute('class', 'green_code');
    green_div.appendChild(document.createTextNode('green text'));
    view.appendChild(green_div);

    let black_div = document.createElement('div');
    black_div.setAttribute('class','black_code');
    black_div.appendChild(document.createTextNode('black text'));
    view.appendChild(black_div);
    x = 0;
    return x;
}

function clearView() {
    let view = document.getElementById('view');
    view.innerHTML = '';
}

export {buildView, clearView};