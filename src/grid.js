

 
function genrateRandomNumber(max){
    return Math.floor(Math.random() * max);
}


 
export function generateGridBoard(user,onCellPress){
    const gridContainer = document.createElement('div');
    gridContainer.classList.add('grid-container')
    gridContainer.id = user
    const rowID = 'abcdefghij'
    for(let i=0;i<10;i++){
        for(let j=0;j<10;j++){
            let cell = document.createElement('div');
            cell.classList.add('cell-div');
            cell.addEventListener('click',()=>onCellPress(cell))
            cell.id = `${rowID[i]}${j+1}`
            gridContainer.appendChild(cell)
        }
    }

    return gridContainer
}



export function GameField(user,opponent){

    const create = ()=>{
        const container = document.createElement('div')
        container.classList.add('main-container');

        const header = document.createElement('div');
        header.classList.add('header')

        const messageSpan = document.createElement('span');
        messageSpan.classList.add('message-span');

        header.appendChild(getStartButton())
        header.appendChild(messageSpan)

        container.appendChild(header)
        container.appendChild(createField())

        return container
    }


    const createField = ()=>{
        const userGrid = generateGridBoard(user.userName,(cell)=>{})
        addShipsToUserGrid(userGrid,user)
    
        const opponentGrid = generateGridBoard(opponent.userName,onOppenentCellClick)
    
        const container = document.createElement('div');
        container.classList.add('game-field')
        container.appendChild(userGrid);
        container.appendChild(opponentGrid);
    
        return container
    }

    const getStartButton = ()=>{
        const button = document.createElement('button')
        button.classList.add('start-button');
        button.textContent = 'start'
        button.addEventListener('click',onStart)
        return button
    }

    const onStart = ()=>{
        if(genrateRandomNumber(2)){
            switchTurn(user,opponent)
        }
        else{
            switchTurn(opponent,user)
            computerAttack(user)
            switchTurn(user,opponent)
        }
    }

    const onOppenentCellClick = (cell)=>{
        if(user.isPlayersTurn()){
            attack(cell,opponent)
            if(isGameOver()) return
            switchTurn(opponent,user)
            computerAttack(user)
            if(isGameOver()) return
            switchTurn(user,opponent)
            
        }
    }

    const isGameOver = ()=>{

        if(user.board.isLost()){
            displayMessage(`Game Over,${opponent.userName} won the match`)
            return true
        }
        else if(opponent.board.isLost()){
            displayMessage(`Game Over,${user.userName} won the match`)
            return true
        }
        else{
            return false
        }
    }

    return {create}
    

}

function displayMessage(message){
    const messageSpan = document.querySelector('.message-span')
    messageSpan.innerHTML = ''
    messageSpan.textContent = message
}

function computerAttack(user){
    let x = genrateRandomNumber(10)
    let y = genrateRandomNumber(10)
    const userBoard = user.board
    if(userBoard.isLost()){ 
        console.log('game over')
        return ;
    }
    let result = userBoard.receiveAttack(x,y)
    while(!result){
        x = genrateRandomNumber(10)
        y = genrateRandomNumber(10)
        result = userBoard.receiveAttack(x,y)
    }
    const cell = document.querySelector(`#${user.userName} #${getIdfromCordinates(x,y)}`)
    cell.textContent = result

    if(result=='H') displayMessage('Its A HIT!!')
    else displayMessage('Miss!!')

    return result
}

function attack(cell,player){
    const playerBoard = player.board
    if(playerBoard.isLost()){ 
        console.log('game over')
        return ;
    }
    let [x,y] =getCordinatesFromId(cell.id)

    const result = playerBoard.receiveAttack(x,y)

    if(result){
        cell.textContent = result
    }
    else{
        console.log('already guessed')
    }

    if(result=='H') displayMessage('Its A HIT!!')
    else displayMessage('Miss!!')



}

function addShipsToUserGrid(userGrid,user){
    const userBoard = user.board
    
    userBoard.getState().forEach((row,x)=>{
        row.forEach((ship,y)=>{
            let cell = userGrid.querySelector(`#${getIdfromCordinates(x,y)}`)
            if(['H','X'].includes(ship)) cell.textContent = val

            if(ship) setBackground(cell,ship.length) 
        })
    })
} 

function getCordinatesFromId(id){
    let x = id[0].charCodeAt(0)-97
    let y = Number(id.substr(1))-1

    return [x,y]
}

function getIdfromCordinates(x,y){
    const rowId = 'abcdefghij'

    return `${rowId[x]}${y+1}`

}

function setBackground(div,length){
    div.classList.add(`len-${length}`)
}

function switchTurn(nextPlayer,currentPlayer){
    nextPlayer.giveTurn(true)
    currentPlayer.giveTurn(false)
    displayMessage(`${nextPlayer.userName}'s Turn`)
}
