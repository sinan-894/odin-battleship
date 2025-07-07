import { genarateGameField,computerAttack } from "./grid.js";
import { computer,user } from "./player-setting.js";

const opp = computer

const startButton = document.createElement('button');
startButton.textContent ='start'

document.body.appendChild(startButton)

document.body.appendChild(genarateGameField(user,opp))


