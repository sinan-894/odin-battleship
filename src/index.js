import { Players } from "./gameplay.js";


function generateGridBoard(state){
    const gridContainer = document.createElement('div');
    gridContainer.classList.add('grid-container')
    const rowID = 'abcdefghij'
    for(let i=0;i<10;i++){
        for(let j=0;j<10;j++){
            let cell = document.createElement('div');
            cell.classList.add('cell-div');
            cell.id = `${rowID[i]}${j+1}`
            if(['H','X'].includes(state[i][j])) cell.textContent = state[i][j]
            else if(state[i][j]) setBackground(cell,state[i][j].length)
            else cell.textContent=''
            gridContainer.appendChild(cell)
        }
    }

    return gridContainer
}

function setBackground(div,length){
    

    div.classList.add(`len-${length}`)
}

const user =Players()

user.placeShipInTheBoard(0,0,2,false)
user.placeShipInTheBoard(0,3,2,true)
user.placeShipInTheBoard(2,1,3,true)
user.placeShipInTheBoard(7,4,4,true)
user.placeShipInTheBoard(4,3,5,false)

document.body.appendChild(generateGridBoard(user.getState()))

