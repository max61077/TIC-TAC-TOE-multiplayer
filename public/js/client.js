const socket = io();
const {username, gameid} = Qs.parse(location.search, {ignoreQueryPrefix: true})

socket.emit('userConnection', {username, gameid})

let players = [];

socket.on('message', ({name, connection}) => {
    const message = document.createElement('div');
    if(connection)
        if(name === username)
            message.innerHTML = 'You are connected';
        else
            message.innerHTML = `${name} has joined`
    else
        message.innerHTML = `${name} has left`
    msgBox.appendChild(message)
    msgBox.scrollTop = msgBox.scrollHeight
})


createBoard()

let currentPlayer = {mark: 'X', name: null}, game = false, nextGame = false, playersReady = 0;

socket.on('conn', users => {
    players = users

    gameDetails.innerHTML = `
        ${users.map(user => `<li>${user}</li>`).join('')}
    `

    if(players.length == 2){
        display.innerHTML = 'Lets Play!!'
        document.querySelector('.startBtn').style.display = 'block'
    }
    else if(players.length == 1){
        playersReady = 0;

        if(!isBoardEmpty()){
            const message = document.createElement('div');
            message.innerHTML = 'Connection Lost Game will be restarted'
            msgBox.appendChild(message)
            msgBox.scrollTop = msgBox.scrollHeight
            reset()
        }

        if(!playersReady){
            document.querySelector('.startBtn').style.display = 'block'
        }

        display.innerHTML = 'Waiting For Second Player to Join!!'
        game = false
    }
    else {
        display.innerHTML = 'Something is wrong'
    }

    currentPlayer.name = players[0]
})

function turn(ele){
    if(!ele.target.innerHTML && game && currentPlayer.name === username){
        socket.emit('turn', {id: ele.target.id, cp: currentPlayer.name, mark: currentPlayer.mark})
    }
}

socket.on('turn', player => {
    squares[player.id].innerHTML = player.mark

    currentPlayer.name = player.cp === players[0] ? players[1] : players[0];
    currentPlayer.mark = currentPlayer.mark === 'X' ? 'O' : 'X';

    checkWinner(player.cp, currentPlayer.name)
})

socket.on('start', name => {
    playersReady += 1
    checkReady(name)
})

socket.on('replay', anothergame => {
    display.innerHTML = anothergame.msg
    nextGame = !anothergame.nextGame
})

socket.on('response', () => {
    reset();
})

socket.on('err', err => {
    display.innerHTML = err
})


function checkWinner(currPlayer, nextPlayer){
    if(checkGame() == -1){
        display.innerHTML = 'Match Drawn'
        game = false
        nextGame = true
        document.querySelector('.replayBtn').style.display = 'block'
    }
    else if(checkGame()){
        display.innerHTML = currPlayer === username ? 'You Win!!' : currPlayer + ' Wins!'
        game = false
        nextGame = true
        document.querySelector('.replayBtn').style.display = 'block'
    } else{
        display.innerHTML = currentPlayer.name === username ? 'Your Turn' : `${nextPlayer}'s turn`
    }
}

function isBoardEmpty(){
    for(let i = 0; i < squares.length; i++)
        if(squares[i].innerHTML !== '')
            return false

    return true
}

function clearBoard(){
    for(let i = 0; i < squares.length; i++)
        squares[i].innerHTML = ''
}

function reset(){
    clearBoard()
    players.reverse()
    currentPlayer.name = players[0];
    currentPlayer.mark = 'X';
    playersReady = 0;
    display.innerHTML = 'Lets Play!!'
    document.querySelector('.startBtn').style.display = 'block'
    document.querySelector('.replayBtn').style.display = 'none'

    for(let i = 0; i < gameDetails.children.length; i++)
        gameDetails.children[i].style.backgroundColor = 'whitesmoke'
}

function start(){
    if(players.length === 2 && !game){
        socket.emit('start', username)
        document.querySelector('.startBtn').style.display = 'none'
    }
}

function checkReady(name){
    if(playersReady == 2){
        if(currentPlayer.name === username)
            display.innerHTML = 'Your turn'
        else
            display.innerHTML = players[0] + "'s turn"
        showActivePlayer(name)
        game = true;
    } else if(playersReady === 1){
        showActivePlayer(name)

        if(name === username){
            let player2 = name === players[0] ? players[1] : players[0]
            display.innerHTML = `Waiting for ${player2}`
        }
        else
            display.innerHTML = `${name} is ready`
    }
}
function showActivePlayer(playerName){
    let actvPly = gameDetails.children;
    for(let i = 0; i < actvPly.length; i++){
        let ply = actvPly[i].innerHTML.toLowerCase()
        if(ply === playerName)
            actvPly[i].style.backgroundColor = 'lightgreen'
    }
}


function replay(){
    if(nextGame){
        socket.emit('replay', {msg: `${username} wants to play another game`, nextGame})
        display.innerHTML = 'Waiting for response';
        document.querySelector('.replayBtn').style.display = 'none'
    }
    else{
        socket.emit('response')
        document.querySelector('.replayBtn').style.display = 'none'
    }
}




