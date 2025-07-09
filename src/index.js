// import { selectModeInterface } from "./modes.js";

// document.body.appendChild(selectModeInterface())




const eventHandler = EventHandler()
document.body.appendChild(generateGridBoard('test',eventHandler.onCellClick))




function generateGridBoard(user,onCellPress){
    const gridContainer = document.createElement('div');
    gridContainer.classList.add('grid-container')
    gridContainer.id = user
    const rowID = 'abcdefghij'
    for(let i=0;i<10;i++){
        for(let j=0;j<10;j++){
            let cell = document.createElement('div');
            cell.classList.add('cell-div');
            cell.addEventListener('click',()=>onCellPress(cell))
            // cell.addEventListener('mouseover',(event)=>onCellHover(event,cell))
            cell.id = `${rowID[i]}${j+1}`
            gridContainer.appendChild(cell)
        }
    }

    return gridContainer
}


// function onCellHover(e,cell){
//     cell.classList.add('len-2')
//     let[x,y] = getCordinatesFromId(cell.id)
//     for(let i=0;i<2-1;i++){
//         y++
//         let adCell = document.querySelector(`#${getIdfromCordinates(x,y)}`)
//         if(adCell) adCell.classList.add('len-2')
//     }
//     cell.addEventListener('mouseleave',(event)=>onCellLeave(event,cell))
// }

// function onCellLeave(e,cell){let [x,y] = getCordinatesFromId(cell.id)
//     let color = document.querySelectorAll('.len-2');
//     color.forEach(cell=>{
//         cell.classList.remove('len-2')
//     })
// }

function getCordinatesFromId(id){
    let x = id[0].charCodeAt(0)-97
    let y = Number(id.substr(1))-1

    return [x,y]
}

function getIdfromCordinates(x,y){
    const rowId = 'abcdefghij'

    return `${rowId[x]}${y+1}`

}





function EventHandler(){
    let length = 0
    let isHorizontal = true

    const occupiedCell = []
    const selected = {}
    const updateLength=(newLength)=>{
        length = newLength
    }
    const getLength = ()=>length

    const onCellClick = (cell)=>{
        let [x,y] = getCordinatesFromId(cell.id)
        console.log(x,y,'clicked')
        if(isPlacable(x,y,length,isHorizontal) && length){
            console.log(x,y,'clicked2')
            selected[cell.id] = [x,y,length,isHorizontal]
            cell.classList.add(`len-${length}`)
            occupiedCell.push(cell.id)
            for(let i=1;i<length;i++){
                (isHorizontal)?y++:x++;
                let cell = document.querySelector(`#${getIdfromCordinates(x,y)}`)
                cell.classList.add(`len-${length}`)
                occupiedCell.push(cell.id)
                
            }
            length = 0
        }

    }

    const isPlacable  = (x,y,length,isHorizontal)=>{
        if(
            x>10 || x<0 || y>9 || y<0 ||
            (isHorizontal && length+y>9) ||
            (!isHorizontal && length+x>9) 
        ) return false
        
        for(let i=0 ;i<length;i++){
            if(occupiedCell.includes(getIdfromCordinates(x,y))) return false
            console.log(x,y,'dfdf');    
            (isHorizontal)?y++:x++;

        }

        return true

    }

    return {onCellClick,updateLength,getLength}
}


const selectorArray = Array.from(document.querySelectorAll('.selector'))
let currentSelected = false
selectorArray.forEach(selector=>{
    selector.addEventListener('click',()=>{
        if(currentSelected){
            currentSelected.classList.remove('selected')
        }
        selector.classList.add('selected')
        currentSelected = selector
        const classList = Array.from(selector.classList)
        let len = classList[0].split('-')[1]
        eventHandler.updateLength(Number(len))
        console.log(eventHandler.getLength())
    })
})