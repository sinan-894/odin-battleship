import { ComputerField,TwoPlayerField} from "./grid.js";
import { Players } from "./gameplay.js";


const parent = document.createElement('div');
parent.classList.add('top-div')

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

    parent.appendChild(container)

    return parent
    

}

function onComputer(){
    const user  = Players('Messi')
    const computer = Players('Computer')
    const computerBoard = computer.board

    computerBoard.randomizePlacement()

    const field = ComputerField(user,computer)

    parent.innerHTML = ""
    parent.appendChild(field.create())
}

function onTwoPlayer(){
    const playerOne = Players('messi')
    const playerTwo  = Players('ronaldo')


    const field = TwoPlayerField(playerOne,playerTwo)
    parent.innerHTML = ""
    parent.appendChild(field.create())

}

