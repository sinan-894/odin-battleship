import { GameField} from "./grid.js";
import { Players } from "./gameplay.js";

export function selectModeInterface(){
    const container = document.createElement('div');
    container.classList.add('mode-selector-div');
    const computer  = document.createElement('button');
    computer.id = 'computer'
    computer.textContent = 'Play Against Computer'
    computer.addEventListener('click',onComputer)
    const twoPlayer = document.createElement('button');
    twoPlayer.id = 'two-player'
    twoPlayer.textContent = 'Pass And Play'
    twoPlayer.addEventListener('click',onTwoPlayer)
     
    container.appendChild(computer)
    container.appendChild(twoPlayer)

    return container
    

}

function onComputer(){
    const user  = Players('Messi')
    const userBoard = user.board
    userBoard.randomizePlacement()
    const computer = Players('Computer')
    const computerBoard = computer.board

    computerBoard.placeShipInTheBoard(0,0,2,false)
    computerBoard.placeShipInTheBoard(0,3,2,true)
    computerBoard.placeShipInTheBoard(2,1,3,true)
    computerBoard.placeShipInTheBoard(7,4,4,true)
    computerBoard.placeShipInTheBoard(4,3,5,false)

    const field = GameField(user,computer)

    document.body.innerHTML = ""
    document.body.appendChild(field.create())
}

function onTwoPlayer(){

}