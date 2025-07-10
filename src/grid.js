
import {
    addShipsToUserGrid,attack,
    delay,displayMessage,
    placeShipHandler,
    removeBackgrounds,switchTurn,getSelectorsContainer,
    genrateRandomNumber,generateGridBoard,getIdfromCordinates,GameOver
} from "./functions.js"
// import pauseButtonImage from './pause-svgrepo-com.svg'
import { selectModeInterface } from "./modes.js"


const mainParent = document.querySelector('.top-div')
const parent = document.createElement('div')
parent.classList.add('main-place-ship')
const selectorParent = document.createElement('div')
selectorParent.classList.add('selector-parent')
const buttonParent = document.createElement('div')
buttonParent.classList.add('button-parent')
const gameFieldParent = document.createElement('div')
document.body.appendChild(gameFieldParent)



export function ComputerField(user,opponent){
    let Start = false
    const {isGameOver} = GameOver(user,opponent)

    const createUserGridContainer = ()=>{
        const container = document.createElement('div')
        const userGrid = generateGridBoard(user.userName,(cell)=>{})
        addShipsToUserGrid(userGrid,user)
        container.appendChild(userGrid)
        return container

    }

    const createOpponentGridContainer = ()=>{
        const opponentGridContainer = document.createElement('div')
        const opponentGrid = generateGridBoard(opponent.userName,onOppenentCellClick)
        opponentGridContainer.appendChild(opponentGrid)
        return opponentGridContainer
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

    const create = ()=>{
        const container  =  PlaceShipGrid(user,afterSave).createInterface()
        return container
    }

    const  computerAttack = ()=>{
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

    const afterSave = ()=>{
        const field = GameField(
            createUserGridContainer(),createOpponentGridContainer(),restartGame
        )
        field.display()
        toss()
        
    }

    const toss = ()=>{
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

    const restartGame = ()=>{
        gameFieldParent.innerHTML = ""
        user.board.clear()
        create()
    }

    

    
    return {create}
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

    const create = ()=>{
        const opponentPlace = PlaceShipGrid(opponent,()=>{
            const container = GameField(
                createUserGridContainer(),
                createOpponentGridContainer(),
                restart
            )
            container.display()
            toss()
        })

        const userPlace = PlaceShipGrid(user,()=>{
            opponentPlace.createInterface()
            const dialog = opponentPlace.createCoverForPlayer()
            document.body.appendChild(dialog)
            dialog.showModal()
        })
        
        const dialog = userPlace.createCoverForPlayer()
        const container = userPlace.createInterface()
        document.body.appendChild(dialog)
        dialog.showModal()

        return container

    }
    const toss = ()=>{
        Start = true
        if(genrateRandomNumber(2)){
            switchTurn(user,opponent)
        }
        else{
            switchTurn(opponent,user)
        }
    }

    const restart = ()=>{
        gameFieldParent.innerHTML = ""
        user.board.clear()
        create()
    }



    const createUserGridContainer = createPlayerGridContainer(onUserCellClick)
    const createOpponentGridContainer = createPlayerGridContainer(onOppenentCellClick)

    

    return {create}
}

function PlaceShipGrid(user,afterSave = ()=>{}){

    let isPlacedRandomly = false

    const createInterface=()=>{
        const container = document.createElement('div')
        container.classList.add('place-ship-container');
        container.appendChild(getChangeDirectionButton())
        container.appendChild(generateGridBoard(
            user.userName,placeShipHandler.onCellClick,
            placeShipHandler.onCellHover,placeShipHandler.onCellLeave
        ))

        
        
        setButtonContainer()
        setSelectorContainer()
        parent.appendChild(container)
        parent.appendChild(selectorParent)
        parent.appendChild(buttonParent)
        
        return parent


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
    
    
    const getSaveButton = ()=>{
        const button = document.createElement('button');
        button.textContent = 'save'
        button.classList.add('save-button');
        button.addEventListener('click',onSave)
        return button
    }
    

    const getRandomPlaceButtonForUser = ()=>{
        const randomlyPlaceButton = document.createElement('button')
        randomlyPlaceButton.textContent = 'random'
        randomlyPlaceButton.addEventListener('click',onRandomPlacement)
        randomlyPlaceButton.classList.add('random-place');
        return randomlyPlaceButton
    }

    const setSelectorContainer = ()=>{
        selectorParent.innerHTML = ""
        selectorParent.appendChild(getSelectorsContainer())
        selectorParent.appendChild(getRandomPlaceButtonForUser())
    }

    const setButtonContainer = ()=>{
        buttonParent.innerHTML = ''
        buttonParent.appendChild(getResetButton())
        buttonParent.appendChild(getSaveButton())
    }

    const onSave =()=>{
        if(!isPlacedRandomly){
            let result = placeShipHandler.getCompletePositions()
            if(!result) return
            result.forEach(pos=>{
                let [x,y,length,isHorizontal] = pos
                let isPlaced =user.board.placeShipInTheBoard(x,y,length,isHorizontal)
                console.log(length,isPlaced,'placed')
            })
            placeShipHandler.reset()
            
            
        }
        console.log(user.board.getState())
        parent.innerHTML = ""
        afterSave()
    } 

    const onRandomPlacement = ()=>{
       
        user.board.clear()
        user.board.randomizePlacement()
        removeBackgrounds()
        const grid = document.querySelector(`#${user.userName}`)
        addShipsToUserGrid(grid,user)
        isPlacedRandomly = true   
    }

    const onReset = ()=>{
        placeShipHandler.reset()
        removeBackgrounds()
        setSelectorContainer()
        
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
        document.body.removeChild(dialog)
    }

    return {createInterface,createCoverForPlayer}



}

function GameField(userGridContainer,opponentGridContainer,restart){

    const dialog = document.createElement('dialog')
    
    
    const create = ()=>{
        const container = document.createElement('div')
        container.classList.add('main-container');

        const header = document.createElement('div');
        header.classList.add('header')

        const messageSpan = document.createElement('span');
        messageSpan.classList.add('message-span');
        header.appendChild(messageSpan)

        container.appendChild(header)
        container.appendChild(createField())
        document.body.appendChild(dialog)
        addButtonsToDialog()

        return container
    }

    const createField = ()=>{
        
        const container = document.createElement('div');
        container.classList.add('game-field')
        container.appendChild(userGridContainer);
        container.appendChild(getPauseButton())
        container.appendChild(opponentGridContainer);
    
        return container
    }
    const getPauseButton = ()=>{
        const pauseButton = document.createElement('button');
        pauseButton.classList.add('pause-button')
        const img = document.createElement('img');
        img.src = './pause-svgrepo-com.svg'
        pauseButton.appendChild(img)
        pauseButton.addEventListener('click',()=>dialog.showModal())

        return pauseButton

    }
    const display = ()=>{
        gameFieldParent.appendChild(create())
    }

    const addButtonsToDialog = ()=>{
        dialog.appendChild(getButton('newgame',onNewGame))
        dialog.appendChild(getButton('restart',onRestart))
        dialog.appendChild(getButton('close',onClose))
    }

    const getButton = (name,onPress)=>{
        const button = document.createElement('button')
        button.textContent = name
        button.classList.add(`${name}-button`)
        button.addEventListener('click',onPress)
        return button
    }

    const onClose = ()=>{
        dialog.close()
        // document.body.removeChild(dialog
    }
    const onNewGame = ()=>{
        dialog.close()
        document.body.removeChild(dialog)
        const mainParent = document.querySelector('.top-div')
        mainParent.innerHTML = ""
        gameFieldParent.innerHTML = ""
        document.body.appendChild(selectModeInterface())

    }
    const onRestart = ()=>{
        dialog.close()
        document.body.removeChild(dialog)
        restart()
    }

    return {create,display}
    

}







