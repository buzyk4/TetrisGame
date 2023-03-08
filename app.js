document.addEventListener('DOMContentLoaded', () => {

    document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const ScoreDisplay = document.querySelector('#score')
    const StartBtn = document.querySelector('#start-btn')
    const width = 10

    //The Block shapes
    const lBlock = [
        [1,width+1,width*2+1,2],
        [width,width+1,width+2,width*2+2],
        [1,width+1,width*2+1,width*2],
        [width,width*2,width*2+1,width*2+2]
    ]

    const tBlock = [
        [0,width,width+1,width*2+1],
        [width+1,width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1,width+2,width*2,width*2+1]
    ]

    const zBlock = [
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

    const theBlocks = [lBlock, zBlock, oBlock, iBlock]

    let currentPosition = 4
    let currentRotation = 0

    //Randomly select block
    let random = Math.floor(Math.random()*theBlocks.length)
    let current = theBlocks[random][currentRotation]

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

    //Block move down in interval
    timerId = setInterval(moveDown, 1000)

    //Move down function
    function moveDown() {
        undraw()
        currentPosition += width
        draw()
        freeze()
    }

    //Block freeze in class 'taken' div
    function freeze() {
        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            //Start new block
            random = Math.floor(Math.random()*theBlocks.length)
            current = theBlocks[random][currentRotation]
            currentPosition = 4
            draw() 
        }
    }
    //Move to the left, unless it is at the edge
    function moveLeft() {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

        if(!isAtLeftEdge) currentPosition -=1

        if(current.some(index => squares[currentPosition + index].classList.contains('taken')))
    }
})