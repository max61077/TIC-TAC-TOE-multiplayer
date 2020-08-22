const gameDetails = document.querySelector('.gameDetails .activePlayers .players');
const msgBox = document.querySelector('.gameDetails .messageBox .msg');
const board = document.querySelector('.board');
let squares = []
const display = document.querySelector('.display');
const sideBar = document.querySelector('.gameDetails');
const sideBtn = document.querySelector('.sideBarBtn');

function createBoard(){
    for(let i = 0; i < 9; i++){
        let sqr = document.createElement('div')
        sqr.classList = 'sqr'
        sqr.id = i
        sqr.addEventListener('click', turn)
        board.appendChild(sqr)
    }

    squares = board.children;

}

function equalsThree(x1, x2, x3){
    return x1 !== '' && x1 === x2 && x2 === x3;
}

function checkGame(){
    let b = [], c = 0;
    for(let i = 0; i < squares.length; i++){
        b[i] = squares[i].innerHTML
        if(!b[i])
            c += 1
    }

    //check rows

    if(equalsThree(b[0], b[1], b[2]) || equalsThree(b[3], b[4], b[5]) || equalsThree(b[6], b[7], b[8]))
        return true

    //check cols

    if(equalsThree(b[0], b[3], b[6]) || equalsThree(b[1], b[4], b[7]) || equalsThree(b[2], b[5], b[8]))
        return true

    //check diagonals

    if(equalsThree(b[0], b[4], b[8]) || equalsThree(b[6], b[4], b[2]))
        return true

    if(c == 0)
        return -1

    return false

}

function openSide(){
    sideBar.style.display = 'block'
    sideBar.style.width = '250px'
}

function closeSide(){
    sideBar.style.display = 'none'
}