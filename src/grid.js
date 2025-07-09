const parent = document.body

 
function genrateRandomNumber(max){
    return Math.floor(Math.random() * max);
}


 
export function generateGridBoard(
    user,onCellPress,onCellHover=()=>{},onCellLeave=()=>{}){
    const gridContainer = document.createElement('div');
    gridContainer.classList.add('grid-container')
    gridContainer.id = user
    const rowID = 'abcdefghij'
    for(let i=0;i<10;i++){
        for(let j=0;j<10;j++){
            let cell = document.createElement('div');
            cell.classList.add('cell-div');
            cell.addEventListener('click',()=>onCellPress(cell))
            cell.addEventListener('mouseover',()=>onCellHover(cell))      
            cell.addEventListener('mouseleave',()=>onCellLeave(cell))
            cell.id = `${rowID[i]}${j+1}`
            gridContainer.appendChild(cell)
        }
    }

    return gridContainer
}



const placeShipHandler = (function PlaceShipHandler(){
    let length = 0
    let isHorizontal = true

    const occupiedCell = []
    let counter = 5
    const selected = []
    const updateLength=(newLength)=>{
        length = newLength
    }
    const getLength = ()=>length

    const onCellClick = (cell)=>{
        let [x,y] = getCordinatesFromId(cell.id)
        if(isPlacable(x,y,length,isHorizontal) && length){
            saveShip(x,y)
            cell.classList.add(`len-${length}`)
            occupiedCell.push(cell.id)
            for(let i=1;i<length;i++){
                (isHorizontal)?y++:x++;
                let cell = document.querySelector(`#${getIdfromCordinates(x,y)}`)
                cell.classList.add(`len-${length}`)
                occupiedCell.push(cell.id)
                
            }
            onCellLeave(cell)
            removeSelectorDiv(length)
            length = 0 
        }

    }

    const saveShip = (x,y)=>{
        if(!counter) return
        console.log([x,y,length,isHorizontal],'check this')
        selected.push([x,y,length,isHorizontal])
        counter--
    }

    const getCompletePositions = ()=>{
        if(!counter){
            return selected
        }
        return ;
    }

    const reset = ()=>{
        isHorizontal = true
        counter = 5
        occupiedCell.splice(0,occupiedCell.length)
        selected.splice(0,selected.length)
    }

    const isPlacable  = (x,y,length,isHorizontal)=>{
        if(
            x>10 || x<0 || y>9 || y<0 ||
            (isHorizontal && length+y>10) ||
            (!isHorizontal && length+x>10) 
        ) return false
        
        for(let i=0 ;i<length;i++){
            if(occupiedCell.includes(getIdfromCordinates(x,y))) return false;  
            (isHorizontal)?y++:x++;

        }

        return true

    }

    const onCellHover = (cell)=>{
        let[x,y] = getCordinatesFromId(cell.id)
        if(isPlacable(x,y,length,isHorizontal)){
            cell.classList.add(`len-${length}-hover`)
            for(let i=0;i<length-1;i++){
                (isHorizontal)?y++:x++
                let adCell = document.querySelector(`#${getIdfromCordinates(x,y)}`)
                if(adCell) adCell.classList.add(`len-${length}-hover`)
            }
        }
    }

    const onCellLeave = (cell)=>{
        let color = document.querySelectorAll(`.len-${length}-hover`);
        color.forEach(cell=>{
            cell.classList.remove(`len-${length}-hover`)
        })
    }

    const changeDirection = ()=>{
        isHorizontal = !isHorizontal
    }


    return {
        onCellClick,updateLength,getLength,onCellHover,
        onCellLeave,changeDirection,getCompletePositions,reset
    }
})()


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

    const placeShip = ()=>{
        const container = document.createElement('div')
        container.classList.add('place-ship-container');

        container.appendChild(generateGridBoard(
            user.userName,placeShipHandler.onCellClick,
            placeShipHandler.onCellHover,placeShipHandler.onCellLeave
        ))

        container.appendChild(getRandomPlaceButtonForUser())
        container.appendChild(getchangeDirectionButton())
        container.appendChild(getResetButton())
        container.appendChild(getSaveButton())
        Selectors()
        
        

        return container
    }
    const getResetButton = ()=>{
        const button = document.createElement('button');
        button.classList.add('reset-button');
        button.textContent = 'reset'
        button.addEventListener('click',onReset)
        return button
    }

    const onReset = ()=>{
        placeShipHandler.reset()
        removeBackgrounds()
        removeSelectorContainer()
        Selectors()
    }

    const getchangeDirectionButton = ()=>{
        const button = document.createElement('button');
        button.textContent = 'Change Direction'
        button.classList.add('change-direction-button');
        button.addEventListener('click',placeShipHandler.changeDirection)
        return button
    }
    const getSaveButton = ()=>{
        const button = document.createElement('button');
        button.textContent = 'save'
        button.classList.add('save-button');
        button.addEventListener('click',onSave)
        return button
    }

    const onSave  = ()=>{
        
        let result = placeShipHandler.getCompletePositions()
        if(!result) return
        result.forEach(pos=>{
            let [x,y,length,isHorizontal] = pos
            let isPlaced =user.board.placeShipInTheBoard(x,y,length,isHorizontal)
            console.log(length,isPlaced,'placed')
        })
        placeShipHandler.reset()
        console.log(user.board.getState())
        parent.innerHTML = ""
        const container = GameField(
            createUserGridContainer(),createOpponentGridContainer(),onStart
        )
        parent.appendChild(container.create())
    }

    

    
    return Object.assign({placeShip})
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
            placeShipSequence(document.body)
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

    const placeShipSequence = ()=>{
        const opponentPlace = PlaceShipGrid(opponent,()=>{
            let result = placeShipHandler.getCompletePositions()
            if(!result || opponent.board.isBoardFilled()) return
            console.log(result,'opponent')
            placeShip(result,opponent)
            placeShipHandler.reset()
            console.log(user.board.getState())
            console.log(opponent.board.getState())
            const container = GameField(
                createUserGridContainer(),
                createOpponentGridContainer(),
                onStart
            )
            parent.innerHTML = ''
            parent.appendChild(container.create())
        })

        const userPlace = PlaceShipGrid(user,()=>{
            let result = placeShipHandler.getCompletePositions()
            if(!result || user.board.isBoardFilled()) return
            placeShip(result,user)
            console.log(result,'user')
            placeShipHandler.reset()
            parent.innerHTML = ''
            
            parent.appendChild(opponentPlace.createInterface())
            Selectors()
            const dialog = opponentPlace.createCoverForPlayer()
            parent.appendChild(dialog)
            dialog.showModal()
        })
        parent.innerHTML = ''
        const dialog = userPlace.createCoverForPlayer()
        parent.appendChild(userPlace.createInterface())
        Selectors()
        parent.appendChild(dialog)
        dialog.showModal()

    }

    const placeShip = (positionArray=[],player)=>{
        console.log(positionArray,'position')
        positionArray.forEach(position=>{
            let [x,y,length,isHorizontal] = position
            player.board.placeShipInTheBoard(x,y,length,isHorizontal)
        })
        console.log(player.board.getState())
    }


    const createUserGridContainer = createPlayerGridContainer(onUserCellClick)
    const createOpponentGridContainer = createPlayerGridContainer(onOppenentCellClick)

    

    return Object.assign({placeShipSequence})
}



