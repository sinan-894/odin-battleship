



function getCordinatesFromId(id){
    let x = id[0].charCodeAt(0)-97
    let y = Number(id.substr(1))-1

    return [x,y]
}

function getIdfromCordinates(x,y){
    const rowId = 'abcdefghij'

    return `${rowId[x]}${y+1}`

}
