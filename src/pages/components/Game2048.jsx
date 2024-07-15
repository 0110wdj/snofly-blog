import React, { useState, useEffect } from 'react'
import Cell from './Cell'
import './Game.css'

const Game = () => {
  const len = 4 // grid size
  const size = 100 // cell size
  const margin = 20 // margin between cells
  const [score, setScore] = useState(0)
  const [board, setBoard] = useState([])
  const [gameOver, setGameOver] = useState(false)

  console.log('reload')

  useEffect(() => {
    initBoard()
    const handleKeyDown = e => {
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
  }

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

  const moveLeft = () => {
    const newBoard = board.map(row => [...row])
    for (let x = 0; x < len; x++) {
      let merged = false
      for (let y = 1; y < len; y++) {
        if (newBoard[x][y] !== 0) {
          let j = y - 1
          while (j >= 0 && newBoard[x][j] === 0) j--
          if (j >= 0 && newBoard[x][j] === newBoard[x][y]) {
            newBoard[x][j] *= 2
            newBoard[x][y] = 0
            merged = true
            setScore(prevScore => prevScore + newBoard[x][j])
          } else if (!merged) {
            newBoard[x][j + 1] = newBoard[x][y]
            if (j + 1 !== y) newBoard[x][y] = 0
          }
        }
      }
    }
    addRandomNum(newBoard)
    setBoard(newBoard)
    checkGameOver(newBoard)
  }

  const moveRight = () => {
    const newBoard = board
      .map(row => [...row].reverse())
      .map(row => row.reverse())
    moveLeft()
    setBoard(newBoard.map(row => row.reverse()).map(row => row.reverse()))
  }

  const moveUp = () => {
    const newBoard = board.map((row, x) => row.map((cell, y) => board[y][x]))
    moveLeft()
    setBoard(newBoard.map((row, x) => row.map((cell, y) => board[x][y])))
  }

  const moveDown = () => {
    const newBoard = board.map((row, x) => row.map((cell, y) => board[y][x]))
    moveRight()
    setBoard(newBoard.map((row, x) => row.map((cell, y) => board[x][y])))
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
