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
    const [playerOne,playerTwo] = testPlayers('Messi','Ronaldo')

    const field = GameField(playerOne,playerTwo)
}

function testPlayers(player1,player2){
    const playerOne = Players(player1)
    const playerOneBoard = playerOne.board
    playerOneBoard.placeShipInTheBoard(0,0,2,false)
    playerOneBoard.placeShipInTheBoard(0,3,2,true)
    playerOneBoard.placeShipInTheBoard(2,1,3,true)
    playerOneBoard.placeShipInTheBoard(7,4,4,true)
    playerOneBoard.placeShipInTheBoard(4,3,5,false)

    const playerTwo  = Players(player2)
    const playerTwoBoard = playerTwo.board
    playerTwoBoard.placeShipInTheBoard(0,0,2,false)
    playerTwoBoard.placeShipInTheBoard(0,3,2,true)
    playerTwoBoard.placeShipInTheBoard(2,1,3,true)
    playerTwoBoard.placeShipInTheBoard(7,4,4,true)
    playerTwoBoard.placeShipInTheBoard(4,3,5,false)

    return [playerOne,playerTwo]


}