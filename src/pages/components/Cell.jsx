import React from 'react'

const Cell = ({ num, size, margin, x, y }) => {
  const getClassName = num => {
    switch (num) {
      case 2:
        return 'game-num-2'
      case 4:
        return 'game-num-4'
      case 8:
        return 'game-num-8'
      case 16:
        return 'game-num-16'
      case 32:
        return 'game-num-32'
      case 64:
        return 'game-num-64'
      case 128:
        return 'game-num-128'
      case 256:
        return 'game-num-256'
      case 512:
        return 'game-num-512'
      case 1024:
        return 'game-num-1024'
      case 2048:
        return 'game-num-2048'
      default:
        return ''
    }
  }

  const style = {
    width: size,
    height: size,
    top: margin + x * (size + margin),
    left: margin + y * (size + margin),
    lineHeight: `${size}px`,
  }

  return (
    <div
      className={`game-cell ${num !== 0 ? 'game-num' : ''} ${getClassName(
        num,
      )}`}
      style={style}
    >
      {num !== 0 ? num : ''}
    </div>
  )
}

export default Cell
