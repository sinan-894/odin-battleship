
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
        console.log(cell.id)
    })

    const container = document.createElement('div');
    container.classList.add('game-field')
    container.appendChild(userGrid);
    container.appendChild(opponentGrid)

    return container

}