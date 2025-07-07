import { GameField} from "./grid.js";
import { computer,user } from "./player-setting.js";

const opp = computer

const field = GameField(user,opp)

document.body.appendChild(field.create())


