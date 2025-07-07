import { genarateGameField } from "./grid.js";
import { computer,user } from "./player-setting.js";

const opp = computer

const startButton = document.createElement('button');
startButton.textContent ='start'
startButton.addEventListener('click',()=>{
    if(Math.floor(Math.random() * 2)){
        user.giveTurn()
        computer.giveTurn(false)
    }
    else{
        user.giveTurn(false)
        computer.giveTurn()
    }
    (user.isPlayersTurn())?console.log('user turn'):console.log('computer turn')

    
})
document.body.appendChild(startButton)

document.body.appendChild(genarateGameField(user,opp))


