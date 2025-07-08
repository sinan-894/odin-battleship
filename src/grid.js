

 
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

function GameOver(user,opponent){
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

    return {isGameOver}
}

export function ComputerField(user,opponent){
    let Start = false
    const {isGameOver} = GameOver(user,opponent)

    const createUserGridContainer = ()=>{
        const container = document.createElement('div')
        const userGrid = generateGridBoard(user.userName,(cell)=>{})
        addShipsToUserGrid(userGrid,user)
        container.appendChild(userGrid)
        container.appendChild(getRandomPlaceButtonForUser())
        return container

    }

    const createOpponentGridContainer = ()=>{
        const opponentGridContainer = document.createElement('div')
        const opponentGrid = generateGridBoard(opponent.userName,onOppenentCellClick)
        opponentGridContainer.appendChild(opponentGrid)
        return opponentGridContainer
    }

    const getRandomPlaceButtonForUser = ()=>{
        const randomlyPlaceButton = document.createElement('button')
        randomlyPlaceButton.textContent = 'random'
        randomlyPlaceButton.addEventListener('click',onRandomPlacement)
        randomlyPlaceButton.classList.add('random-place');
        return randomlyPlaceButton
    }

    const onRandomPlacement = ()=>{
        if(!Start){
            user.board.clear()
            user.board.randomizePlacement()
            removeBackgrounds()
            const grid = document.querySelector(`#${user.userName}`)
            addShipsToUserGrid(grid,user)
        }
        
    }

    const onStart = ()=>{
        if(!Start){
            Start = true
            if(genrateRandomNumber(2)){
                switchTurn(user,opponent)
            }
            else{
                switchTurn(opponent,user)
                delay(750).then(()=>{
                    computerAttack(user)
                    console.log('after 5 sec')
                })
                delay(1500).then(()=>switchTurn(user,opponent))
                
            }
        }
        else{
            restartGame()
            displayMessage('')
            Start = false
        }
        
    }

    const restartGame = ()=>{
        const userGrid  = document.querySelector(`#${user.userName}`)
        const opponentGrid  = document.querySelector(`#${opponent.userName}`)
        clearGrid(userGrid)
        clearGrid(opponentGrid)
        user.board.clear()
        // opponent.board.clear()
        removeBackgrounds()
        user.board.randomizePlacement()
        addShipsToUserGrid(userGrid,user)
        user.giveTurn(false)
        opponent.giveTurn(false)

    }

    const onOppenentCellClick = async (cell)=>{
        if(user.isPlayersTurn() && !isGameOver() && attack(cell,opponent)){
            //need to freeze the board until promise is resolved
            user.giveTurn(false)
            if(isGameOver()) return
            await delay(500)//wait attack result
            if(Start) switchTurn(opponent,user)
            await delay(500)//wait for opp switch turn result
            if(Start) computerAttack(user)
            await delay(500)//wait for computer attack
            if(Start) switchTurn(user,opponent)
            if(isGameOver()) return
            
            
        }
    }

    const container = GameField(
        createUserGridContainer(),createOpponentGridContainer(),onStart
    )

    
    return container
}

export function TwoPlayerField(user,opponent){
    let Start = false
    const {isGameOver} = GameOver(user,opponent)

    const createPlayerGridContainer = (onCellClick)=>{

        return ()=>{
            const container = document.createElement('div')
            const userGrid = generateGridBoard(user.userName,onCellClick)
            container.appendChild(userGrid)
            return container
        }

    }
    const onStart = ()=>{
        if(!Start){
            Start = true
            if(genrateRandomNumber(2)){
                switchTurn(user,opponent)
            }
            else{
                switchTurn(opponent,user)
            }
        }
        else{
            displayMessage('')
            Start = false
        }
        
    }


    const onOppenentCellClick =  (cell)=>{
        
        if(user.isPlayersTurn() && !isGameOver() && attack(cell,opponent)){
            if (!isGameOver()){
                user.giveTurn(false)
                delay(1000).then(()=>switchTurn(opponent,user))
            }
        }
    }

    const onUserCellClick =  (cell)=>{
        if(opponent.isPlayersTurn() && !isGameOver() && attack(cell,user)){
            if (!isGameOver()){
                opponent.giveTurn(false)
                delay(1000).then(()=>switchTurn(user,opponent))
            }
        }
    }

    const placeShipSequence = (parent)=>{
        const opponentPlace = PlaceShipGrid(opponent,()=>{
            parent.innerHTML = ''
            parent.appendChild(container.create())
        })

        const userPlace = PlaceShipGrid(user,()=>{
            parent.innerHTML = ''
            parent.appendChild(opponentPlace.createInterface())
            const dialog = opponentPlace.createCoverForPlayer()
            parent.appendChild(dialog)
            dialog.showModal()
        })
        const dialog = userPlace.createCoverForPlayer()
        parent.appendChild(userPlace.createInterface())
        parent.appendChild(dialog)
        dialog.showModal()

    }


    const createUserGridContainer = createPlayerGridContainer(onUserCellClick)
    const createOpponentGridContainer = createPlayerGridContainer(onOppenentCellClick)

    const container = GameField(
        createUserGridContainer(),createOpponentGridContainer(),onStart
    )

    return Object.assign({placeShipSequence},container)
}



