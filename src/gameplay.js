

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

        return counter
    }

    const getState =()=>state

    const placeShipInTheBoard = (x,y,length,isHorizontal)=>{
        if(shipArray.length==5) return ;
        const ship = Ship(length)
        let result = placeShip(x,y,length,isHorizontal,ship)
        if(result) shipArray.push(length)
        return  result
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


    const randomizePlacement = ()=>{

        const lengthArray = [2,2,3,4,5]

        lengthArray.forEach(length=>{
            console.log(length,'le')
            let x = genrateRandomNumber(10)
            let y = genrateRandomNumber(10)
            let isHorizontal = genrateRandomNumber(2)
            let result = placeShipInTheBoard(x,y,length,isHorizontal)

            while(!result){
                console.log('result',result)
                x = genrateRandomNumber(10)
                y = genrateRandomNumber(10)
                isHorizontal = genrateRandomNumber(2)
                result = placeShipInTheBoard(x,y,length,isHorizontal)
                
            }
            console.log(result,'final')

        })
    }

    const clear = ()=>{
        for(let i=0;i<10;i++){
            state[i]=(new Array(10).fill(0))
        }

        shipArray.splice(0,shipArray.length)
    }

    const isBoardFilled = ()=>shipArray.length==5


    



    return {placeShipInTheBoard,isLost,placeShip,getState,receiveAttack,randomizePlacement,clear,isBoardFilled}

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



function genrateRandomNumber(max){
    return Math.floor(Math.random() * max);
}