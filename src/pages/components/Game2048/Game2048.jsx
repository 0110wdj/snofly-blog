import { useEffect, useState } from 'react'
import Cell from '../Game2048/Cell'
import './Game.css'

const addRandomNum = board => {
  const emptyCells = []
  board.forEach((row, x) =>
    row.forEach((cell, y) => {
      if (cell === 0) emptyCells.push({ x, y })
    }),
  )
  if (emptyCells.length === 0) return
  const { x, y } = emptyCells[Math.floor(Math.random() * emptyCells.length)]
  board[x][y] = Math.random() < 0.5 ? 2 : 4
}

const Game = () => {
  const len = 4 // grid size
  const size = 100 // cell size
  const margin = 20 // margin between cells
  const [score, setScore] = useState(0)
  const [board, setBoard] = useState(() => {
    const initArr = Array(len)
      .fill(null)
      .map(() => Array(len).fill(0))
    addRandomNum(initArr)
    addRandomNum(initArr)
    return initArr
  })
  const [gameOver, setGameOver] = useState(false)

  useEffect(() => {
    const handleKeyDown = e => {
      e.preventDefault()
      if (gameOver) return
      switch (e.key) {
        case 'ArrowLeft':
          moveLeft()
          break
        case 'ArrowRight':
          moveRight()
          break
        case 'ArrowUp':
          moveUp()
          break
        case 'ArrowDown':
          moveDown()
          break
        default:
          break
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameOver])

  const initBoard = () => {
    const newBoard = Array(len)
      .fill(null)
      .map(() => Array(len).fill(0))
    addRandomNum(newBoard)
    addRandomNum(newBoard)
    setBoard(newBoard)
    setGameOver(false)
  }

  const moveLeft = () => {
    const beforeBoard = JSON.stringify(board)
    for (let x = 0; x < len; x++) {
      let merged = false
      for (let y = 1; y < len; y++) {
        if (board[x][y] !== 0) {
          let j = y - 1
          while (j >= 0 && board[x][j] === 0) j--
          if (j >= 0 && board[x][j] === board[x][y]) {
            board[x][j] *= 2
            board[x][y] = 0
            merged = true
            setScore(prevScore => prevScore + board[x][j])
          } else if (!merged) {
            board[x][j + 1] = board[x][y]
            if (j + 1 !== y) board[x][y] = 0
          }
        }
        if (merged) {
          merged = false
          y--
        }
      }
    }
    if (beforeBoard !== JSON.stringify(board)) {
      addRandomNum(board)
    }
    setTimeout(() => {
      setBoard(JSON.parse(JSON.stringify(board)))
    }, 200)
    checkGameOver(board)
  }

  const moveRight = () => {
    const beforeBoard = JSON.stringify(board)
    for (let x = 0; x < len; x++) {
      let merged = false
      for (let y = len - 2; y >= 0; y--) {
        if (board[x][y] !== 0) {
          let j = y + 1
          while (j < len && board[x][j] === 0) j++
          if (j < len && board[x][j] === board[x][y]) {
            board[x][j] *= 2
            board[x][y] = 0
            merged = true
            setScore(prevScore => prevScore + board[x][j])
          } else if (!merged) {
            board[x][j - 1] = board[x][y]
            if (j - 1 !== y) board[x][y] = 0
          }
        }
        if (merged) {
          merged = false
          y++
        }
      }
    }
    if (beforeBoard !== JSON.stringify(board)) {
      addRandomNum(board)
    }
    setTimeout(() => {
      setBoard(JSON.parse(JSON.stringify(board)))
    }, 200)
    checkGameOver(board)
  }

  const moveUp = () => {
    const beforeBoard = JSON.stringify(board)
    for (let y = 0; y < len; y++) {
      let merged = false
      for (let x = 1; x < len; x++) {
        if (board[x][y] !== 0) {
          let i = x - 1
          while (i >= 0 && board[i][y] === 0) i--
          if (i >= 0 && board[i][y] === board[x][y]) {
            board[i][y] *= 2
            board[x][y] = 0
            merged = true
            setScore(prevScore => prevScore + board[i][y])
          } else if (!merged) {
            board[i + 1][y] = board[x][y]
            if (i + 1 !== x) board[x][y] = 0
          }
        }
        if (merged) {
          merged = false
          x--
        }
      }
    }
    if (beforeBoard !== JSON.stringify(board)) {
      addRandomNum(board)
    }
    setTimeout(() => {
      setBoard(JSON.parse(JSON.stringify(board)))
    }, 200)
    checkGameOver(board)
  }

  const moveDown = () => {
    const beforeBoard = JSON.stringify(board)
    for (let y = 0; y < len; y++) {
      let merged = false
      for (let x = len - 2; x >= 0; x--) {
        if (board[x][y] !== 0) {
          let i = x + 1
          while (i < len && board[i][y] === 0) i++
          if (i < len && board[i][y] === board[x][y]) {
            board[i][y] *= 2
            board[x][y] = 0
            merged = true
            setScore(prevScore => prevScore + board[i][y])
          } else if (!merged) {
            board[i - 1][y] = board[x][y]
            if (i - 1 !== x) board[x][y] = 0
          }
        }
        if (merged) {
          merged = false
          x++
        }
      }
    }
    if (beforeBoard !== JSON.stringify(board)) {
      addRandomNum(board)
    }
    setTimeout(() => {
      setBoard(JSON.parse(JSON.stringify(board)))
    }, 200)
    checkGameOver(board)
  }

  const checkGameOver = board => {
    for (let x = 0; x < len; x++) {
      for (let y = 0; y < len; y++) {
        if (board[x][y] === 0) return
        if (
          (y < len - 1 && board[x][y] === board[x][y + 1]) ||
          (x < len - 1 && board[x][y] === board[x + 1][y])
        )
          return
      }
    }
    setGameOver(true)
  }

  return (
    <div className='game'>
      <div className='game-score'>
        分数：<span>{score}</span>
      </div>
      <div
        className='game-container'
        style={{
          width: len * size + margin * (len + 1),
          height: len * size + margin * (len + 1),
        }}
      >
        {board.map((row, x) =>
          row.map((num, y) => (
            <Cell num={num} size={size} margin={margin} x={x} y={y} />
          )),
        )}
      </div>
      {gameOver && (
        <div className='game-over'>
          <div className='game-over-info'>
            <p>游戏结束</p>
            <span onClick={initBoard} onKeyUp={() => {}}>
              重新开始
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default Game
