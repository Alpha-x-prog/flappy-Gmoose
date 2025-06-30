document.addEventListener('DOMContentLoaded' , () => {
    const bird = document.querySelector('.bird')
    const gameDisplay = document.querySelector('.game-container')
    const ground = document.querySelector('.ground-moving')
    const scoreElement = document.getElementById('score')
    const gameOverContainer = document.getElementById('game-over')
    const finalScoreElement = document.getElementById('final-score')
    const restartBtn = document.getElementById('restart-btn')

    let birdLeft = 220
    let birdBottom = 100
    let birdVelocity = 0
    let gravity = 0.25
    let isGameOver = false
    let gap = 470
    let jumpStrength = 6
    let score = 0


    function startGame() {
        birdVelocity -= gravity
        birdBottom += birdVelocity
        if (birdBottom <= 0 && !isGameOver) {
            birdBottom = 0
            bird.style.bottom = birdBottom + 'px'
            gameOver()
            return
        }
        bird.style.bottom = birdBottom + 'px'
        bird.style.left = birdLeft + 'px'
    }
    function resetGame() {
        birdBottom = 100
        birdVelocity = 0
        isGameOver = false
        score = 0
        scoreElement.textContent = score
        bird.style.bottom = birdBottom + 'px'
        bird.style.left = birdLeft + 'px'
        document.querySelectorAll('.obstacle, .topObstacle').forEach(el => el.remove())
        ground.classList.add('ground-moving')
        ground.classList.remove('ground')
    }
    let gameTimerId = setInterval(startGame, 20)

    function control(e) {
        if (e.keyCode === 32) {
            jump()
        }
    }

    function jump() {
        if (birdBottom < 500) birdVelocity = jumpStrength
    }
    document.addEventListener('keyup', control)


    function generateObstacle() {
        let obstacleLeft = 500
        let randomHeight = Math.random() * 60
        let obstacleBottom = randomHeight
        const obstacle = document.createElement('div')
        const topObstacle = document.createElement('div')
        if (!isGameOver) {
            obstacle.classList.add('obstacle')
            topObstacle.classList.add('topObstacle')
        }
        gameDisplay.appendChild(obstacle)
        gameDisplay.appendChild(topObstacle)
        obstacle.style.left = obstacleLeft + 'px'
        topObstacle.style.left = obstacleLeft + 'px'
        obstacle.style.bottom = obstacleBottom + 'px'
        topObstacle.style.bottom = obstacleBottom + gap + 'px'

        let passed = false
        function moveObstacle() {
            obstacleLeft -=2
            obstacle.style.left = obstacleLeft + 'px'
            topObstacle.style.left = obstacleLeft + 'px'

            if (obstacleLeft === -60) {
                clearInterval(timerId)
                gameDisplay.removeChild(obstacle)
                gameDisplay.removeChild(topObstacle)
            }
            if (!passed && obstacleLeft + 60 < birdLeft) {
                score++
                scoreElement.textContent = score
                passed = true
            }
            if (
                obstacleLeft > 200 && obstacleLeft < 280 && birdLeft === 220 &&
                (birdBottom < obstacleBottom + 153 || birdBottom > obstacleBottom + gap -200)||
                birdBottom === 0 
                ) {
                gameOver()
                clearInterval(timerId)
            }
        }
        let timerId = setInterval(moveObstacle, 20) 
        if (!isGameOver) setTimeout(generateObstacle, 3000)
    }
    generateObstacle()

    function showGameOver() {
        finalScoreElement.textContent = score
        gameOverContainer.style.display = 'block'
    }
    function hideGameOver() {
        gameOverContainer.style.display = 'none'
    }
    restartBtn.addEventListener('click', () => {
        hideGameOver()
        resetGame()
        score = 0
        scoreElement.textContent = score
        generateObstacle()
        gameTimerId = setInterval(startGame, 20)
        document.addEventListener('keyup', control)
    })

    function gameOver() {
        clearInterval(gameTimerId)
        console.log('game over')
        isGameOver = true
        document.removeEventListener('keyup', control)
        ground.classList.add('ground')
        ground.classList.remove('ground-moving')
        showGameOver()
    }

})
