import { useRef, useState } from 'react'
import Cell from './Cell'
import './Gomoku.css'

const BOARD_SIZES = [10, 15, 19]

const emptyBoard = size =>
  Array(size)
    .fill(null)
    .map(() => Array(size).fill(0))

function checkWin(board, x, y, player) {
  const size = board.length
  const dirs = [
    [1, 0],
    [0, 1],
    [1, 1],
    [1, -1],
  ]
  for (const [dx, dy] of dirs) {
    let count = 1
    for (let d = 1; d < 5; d++) {
      const nx = x + dx * d;
      const ny = y + dy * d;
      if (nx < 0 || nx >= size || ny < 0 || ny >= size) break
      if (board[nx][ny] === player) count++
      else break
    }
    for (let d = 1; d < 5; d++) {
      const nx = x - dx * d;
      const ny = y - dy * d;
      if (nx < 0 || nx >= size || ny < 0 || ny >= size) break
      if (board[nx][ny] === player) count++
      else break
    }
    if (count >= 5) return true
  }
  return false
}

const Gomoku = () => {
  const [size, setSize] = useState(15)
  const [board, setBoard] = useState(emptyBoard(15))
  const [current, setCurrent] = useState(1) // 1: 黑子, 2: 白子
  const [winner, setWinner] = useState(0)
  const [history, setHistory] = useState([])
  const [error, setError] = useState('')
  const errorTimer = useRef(null)

  // 错误提示自动消失
  const showError = msg => {
    setError(msg)
    if (errorTimer.current) clearTimeout(errorTimer.current)
    errorTimer.current = setTimeout(() => setError(''), 1500)
  }

  const handleClick = (x, y) => {
    if (winner) {
      showError('游戏已结束，请重新开始')
      return
    }
    if (board[x][y] !== 0) {
      showError('该位置已有棋子！')
      return
    }
    const newBoard = board.map(row => row.slice())
    newBoard[x][y] = current
    const newHistory = [
      ...history,
      { board: board.map(row => row.slice()), current, winner },
    ]
    if (checkWin(newBoard, x, y, current)) {
      setWinner(current)
    }
    setBoard(newBoard)
    setCurrent(current === 1 ? 2 : 1)
    setHistory(newHistory)
  }

  const restart = () => {
    setBoard(emptyBoard(size))
    setCurrent(1)
    setWinner(0)
    setHistory([])
    setError('')
    if (errorTimer.current) clearTimeout(errorTimer.current)
  }

  const undo = () => {
    if (history.length === 0) {
      showError('没有可悔棋的步骤')
      return
    }
    const last = history[history.length - 1]
    setBoard(last.board)
    setCurrent(last.current)
    setWinner(last.winner)
    setHistory(history.slice(0, -1))
  }

  const handleSizeChange = e => {
    const newSize = Number.parseInt(e.target.value)
    setSize(newSize)
    setBoard(emptyBoard(newSize))
    setCurrent(1)
    setWinner(0)
    setHistory([])
    setError('')
    if (errorTimer.current) clearTimeout(errorTimer.current)
  }

  return (
    <div className='gomoku-outer'>
      <div className='gomoku'>
        <div className='gomoku-info'>
          <span>
            棋盘尺寸：
            <select
              value={size}
              onChange={handleSizeChange}
              className='gomoku-size-select'
            >
              {BOARD_SIZES.map(s => (
                <option key={s} value={s}>
                  {s} x {s}
                </option>
              ))}
            </select>
          </span>
          {winner ? (
            <span className='gomoku-winner'>
              {winner === 1 ? '黑子' : '白子'}胜利！
            </span>
          ) : (
            <span>当前：{current === 1 ? '黑子' : '白子'}</span>
          )}
          <button type="button" className='gomoku-restart' onClick={restart}>
            重新开始
          </button>
          <button
            type="button"
            className='gomoku-undo'
            onClick={undo}
            disabled={history.length === 0}
          >
            悔棋
          </button>
        </div>
        <div className='gomoku-board-wrapper'>
          <div
            className='gomoku-board'
            style={{
              width: size * 32,
              height: size * 32,
            }}
          >
            {board.map((row, x) =>
              row.map((cell, y) => (
                <Cell
                  key={`${x},${y},${cell}`}
                  value={cell}
                  x={x}
                  y={y}
                  onClick={() => handleClick(x, y)}
                />
              )),
            )}
            {error && <div className='gomoku-error-float'>{error}</div>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Gomoku
