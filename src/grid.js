
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



export function genarateGameField(user,opponent){
    const userGrid = generateGridBoard(user.userName,(cell)=>{
        console.log(cell.id)
    })
    addShipsToUserGrid(userGrid,user)

    const opponentGrid = generateGridBoard(opponent.userName,(cell)=>{
        attack(cell,opponent)
    })

    const container = document.createElement('div');
    container.classList.add('game-field')
    container.appendChild(userGrid);
    container.appendChild(opponentGrid)

    return container

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
    let [x,y]= id.split("")
    x = x.charCodeAt(0)-97
    y = Number(y)-1

    return [x,y]
}

function getIdfromCordinates(x,y){
    const rowId = 'abcdefghij'

    return `${rowId[x]}${y+1}`

}

function setBackground(div,length){
    div.classList.add(`len-${length}`)
}