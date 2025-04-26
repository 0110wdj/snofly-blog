const Cell = ({ value, x, y, onClick }) => {
  return (
    <button
      type="button"
      className="gomoku-cell"
      onClick={onClick}
      style={{
        left: y * 32,
        top: x * 32,
      }}
    >
      {value === 1 && <div className="gomoku-stone black" />}
      {value === 2 && <div className="gomoku-stone white" />}
    </button>
  )
}

export default Cell 