function PlaceShipGrid(user,onSave){

    const createInterface=()=>{
        const container = document.createElement('div');
        container.classList.add('place-ship-container')

        const gridContainer  = document.createElement('div');
        gridContainer.classList.add('place-ship-grid-container')
        gridContainer.appendChild(generateGridBoard(
            user.userName,
            placeShipHandler.onCellClick,
            placeShipHandler.onCellHover,
            placeShipHandler.onCellLeave
        ))
        gridContainer.appendChild(getRandomPlaceButtonForUser())
        gridContainer.appendChild(getChangeDirectionButton())
        gridContainer.appendChild(getResetButton())

        const saveSpan = document.createElement('span')
        saveSpan.classList.add('save-button-container')
        saveSpan.appendChild(getSaveButton()) 

        container.appendChild(gridContainer)
        container.appendChild(saveSpan)

        return container


    }

    const getChangeDirectionButton = ()=>{
        const button = document.createElement('button');
        button.classList.add('change-direction-button');
        button.textContent = 'change direction'
        button.addEventListener('click',placeShipHandler.changeDirection)
        return button
    }

    const getResetButton = ()=>{
        const button = document.createElement('button');
        button.classList.add('reset-button');
        button.textContent = 'reset'
        button.addEventListener('click',onReset)
        return button
    }

    const onReset = ()=>{
        placeShipHandler.reset()
        removeBackgrounds()
        removeSelectorContainer()
        Selectors()
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
        const saveSpan = document.querySelector('.save-button-container')
        if(saveSpan.innerHTML == ''){
            const saveButton = getSaveButton()
            saveSpan.appendChild(saveButton)
        }
        

        
    }

    const getSaveButton = ()=>{
        const saveButton = document.createElement('button')
        saveButton.textContent = 'save'
        saveButton.addEventListener('click',onSave)
        saveButton.classList.add('save-button')
        return saveButton
    }

    const createCoverForPlayer = ()=>{
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

function Selectors(){
    let currentSelectedDiv
    const lenghtArray = [2,2,4,3,5]
    const container = document.createElement('div');
    container.classList.add('selector-container')
    lenghtArray.forEach((length,index)=>{
        let selectorDiv = document.createElement('div');
        selectorDiv.classList.add('selector')
        selectorDiv.addEventListener('click',()=>{
            onSelect(selectorDiv,length)
        })
        if(index==1)selectorDiv.classList.add(`selector-${length}-${1}`)
        selectorDiv.classList.add(`selector-${length}`)
        container.appendChild(selectorDiv)
    })
    
    const onSelect = (div,length)=>{
        if (currentSelectedDiv) currentSelectedDiv.classList.remove('selected')
        div.classList.add('selected')
        currentSelectedDiv = div
        placeShipHandler.updateLength(length)
    }

    parent.appendChild(container)

}

function removeSelectorDiv(length){
    const continer = document.querySelector('.selector-container')
    const selectorDiv = document.querySelector(`.selector-${length}`)
    console.log(selectorDiv)
    continer.removeChild(selectorDiv)
}

function removeSelectorContainer(){
    const continer = document.querySelector('.selector-container')
    parent.removeChild(continer)
}
