import { Players } from "./gameplay.js";



export const user = Players('messi')
const userBoard = user.board

userBoard.placeShipInTheBoard(0,0,2,false)
userBoard.placeShipInTheBoard(0,3,2,true)
userBoard.placeShipInTheBoard(2,1,3,true)
userBoard.placeShipInTheBoard(7,4,4,true)
userBoard.placeShipInTheBoard(4,3,5,false)

export const computer = Players('computer')
const computerBoard = computer.board

computerBoard.placeShipInTheBoard(0,0,2,false)
computerBoard.placeShipInTheBoard(0,3,2,true)
computerBoard.placeShipInTheBoard(2,1,3,true)
computerBoard.placeShipInTheBoard(7,4,4,true)
computerBoard.placeShipInTheBoard(4,3,5,false)

