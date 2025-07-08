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

}

function onTwoPlayer(){

}