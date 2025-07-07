import { genarateGameField } from "./grid.js";
import { computer,user } from "./player-setting.js";

const opp =  computer

document.body.appendChild(genarateGameField(user,opp))


