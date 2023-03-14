document.addEventListener('DOMContentLoaded', () => {

    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-btn')
    const width = 10
    let nextRandom = 0
    let timerId
    let score = 0

    //The Block shapes
    const lBlock = [
        [1,width+1,width*2+1,2],
        [width,width+1,width+2,width*2+2],
        [1,width+1,width*2+1,width*2],
        [width,width*2,width*2+1,width*2+2]
    ]

    const zBlock = [
        [0,width,width+1,width*2+1],
        [width+1,width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1,width+2,width*2,width*2+1]
    ]

    const tBlock = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
    ]

    const oBlock = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
    ]

    const iBlock = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
    ]

    const theBlocks = [lBlock, tBlock, zBlock, oBlock, iBlock]

    let currentPosition = 4
    let currentRotation = 0

    //Randomly select block
    let random = Math.floor(Math.random()*theBlocks.length)
    let current = theBlocks[random][currentRotation]

    //Blocks colors
    

    //Draw the block
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('block')
        })
    }

    //Undraw the block
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('block')
        })
    }


    //assign functions to keyCodes
    function control(e) {
        if(e.keyCode === 65) {
            //move left on 'a' button
            moveLeft()
        } else if (e.keyCode === 87) {
            //rotate on 'w' button
            rotate()

        } else if (e.keyCode === 68) {
            //move right on 'd' button
            moveRight()

        } else if (e.keyCode === 83) {
            //move down on 's' button
            moveDown()
        } else if (e.keyCode === 13) {
            //move max down on 'enter' button
            moveMaxDown()
        }

    }
    document.addEventListener('keyup', control)

    //Move down function
    function moveDown() {
        undraw()
        currentPosition += width
        draw()
        freeze()
    }

    //Maximum down move
    function moveMaxDown() {

        while (current.some(index => squares[currentPosition + index + width].classList.contains('empty'))) {
            undraw()
            currentPosition += width
            draw()
            if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
                break
            }
        }
        freeze()
    }
    

    //Block freeze in class 'taken' div
    function freeze() {
        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            current.forEach(index => squares[currentPosition + index].classList.remove('empty'))
            //Start new block
            random = nextRandom
            nextRandom = Math.floor(Math.random()*theBlocks.length)
            current = theBlocks[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            addScore()
            gameOver()
        }
    }

    //Move to the left, unless it is at the edge
    function moveLeft() {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

        if(!isAtLeftEdge) currentPosition -=1

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition +=1
        }

        draw()
    }

    //Move to the right, unless it is at the edge
    function moveRight() {
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)

        if(!isAtRightEdge) currentPosition +=1

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -=1
        }

        draw()
    }

    //rotate the block
    function rotate() {
        undraw()
        currentRotation ++
        if(currentRotation === current.length) {
            //if the current rotation gets to 4 make it go back to 0
            currentRotation = 0
        }
        current = theBlocks[random][currentRotation]
        draw()
    }

    //Show up next Block in mini-grid
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    let displayIndex = 5

    //the Blocks without rotations
    const upNextBlocks = [
        [1,displayWidth+1,displayWidth*2+1,2], //lBlock
        [0,displayWidth,displayWidth+1,displayWidth*2+1], //tBlock
        [0,displayWidth,displayWidth+1,displayWidth*2+1], //zBlock
        [0,1,displayWidth,displayWidth+1], //oBlock
        [1,displayWidth+1,displayWidth*2+1,displayWidth*3+1] //iBlock
    ]

    //Display a shape in the mini-grid display
    function displayShape() {
       displaySquares.forEach(square => {
        square.classList.remove('block')
       })
       upNextBlocks[nextRandom].forEach( index => {
        displaySquares[displayIndex + index].classList.add('block')
       })
    }

    // Start-Stop button functionality
    startBtn.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId)
            timerId = null
        } else {
            draw()
            const interval = 1000
            timerId = setInterval(moveDown, interval)
            nextRandom = Math.floor(Math.random()*theBlocks.length)
            displayShape()
        }
    })

    //Score
    function addScore() {
        for (let i = 0; i < 200; i +=width) {
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

            if(row.every(index => squares[index].classList.contains('taken'))) {
                score +=10
                if(score%100 === 0) {
                    interval += 200
                }
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('block')
                })
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }

    //Game over
    function gameOver() {
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = "GAME OVER"
            clearInterval(timerId)
        }
    }
})