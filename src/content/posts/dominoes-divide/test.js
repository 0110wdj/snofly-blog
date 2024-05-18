const solute = (l, r, w) => {
  if (r[0] < l[0]) {
    ;[l[0], r[0]] = [r[0], l[0]]
  }
  if (r[1] > l[1]) {
    ;[l[1], r[1]] = [r[1], l[1]]
  }
  w[0] = Number(!(l[0] <= r[0]))
  w[1] = Number(!(l[1] <= r[1]))
}

const divide = (l, r, w) => {
  const mid = Math.floor(l.length / 2)
  return [
    l.slice(0, mid),
    l.slice(mid),
    w.slice(0, mid),
    r.slice(0, mid),
    r.slice(mid),
    w.slice(mid),
  ]
}

const getSum = (l, r) => {
  if (l.length <= 1) return 0
  let sum = 0
  for (let i = 0; i < l.length - 1; i++) {
    sum += r[i] * l[i + 1]
  }
  return sum
}

// 局部最优解的特点：1、边缘值一定是最小的值；2、边缘值交换后，最大值一定会减小，中间值一定增大。
const merge = ([ll, lr, lw], [rl, rr, rw]) => {
  const leftmax = getSum(ll, lr)
  const righttmax = getSum(rl, rr)

  const diff_sum = 0

  const cross_00 = lr.at(-1) * rl.at(0)
  const cross_10 = lr.at(-2) * rl.at(0)
  const cross_01 = lr.at(-1) * rl.at(1)
  const cross_11 = lr.at(-2) * rl.at(1)

  const diff_l = ll.at(-1) - lr.at(-1)
  const diff_r = rr.at(0) - rl.at(0)

  const sum = cross_1 + righttmax + leftmax

  return [
    [...ll, ...rl],
    [...lr, ...rr],
    [...lw, ...rw],
  ]
}

// main function
const dominoes_divide = (L, R, W) => {
  const recur = (l, r, w) => {
    if (l.length <= 1) {
      return [l, r, w]
    }
    if (l.length === 2) {
      solute(l, r, w)
      return [l, r, w]
    }
    const [ll, lr, lw, rl, rr, rw] = divide(l, r, w)
    const left = recur(ll, lr, lw)
    const right = recur(rl, rr, rw)
    return merge(left, right)
  }
  return recur(L, R, W)
}

// test case input data
const L = [5, 4, 9, 7, 3, 11]
const R = [8, 6, 6, 7, 9, 10]
const W = [0, 1, 1, 0, 0, 1]

// expected output data
// rL:[5, 4, 6, 7, 3, 11]
// rR:[8, 2, 9, 7, 9, 10]
// rW:[0, 1, 0, 0, 0, 1]
// rmax:227

console.log(dominoes_divide(L, R, W))
// console.log(dominoes_divide(L.slice(0, 2), R.slice(0, 2), W.slice(0, 2)))
