

export function Ship(length){
    
    let numberOfHits = 0

    const hit = ()=>{
        numberOfHits++
    }

    const isSunk = ()=>{
        return (0 >= length-numberOfHits)?true:false 
    }

<<<<<<< HEAD
    return {length,hit,isSunk}

=======
>>>>>>> 3bee085 (Create Src directory with source code)
}

export function GameBoard(){

    const state = []

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

<<<<<<< HEAD


=======
>>>>>>> 3bee085 (Create Src directory with source code)
    return {placeShip,getState}


    
    


}
