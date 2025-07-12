import { selectModeInterface } from "./modes.js"


export function GameOver(user,opponent){
    const isGameOver = ()=>{
        (user.board.isLost(),opponent.board.isLost(),'is Lost')
        if(user.board.isLost()){
            displayMessage(`${opponent.userName} won!!!`)
            displayDialog(opponent.userName)
            return true
        }
        else if(opponent.board.isLost()){
            displayMessage(`${user.userName} won!!!`)
            displayDialog(user.userName)
            return true
        }
        else{
            return false
        }
    }

    const displayDialog = (name)=>{
        const dialog = document.createElement('dialog')
        const winnerAnnouncer = document.createElement('span')
        winnerAnnouncer.textContent = `${name} WON!!!`
        winnerAnnouncer.classList.add('winner')
        const button = document.createElement('button')
        button.textContent = 'New Game'
        dialog.appendChild(winnerAnnouncer)
        dialog.appendChild(button)
        button.addEventListener('click',()=>{
            dialog.close()
            document.body.removeChild(dialog)
            startNewGame()
        })
        document.body.appendChild(dialog)
        dialog.showModal() 
    }

    return {isGameOver}
}

export function startNewGame(){
    const mainParent = document.querySelector('.top-div')
    const gameFieldParent = document.querySelector('.game-field-parent')
    mainParent.innerHTML = ""
    gameFieldParent.innerHTML = ""
    document.body.appendChild(selectModeInterface())
}

export function genrateRandomNumber(max){
    return Math.floor(Math.random() * max);
}


 
export  function generateGridBoard(
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



export const placeShipHandler = ( function PlaceShipHandler(){
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

    const  removeSelectorDiv = (length)=>{
        const continer = document.querySelector('.selector-container')
        const selectorDiv = document.querySelector(`.selector-${length}`)
        console.log(selectorDiv)
        continer.removeChild(selectorDiv)
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
        const color = (isPlacable(x,y,length,isHorizontal))?'green':'red'
        for(let i=0;i<length;i++){
            if(cell){
                cell.classList.add(`len-hover`)
                cell.classList.add(`len-hover-${color}`)

            }
            (isHorizontal)?y++:x++
            cell = document.querySelector(`#${getIdfromCordinates(x,y)}`)
            
        }
        
    }

    const onCellLeave = (cell)=>{
        let color = document.querySelectorAll(`.len-hover`);
        console.log(color,'color')
        color.forEach(cell=>{
            cell.classList.remove(`len-hover`)
            cell.classList.remove(`len-hover-green`)
            cell.classList.remove(`len-hover-red`)
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

export function displayMessage(message){
    const messageSpan = document.querySelector('.message-span')
    messageSpan.innerHTML = ''
    messageSpan.textContent = message
}

export function delay(ms){
    return new Promise((resolve,reject)=>{
        setTimeout(resolve,ms)
    })
}



export function attack(cell,player){
    const playerBoard = player.board
    let [x,y] =getCordinatesFromId(cell.id)

    const result = playerBoard.receiveAttack(x,y)
    console.log(cell,player.userName,result)

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

export function addShipsToUserGrid(userGrid,user){
    const userBoard = user.board
    
    userBoard.getState().forEach((row,x)=>{
        row.forEach((ship,y)=>{
            let cell = userGrid.querySelector(`#${getIdfromCordinates(x,y)}`)
            if(['H','X'].includes(ship)) cell.textContent = val

            if(ship) cell.classList.add(`len-${ship.length}`) 
        })
    })
}

export function removeBackgrounds(){
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

export function getIdfromCordinates(x,y){
    const rowId = 'abcdefghij'

    return `${rowId[x]}${y+1}`

}

export function switchTurn(nextPlayer,currentPlayer){
    nextPlayer.giveTurn(true)
    currentPlayer.giveTurn(false)
    displayMessage(`${nextPlayer.userName}'s Turn`)
}

export function getSelectorsContainer(){
    let currentSelectedDiv
    const lenghtArray = [2,2,3,4,5]
    const container = document.createElement('div');
    container.classList.add('selector-container')
    lenghtArray.forEach((length,index)=>{
        let selectorDiv = document.createElement('div');
        selectorDiv.classList.add('selector')
        selectorDiv.addEventListener('click',()=>{
            onSelect(selectorDiv,length)
        })
        selectorDiv.classList.add(`selector-${length}`)
        container.appendChild(selectorDiv)
    })
    
    const onSelect = (div,length)=>{
        console.log(currentSelectedDiv==div)
        if (currentSelectedDiv) currentSelectedDiv.classList.remove('selected')
        
        if (currentSelectedDiv == div){
            placeShipHandler.updateLength(0)
            currentSelectedDiv = null 
            return ;
        }
        console.log(currentSelectedDiv,div)
        div.classList.add('selected')
        currentSelectedDiv = div
        placeShipHandler.updateLength(length)
    }

    return container

}

export function switchCLassNameTo(div=document.createElement('div'),className){
    const classList = Array.from(div.classList)
    classList.forEach(name=>{div.classList.remove(name)})
    div.classList.add(className)
}