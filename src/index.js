function test(){
    let a  = 6
    const addToA = (x)=>{a=a+x}
    return {a,addToA}
}


let g = test()

console.log(g.a)

g.addToA(10)

console.log(g.a)