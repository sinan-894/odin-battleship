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
    computer.addEventListener('click',()=>inputUserNameDialog(1))
    const twoPlayer = document.createElement('button');
    twoPlayer.id = 'two-player'
    twoPlayer.textContent = 'Pass And Play'
    twoPlayer.addEventListener('click',()=>inputUserNameDialog(2))
     
    container.appendChild(computer)
    container.appendChild(twoPlayer)

    parent.appendChild(heading())
    parent.appendChild(container)

    return parent
    

}

function heading(){
    const heading = document.createElement('h1');
    heading.classList.add('heading')
    heading.textContent = "BATTLESHIP"
    return heading 
}

function onComputer(playerOne){
    const user  = Players(playerOne)
    const computer = Players('Computer')
    const computerBoard = computer.board

    computerBoard.randomizePlacement()
    console.log('computer',computerBoard.getState())

    const field = ComputerField(user,computer)

    parent.innerHTML = ""
    parent.appendChild(field.create())
}

function onTwoPlayer(playerOneName,playerTwoName){
    const playerOne = Players(playerOneName)
    const playerTwo  = Players(playerTwoName)


    const field = TwoPlayerField(playerOne,playerTwo)
    parent.innerHTML = ""
    parent.appendChild(field.create())

}

function inputUserNameDialog(numberOfInputs){
    let inputArray = []
    const dialog = document.createElement('dialog')
    dialog.classList.add('username-input-div')
    for(let i=1 ;i<=numberOfInputs;i++){
        let input = document.createElement('input')
        input.type = 'text'
        input.placeholder = `player-${i}`
        inputArray.push(input)
        dialog.appendChild(input)
    }
    const button = document.createElement('button')
    button.textContent = 'Start'
    button.addEventListener('click',()=>{
        
        inputArray = inputArray.map((input,index)=>{
            if(input.value=='') input.value=`player-${index+1}`
            return input.value
        })
        document.body.removeChild(dialog)
        dialog.close()
        if(numberOfInputs==1) onComputer(inputArray[0])
        else onTwoPlayer(inputArray[0],inputArray[1])

    })
    dialog.appendChild(button)
    document.body.appendChild(dialog)
    dialog.showModal()

}


