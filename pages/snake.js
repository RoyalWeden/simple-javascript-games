import Head from 'next/head'
import { useState, useEffect, useRef } from 'react'
import useInterval from '@use-it/interval'
import {
    SimpleGrid,
    Box,
    Button,
    Container,
    Link
} from '@chakra-ui/react'
import Layout from '../components/layouts/article'

export default function SnakeGame() {
    // Canvas Settings
    const canvasRef = useRef(null)
    const canvasWidth = 500
    const canvasHeight = 500
    const canvasGridSize = 25

    // Game Settings
    const gameSpeed = 7

    // Game State
    const [gameDelay, setGameDelay] = useState(1000/gameSpeed)
    const [running, setRunning] = useState(false)
    const [isLost, setIsLost] = useState(false)
    const [highscore, setHighscore] = useState(0)
    const [newHighscore, setNewHighscore] = useState(false)
    const [direction, setDirection] = useState({dx: 1, dy: 0})
    const [snake, setSnake] = useState({
        x: 5,
        y: 15,
        body: []
    })
    const [apple, setApple] = useState({x: 10, y: 10})
    const [score, setScore] = useState(0)

    const clearCanvas = (ctx) => {
        ctx.clearRect(-1, -1, canvasWidth+2, canvasHeight+2)
        ctx.fillStyle = "#000000"
        ctx.fillRect(0, 0, canvasWidth, canvasHeight)
    }

    const generateApplePosition = () => {
        const x = Math.floor(Math.random() * (canvasWidth/canvasGridSize))
        const y = Math.floor(Math.random() * (canvasHeight/canvasGridSize))
        // Check if random position interferes with snake head or trail
        if ((snake.x == x && snake.y == y) || snake.body.some((snakePart) => snakePart.x == x && snakePart.y == y)) {
            return generateApplePosition()
        }
        return {x, y}
    }

    // Initialize state
    const startGame = () => {
        setGameDelay(1000/gameSpeed)
        setIsLost(false)
        setScore(0)
        setSnake({
            x: 5,
            y: 15,
            body: []
        })
        setDirection({dx: 1, dy: 0})
        setApple(generateApplePosition())
        setRunning(true)
        setNewHighscore(false)
    }

    // Reset state and check for highscore
    const gameOver = () => {
        if (score > highscore) {
            setHighscore(score)
            localStorage.setItem('highscore', score.toString())
            setNewHighscore(true)
        }
        setIsLost(true)
        setRunning(false)
        setDirection({dx: 0, dy: 0})
    }

    const fillRect = (ctx, x, y, w, h) => {
        ctx.fillRect(x, y, w, h)
    }

    const strokeRect = (ctx, x, y, w, h) => {
        ctx.strokeRect(x+.5, y+.5, w, h)
    }

    const drawSnake = (ctx) => {
        ctx.fillStyle = '#00FA5B'
        ctx.strokeStyle = '#000000'

        fillRect(
            ctx,
            snake.x * canvasGridSize,
            snake.y * canvasGridSize,
            canvasGridSize,
            canvasGridSize
        )

        strokeRect(
            ctx,
            snake.x * canvasGridSize,
            snake.y * canvasGridSize,
            canvasGridSize,
            canvasGridSize
        )

        ctx.fillStyle = '#00F05B'

        snake.body.forEach((snakePart) => {
            fillRect(
                ctx,
                snakePart.x * canvasGridSize,
                snakePart.y * canvasGridSize,
                canvasGridSize,
                canvasGridSize
            )

            strokeRect(
                ctx,
                snakePart.x * canvasGridSize,
                snakePart.y * canvasGridSize,
                canvasGridSize,
                canvasGridSize
            )
        })
    }

    const drawApple = (ctx) => {
        ctx.fillStyle = '#ED0C0E'
        ctx.strokeStyle = '#000000'

        if(apple && typeof apple.x !== 'undefined' && apple.y !== 'undefined') {
            fillRect(
                ctx,
                apple.x * canvasGridSize,
                apple.y * canvasGridSize,
                canvasGridSize,
                canvasGridSize
            )

            strokeRect(
                ctx,
                apple.x * canvasGridSize,
                apple.y * canvasGridSize,
                canvasGridSize,
                canvasGridSize
            )
        }
    }

    // Update snake head and body and apple positions. Check for collisions.
    const updateSnake = () => {
        const nextSnake = {
            x: snake.x + direction.dx,
            y: snake.y + direction.dy,
            body: [{x: snake.x, y: snake.y}, ...snake.body.slice(0, snake.body.length-1)]
        }
        // Check for collision with walls
        if(
            nextSnake.x < 0 ||
            nextSnake.y < 0 ||
            nextSnake.x >= canvasWidth / canvasGridSize ||
            nextSnake.y >= canvasHeight / canvasGridSize
        ) {
            gameOver()
        }

        // Check for snake colliding with itself
        if(nextSnake.body.some((snakePart) => snakePart.x == nextSnake.x && snakePart.y == nextSnake.y)) {
            gameOver()
        }

        // Check for collision with apple
        if(nextSnake.x == apple.x && nextSnake.y == apple.y) {
            setScore((prevScore) => prevScore + 1)
            setApple(generateApplePosition())
            // Update state
            setSnake({
                x: nextSnake.x,
                y: nextSnake.y,
                body: [{x: snake.x, y: snake.y}, ...snake.body]
            })
        } else {
            // Update state
            setSnake({
                x: nextSnake.x,
                y: nextSnake.y,
                body: [...nextSnake.body]
            })
        }
        setDirection({...direction})
    }

    // Game Hook
    useEffect(() => {
        const canvas = canvasRef?.current
        const ctx = canvas?.getContext('2d')

        if (ctx && !isLost) {
            clearCanvas(ctx)
            drawApple(ctx)
            drawSnake(ctx)
        }
    }, [apple, snake])

    // Game Update Interval
    useInterval(
        () => {
            if(!isLost) {
                updateSnake()
            }
        },
        running ? gameDelay : null
    )

    // Did Mount Hook for highscore
    useEffect(() => {
        setHighscore(
            localStorage.getItem('highscore') ? parseInt(localStorage.getItem('highscore')) : 0
        )
    }, [])

    // Event Listener: Key Preses
    useEffect(() => {
        const handleKeyDown = (e) => {
            if([
                'ArrowUp',
                'ArrowDown',
                'ArrowLeft',
                'ArrowRight',
                'w',
                'a',
                's',
                'd',
            ].includes(e.key)) {
                let newDirection = {dx: 0, dy: 0}

                switch(e.key) {
                    case 'ArrowRight' || 'd':
                        newDirection = {dx: 1, dy: 0}
                        break
                    case 'ArrowLeft' || 'a':
                        newDirection = {dx: -1, dy: 0}
                        break
                    case 'ArrowDown' || 's':
                        newDirection = {dx: 0, dy: 1}
                        break
                    case 'ArrowUp' || 'w':
                        newDirection = {dx: 0, dy: -1}
                        break
                    default:
                        console.error('Error with handleKeyDown')
                }
                if(!(
                    direction.dx + newDirection.dx === 0 &&
                    direction.dy + newDirection.dy === 0
                    )
                ) {
                    setDirection(newDirection)
                }
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [snake])

    return (
        <>
            <Layout>
                <Head>
                    <title>Snake Game</title>
                </Head>
                <Container maxW='container.lg' centerContent>
                    <SimpleGrid columns={[1, 2, 2]} spacing={200}>
                        <Box maxW='xl' p={5}>
                            <canvas
                                ref={canvasRef}
                                width={canvasWidth+1}
                                height={canvasHeight+1}
                            />
                        </Box>
                        <Box maxW='sm' p={5} verticalAlign='top'>
                            <section>
                                <div className="score">
                                    <p>
                                        Score: {score}
                                    </p>
                                </div>
                                {!isLost ? (
                                    <Button
                                        colorScheme='teal'
                                        height={15}
                                        width={100}
                                        variant='outline'
                                        onClick={startGame}
                                    >
                                        Start Game
                                    </Button>
                                ) : (
                                    <div className="controls">
                                        {/* <p>How to Play?</p>
                                        <p>
                                            up,
                                            right,
                                            down,
                                            left
                                        </p> */}
                                    </div>
                                )}
                            </section>
                            {isLost && (
                                <div className="game-overlay">
                                    <p className="large">Game Over</p>
                                    <p className="final-score">
                                        {newHighscore ? `🎉 New Highscore 🎉 : ${score}` : `You scored: ${score}`}
                                    </p>
                                    {!running && isLost && (
                                        <Button
                                            colorScheme='teal'
                                            height={10}
                                            width={100}
                                            variant='outline'
                                            onClick={startGame}
                                        >
                                            Restart Game
                                        </Button>
                                    )}
                                </div>
                            )}
                            <Link href='/'>
                                <Button
                                    height={10}
                                    width={100}
                                    variant='outline'
                                >
                                    Home
                                </Button>
                            </Link>
                        </Box>
                    </SimpleGrid>
                </Container>
            </Layout>
        </>
    )
}