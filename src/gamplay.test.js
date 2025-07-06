import { GameBoard } from "./gameplay"


describe('Gameboard',()=>{
    let board

    beforeEach(()=>{
        board = GameBoard()
    })

    describe('Place Ship',()=>{

        let boardArray
        
        beforeEach(()=>{
            boardArray = []
            for(let i=0;i<10;i++){
                boardArray.push(new Array(10).fill(0))
            }
        })

        test('Place Ship at  12 horizontal',()=>{
        
            
            boardArray[1][2] = 1
            boardArray[1][3] = 1
            boardArray[1][4] = 1
            boardArray[1][5] = 1
            boardArray[1][6] = 1
    
            board.placeShip(1,2,5,true,1)
            expect(board.getState(board.getState())).toEqual(boardArray)
        })
    
        test('Place Ship at  12 vertical',()=>{
            
            boardArray[1][2] = 1
            boardArray[2][2] = 1
            boardArray[3][2] = 1
            boardArray[4][2] = 1
            boardArray[5][2] = 1
    
            board.placeShip(1,2,5,false,1)
            expect(board.getState()).toEqual(boardArray)
        })
    
        test('Place Ship out of bounds',()=>{
            board.placeShip(1,8,5,true)
            expect(board.getState()).toEqual(boardArray)
        })
    
        test('Place Ship out of bounds',()=>{
            board.placeShip(10,8,5,false,1)
            expect(board.getState()).toEqual(boardArray)
        })

        test('Place Ship In occupied area horizontal',()=>{
            boardArray[1][2] = 1
            boardArray[2][2] = 1
            boardArray[3][2] = 1
            boardArray[4][2] = 1
            boardArray[5][2] = 1

            board.placeShip(1,2,5,false,1)
            board.placeShip(2,1,4,true,1)
            expect(board.getState()).toEqual(boardArray)

        })

        test('Place Ship In occupied area vertical',()=>{
            boardArray[1][2] = 1
            boardArray[1][3] = 1
            boardArray[1][4] = 1
            boardArray[1][5] = 1
            boardArray[1][6] = 1

            board.placeShip(1,2,5,true,1)
            board.placeShip(0,2,4,false,1)
            console.log(board.getState())
            expect(board.getState()).toEqual(boardArray)

        })
    })



})