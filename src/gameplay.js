

export function Ship(length){
    
    let numberOfHits = 0

    const hit = ()=>{
        numberOfHits++
    }

    const isSunk = ()=>{
        return (0 >= length-numberOfHits)?true:false 
    }

    return {length,hit,isSunk}

}

export function GameBoard(){

    const state = []
    const shipArray = []

    for(let i=0;i<10;i++){
        state.push(new Array(10).fill(0))
    }

    const placeShip = (x,y,length,isHorizontal,ship)=>{
        if(
            x>9 || x<0 || y>9 || y<0 ||
            (isHorizontal && y+length>9)||
            (!isHorizontal && x+length>9)
        ) return null
        
        let counter = 0
        if(isHorizontal){
            while(!state[x][y] && counter<length){
                state[x][y] = ship
                y++
                counter++
            }
            while(counter>0 && counter<length){
                y--
                state[x][y] = 0
                counter--
            }
        }
        else{
            
            while(!state[x][y] && counter<length){
                state[x][y] = ship
                x++
                counter++
            }
            while(counter>0 && counter<length){
                x--
                state[x][y] = 0
                counter--
            }

        }
    }

    const getState =()=>state

    const placeShipInTheBoard = (x,y,length,isHorizontal)=>{
        if(shipArray.length==5) return true
        const ship = Ship(length)
        placeShip(x,y,length,isHorizontal,ship)
        shipArray.push(length)
    }

    const receiveAttack = (x,y)=>{
        //returns null if no attack recieved return 'H' if hit and 'X' if miss
        if(['X','H'].includes(state[x][y])) return null;

        if(state[x][y]){
            hit(x,y)
            return 'H'
        }
        else{
            miss(x,y)
            return 'X'
        }
    }

    const hit = (x,y)=>{
        const ship = state[x][y]
        ship.hit()
        if(ship.isSunk()){
            shipArray.splice(shipArray.indexOf(ship.length),1)
        }
        state[x][y] = 'H'
    }

    const miss = (x,y)=>{
        state[x][y] = 'X'
    }

    const isLost = ()=>(shipArray.length == 0)


    



    return {placeShipInTheBoard,isLost,placeShip,getState,receiveAttack}

}


export function Players(userName){
    const board = GameBoard()
    let playersTurn = false
    const giveTurn =(turn=true)=>{
        playersTurn = turn
    }
    const isPlayersTurn =()=>playersTurn

    return {userName,board,giveTurn,isPlayersTurn}
}

export function Game(player1,player2){
    let turn = (Math.floor(Math.random() * 2))?player1:player2
    const startGame = ()=>{

    }
}