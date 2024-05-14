// test case input data
const L = [5, 4, 9, 7, 3, 11]
const R = [8, 2, 6, 7, 9, 10]
const W = [0, 1, 1, 0, 0, 1]

// main function
const dominoes_divide = (L, R, W) => {
  const merge = ([ll, lr, lw], [rl, rr, rw]) => {
    return [[], [], []]
  }

  const recur = (l, r, w) => {
    if (l.length <= 1) {
      return [l, r, w]
    }
    if (l.length === 2) {
      return solute(l, r, w)
    }
    const [ll, lr, lw, rl, rr, rw] = divide(l, r, w)
    const leftMax = recur(ll, lr, lw)
    const rightMax = recur(rl, rr, rw)
    return merge(leftMax, rightMax)
  }

  return recur(L, R, W)
}

console.log(dominoes_divide(L, R, W))
// expected output data
// rL:[5, 4, 6, 7, 3, 11]
// rR:[8, 2, 9, 7, 9, 10]
// rW:[0, 1, 0, 0, 0, 1]
// rmax:227
