import { GameBoard,Ship } from "./gameplay"


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

        test('Place Ship at  12 horizontal 2',()=>{
        
            
            boardArray[1][2] = 1
            boardArray[1][3] = 1
            boardArray[1][4] = 1
            boardArray[1][5] = 1
            boardArray[1][6] = 1
    
            
            expect(board.placeShip(1,2,5,true,1)).toBeTruthy()
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

        test('Place Ship at  12 vertical 2',()=>{
            
            boardArray[1][2] = 1
            boardArray[2][2] = 1
            boardArray[3][2] = 1
            boardArray[4][2] = 1
            boardArray[5][2] = 1
    
            
            expect(board.placeShip(1,2,5,false,1)).toBeTruthy()
        })
    
        test('Place Ship out of bounds',()=>{
            board.placeShip(1,8,5,true)
            expect(board.getState()).toEqual(boardArray)
        })

        test('Place Ship out of bounds 2',()=>{
            
            expect(board.placeShip(1,8,5,true)).toBeFalsy()
        })
    
        test('Place Ship out of bounds',()=>{
            board.placeShip(10,8,5,false,1)
            expect(board.getState()).toEqual(boardArray)
        })

        test('Place Ship out of bounds 2',()=>{
            expect(board.placeShip(10,8,5,false,1)).toBeFalsy()
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

        test('Place Ship In occupied area horizontal 2',()=>{
            boardArray[1][2] = 1
            boardArray[2][2] = 1
            boardArray[3][2] = 1
            boardArray[4][2] = 1
            boardArray[5][2] = 1

            board.placeShip(1,2,5,false,1)
            
            expect(board.placeShip(2,1,4,true,1)).toBeFalsy()

        })

        test('Place Ship In occupied area vertical',()=>{
            boardArray[1][2] = 1
            boardArray[1][3] = 1
            boardArray[1][4] = 1
            boardArray[1][5] = 1
            boardArray[1][6] = 1

            board.placeShip(1,2,5,true,1)
            board.placeShip(0,2,4,false,1)
            expect(board.getState()).toEqual(boardArray)

        })

        test('Place Ship In occupied area vertical 2',()=>{
            boardArray[1][2] = 1
            boardArray[1][3] = 1
            boardArray[1][4] = 1
            boardArray[1][5] = 1
            boardArray[1][6] = 1

            board.placeShip(1,2,5,true,1)
            
            expect(board.placeShip(0,2,4,false,1)).toBeFalsy()

        })
    })

    describe('Recieve Attack',()=>{

        let boardArray,ship
        
        beforeEach(()=>{
            boardArray = []
            for(let i=0;i<10;i++){
                boardArray.push(new Array(10).fill(0))
            }
            ship = Ship(5)
        })

        test('Hit',()=>{
            boardArray[1][2] = ship
            boardArray[1][3] = 'H'
            boardArray[1][4] = ship
            boardArray[1][5] = ship
            boardArray[1][6] = ship

            board.placeShip(1,2,5,true,ship)
            expect(board.receiveAttack(1,3)).toBe('H')
            expect(board.getState()).toEqual(boardArray)

        })

        test('Miss',()=>{
            
            boardArray[1][0] = 'X'
            boardArray[1][2] = ship
            boardArray[1][3] = ship
            boardArray[1][4] = ship
            boardArray[1][5] = ship
            boardArray[1][6] = ship

            board.placeShip(1,2,5,true,ship)
            expect(board.receiveAttack(1,0)).toBe('X')
            expect(board.getState()).toEqual(boardArray)

        })

        test('Not Recieved',()=>{
            boardArray[1][2] = ship
            boardArray[1][3] = 'H'
            boardArray[1][4] = ship
            boardArray[1][5] = ship
            boardArray[1][6] = ship

            board.placeShip(1,2,5,true,ship)
            expect(board.receiveAttack(1,3)).toBe('H')
            expect(board.receiveAttack(1,3)).toBeNull()
            expect(board.getState()).toEqual(boardArray)

        })

    })

    test('Is Lost :true',()=>{
        board.placeShipInTheBoard(1,2,5,true)
        board.receiveAttack(1,2)
        board.receiveAttack(1,3)
        board.receiveAttack(1,4)
        board.receiveAttack(1,5)
        board.receiveAttack(1,6)

        expect(board.isLost()).toBe(true)


        
    })

    test('Is Lost :False',()=>{
        board.placeShipInTheBoard(1,2,5,true)
        board.receiveAttack(1,2)
        board.receiveAttack(1,3)
        board.receiveAttack(1,4)
        board.receiveAttack(1,5)

        expect(board.isLost()).toBeFalsy()


        
    })

    describe('Clear Board',()=>{

        let boardArray
        
        beforeEach(()=>{
            boardArray = []
            for(let i=0;i<10;i++){
                boardArray.push(new Array(10).fill(0))
            }
        })

        test('Board',()=>{
            board.randomizePlacement()
            board.clear()

            expect(board.getState()).toEqual(boardArray)
        })

        test('shipArray',()=>{
            board.randomizePlacement()
            board.clear()

            expect(board.isLost()).toBeTruthy()
        })


    })

    describe("Is Board Filled",()=>{
        test('Filled',()=>{
            board.placeShipInTheBoard(0,0,2,false)
            board.placeShipInTheBoard(0,3,2,true)
            board.placeShipInTheBoard(2,1,3,true)
            board.placeShipInTheBoard(7,4,4,true)
            board.placeShipInTheBoard(4,3,5,false)

            expect(board.isBoardFilled()).toBeTruthy()

        })

        test('Not Filled',()=>{
            board.placeShipInTheBoard(0,0,2,false)
            board.placeShipInTheBoard(0,3,2,true)
            board.placeShipInTheBoard(2,1,3,true)
            board.placeShipInTheBoard(7,4,4,true)

            expect(board.isBoardFilled()).toBeFalsy()

        })
    })


})