function PlaceShipGrid(user,onSave){

    const createInterface=()=>{
        const container = document.createElement('div');
        container.classList.add('place-ship-container')

        const gridContainer  = document.createElement('div');
        gridContainer.classList.add('place-ship-grid-container')
        gridContainer.appendChild(generateGridBoard(user.userName,(cell)=>{}))
        gridContainer.appendChild(getRandomPlaceButtonForUser())

        const saveButton = document.createElement('button')
        saveButton.textContent = 'save'
        saveButton.addEventListener('click',onSave)
        saveButton.classList.add('save-button')

        container.appendChild(gridContainer)
        container.appendChild(saveButton)

        return container


    }

    const getRandomPlaceButtonForUser = ()=>{
        const randomlyPlaceButton = document.createElement('button')
        randomlyPlaceButton.textContent = 'random'
        randomlyPlaceButton.addEventListener('click',onRandomPlacement)
        randomlyPlaceButton.classList.add('random-place');
        return randomlyPlaceButton
    }

    const onRandomPlacement = ()=>{
       
        user.board.clear()
        user.board.randomizePlacement()
        removeBackgrounds()
        const grid = document.querySelector(`#${user.userName}`)
        addShipsToUserGrid(grid,user)

        
    }

    const createCoverForPlayer = (container)=>{
        const dialog = document.createElement('dialog')
        dialog.classList.add('cover-dialog')
        dialog.id = `cover-for-${user.userName}`

        const paragraph =document.createElement('p')
        paragraph.textContent = user.userName+
        ' is placing ships hide it from your opponent '
        const button = document.createElement('button')
        button.textContent = 'continue'
        button.addEventListener('click',onContinue)

        dialog.appendChild(paragraph)
        dialog.appendChild(button)

        return dialog

    }

    const onContinue = ()=>{
        const dialog = document.querySelector(`#cover-for-${user.userName}`)
        dialog.close()
    }

    return {createInterface,createCoverForPlayer}



}


function GameField(userGridContainer,opponentGridContainer,onStart){
    
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
        
        const container = document.createElement('div');
        container.classList.add('game-field')
        container.appendChild(userGridContainer);
        container.appendChild(opponentGridContainer);
    
        return container
    }

    const getStartButton = ()=>{
        const button = document.createElement('button')
        button.classList.add('start-button');
        button.textContent = 'start'
        button.addEventListener('click',onStart)
        return button
    }

    return {create}
    

}

function clearGrid(grid){
    for(let i=0;i<10;i++){
        for(let j=0;j<10;j++){
            let cell = grid.querySelector(`#${getIdfromCordinates(i,j)}`)
            cell.textContent = ""
        }
    }
}

function displayMessage(message){
    const messageSpan = document.querySelector('.message-span')
    messageSpan.innerHTML = ''
    messageSpan.textContent = message
}

function delay(ms){
    return new Promise((resolve,reject)=>{
        setTimeout(resolve,ms)
    })
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
    let [x,y] =getCordinatesFromId(cell.id)

    const result = playerBoard.receiveAttack(x,y)

    if(result){
        cell.textContent = result
    }
    else{
        console.log('already guessed')
        return 
    }

    if(result=='H') displayMessage('Its A HIT!!')
    else displayMessage('Miss!!')

    return result



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

function removeBackgrounds(){
    const lengthArray = [2,3,4,5]

    lengthArray.forEach(length=>{
        let cells = Array.from(
            document.querySelectorAll(`.len-${length}`)
        )
        cells.forEach(cell=>{
            cell.classList.remove(`len-${length}`)
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
