import { Players } from "./gameplay.js";



const user =Players()

user.placeShipInTheBoard(0,0,2,false)
user.placeShipInTheBoard(0,3,2,true)
user.placeShipInTheBoard(2,1,3,true)
user.placeShipInTheBoard(7,4,4,true)
user.placeShipInTheBoard(4,3,5,false)

document.body.appendChild(generateGridBoard(user.getState()))