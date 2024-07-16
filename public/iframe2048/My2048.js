;((window, document, $) => {
  function My2048(opt) {
    var prefix = opt.prefix,
      len = opt.len,
      size = opt.size,
      margin = opt.margin
    var score = 0
    var winNum = 2048
    // var winNum = 8;
    var isGameOver = false

    // 设置棋盘背景的宽度和高度
    function View() {
      this.prefix = prefix
      this.len = len
      this.size = size
      this.margin = margin
      this.container = $('#' + prefix + '_container')
      var containerSize = len * size + margin * (len + 1)
      //   console.log(containerSize);
      //   console.log(len * size + margin * (len + 1));
      //   console.log(margin * (len + 1));
      //   console.log(margin , (len + 1));
      //   console.log(len * size);
      //   console.log(len , size);
      this.container.css({ width: containerSize, height: containerSize })
      this.nums = {}
      this.score = $('#' + prefix + '_score')
    }
    View.prototype = {
      getPos: function (n) {
        return this.margin + n * (this.size + this.margin)
      },
      init: function () {
        for (var x = 0, len = this.len; x < len; ++x) {
          for (var y = 0; y < len; ++y) {
            var $cell = $('<div class="' + this.prefix + '-cell"></div>')
            $cell
              .css({
                width: this.size + 'px',
                height: this.size + 'px',
                top: this.getPos(x),
                left: this.getPos(y),
              })
              .appendTo(this.container)
          }
        }
      },
      addNum: function (x, y, num) {
        var $num = $(
          '<div class="' +
            this.prefix +
            '-num ' +
            this.prefix +
            '-num-' +
            num +
            ' ">',
        )
        $num
          .text(num)
          .css({
            top: this.getPos(x) + Number.parseInt(this.size / 2),
            left: this.getPos(y) + Number.parseInt(this.size / 2),
          })
          .appendTo(this.container)
          .animate(
            {
              width: this.size + 'px',
              height: this.size + 'px',
              lineHeight: this.size + 'px',
              top: this.getPos(x),
              left: this.getPos(y),
            },
            100,
          )
        this.nums[x + '-' + y] = $num
      },
      move: function (from, to) {
        var fromIndex = from.x + '-' + from.y,
          toIndex = to.x + '-' + to.y
        var clean = this.nums[toIndex]
        this.nums[toIndex] = this.nums[fromIndex]
        delete this.nums[fromIndex]
        var prefix = this.prefix + '-num-'
        var pos = { top: this.getPos(to.x), left: this.getPos(to.y) }
        this.nums[toIndex].finish().animate(pos, 200, function () {
          if (to.num > from.num) {
            clean.remove()
            $(this)
              .text(to.num)
              .removeClass(prefix + from.num)
              .addClass(prefix + to.num)
          }
        })
      },
      updateScore: function (score) {
        this.score.text(score)
      },
      win: function () {
        $('#' + this.prefix + '_over_info').html(
          '<p>哦豁，胜利！<br/>不是无限分数哒。</p>',
        )
        $('#' + this.prefix + '_over').removeClass(this.prefix + '-hide')
      },
      over: function (score) {
        $('#' + this.prefix + '_over_info').html(
          '<p>本次得分</p><p>' + score + '</p>',
        )
        $('#' + this.prefix + '_over').removeClass(this.prefix + '-hide')
      },
      cleanNum: function () {
        this.nums = {}
        $('#' + this.prefix + '_over').addClass(this.prefix + '-hide')
        $('.' + this.prefix + '-num').remove()
      },
    }
    var view = new View(prefix, len, size, margin)
    view.init()
    // console.log(prefix, len, size, margin);

    function Board(len) {
      this.len = len
      this.arr = []
    }
    Board.prototype = {
      init: function () {
        for (var arr = [], len = this.len, x = 0; x < len; ++x) {
          arr[x] = []
          for (var y = 0; y < len; ++y) {
            arr[x][y] = 0
          }
        }
        this.arr = arr
      },
      generate: function () {
        var empty = []
        for (var x = 0, arr = this.arr, len = arr.length; x < len; ++x) {
          for (var y = 0; y < len; ++y) {
            if (arr[x][y] === 0) {
              empty.push({ x: x, y: y })
            }
          }
        }
        if (empty.length < 1) {
          return false
        }
        var pos = empty[Math.floor(Math.random() * empty.length)]
        this.arr[pos.x][pos.y] = Math.random() < 0.5 ? 2 : 4
        this.onGenerate({ x: pos.x, y: pos.y, num: this.arr[pos.x][pos.y] })
      },
      onGenerate: e => {
        // console.log(e);
        view.addNum(e.x, e.y, e.num)
      },

      moveLeft: function () {
        var moved = false
        for (var x = 0, len = this.arr.length; x < len; ++x) {
          for (var y = 0, arr = this.arr[x]; y < len; ++y) {
            for (var next = y + 1; next < len; ++next) {
              if (arr[next] === 0) {
                continue
              }
              if (arr[y] === 0) {
                arr[y] = arr[next]
                this.onMove({
                  from: { x: x, y: next, num: arr[next] },
                  to: { x: x, y: y, num: arr[y] },
                })
                arr[next] = 0
                moved = true
                --y
              } else if (arr[y] === arr[next]) {
                arr[y] *= 2
                this.onMove({
                  from: { x: x, y: next, num: arr[next] },
                  to: { x: x, y: y, num: arr[y] },
                })
                arr[next] = 0
                moved = true
              }
              break
            }
          }
        }
        this.onMoveComplete({ moved: moved })
      },
      moveRight: function () {
        var moved = false
        for (var x = 0, len = this.arr.length; x < len; ++x) {
          for (var y = len - 1, arr = this.arr[x]; y >= 0; --y) {
            for (var prev = y - 1; prev >= 0; --prev) {
              if (arr[prev] === 0) {
                continue
              }
              if (arr[y] === 0) {
                arr[y] = arr[prev]
                this.onMove({
                  from: { x: x, y: prev, num: arr[prev] },
                  to: { x: x, y: y, num: arr[y] },
                })
                arr[prev] = 0
                moved = true
                ++y
              } else if (arr[y] === arr[prev]) {
                arr[y] += arr[prev]
                this.onMove({
                  from: { x: x, y: prev, num: arr[prev] },
                  to: { x: x, y: y, num: arr[y] },
                })
                arr[prev] = 0
                moved = true
              }
              break
            }
          }
        }
        this.onMoveComplete({ moved: moved })
      },
      moveUp: function () {
        var canMove = false
        for (var arr = this.arr, len = arr.length, y = 0; y < len; ++y) {
          for (var x = 0; x < len; ++x) {
            for (var next = x + 1; next < len; ++next) {
              if (arr[next][y] === 0) {
                continue
              }
              if (arr[x][y] === 0) {
                arr[x][y] = arr[next][y]
                this.onMove({
                  from: { x: next, y: y, num: arr[next][y] },
                  to: { x: x, y: y, num: arr[x][y] },
                })
                arr[next][y] = 0
                canMove = true
                --x
              } else if (arr[x][y] === arr[next][y]) {
                arr[x][y] += arr[next][y]
                this.onMove({
                  from: { x: next, y: y, num: arr[next][y] },
                  to: { x: x, y: y, num: arr[x][y] },
                })
                arr[next][y] = 0
                canMove = true
              }
              break
            }
          }
        }
        this.onMoveComplete({ moved: canMove })
      },
      moveDown: function () {
        var canMove = false
        for (var arr = this.arr, len = arr.length, y = 0; y < len; ++y) {
          for (var x = len - 1; x >= 0; --x) {
            for (var prev = x - 1; prev >= 0; --prev) {
              if (arr[prev][y] === 0) {
                continue
              }
              if (arr[x][y] === 0) {
                arr[x][y] = arr[prev][y]
                this.onMove({
                  from: { x: prev, y: y, num: arr[prev][y] },
                  to: { x: x, y: y, num: arr[x][y] },
                })
                arr[prev][y] = 0
                canMove = true
                ++x
              } else if (arr[x][y] === arr[prev][y]) {
                arr[x][y] += arr[prev][y]
                this.onMove({
                  from: { x: prev, y: y, num: arr[prev][y] },
                  to: { x: x, y: y, num: arr[x][y] },
                })
                arr[prev][y] = 0
                canMove = true
              }
              break
            }
          }
        }
        this.onMoveComplete({ moved: canMove })
      },

      onMove: e => {
        if (e.to.num >= winNum) {
          isGameOver = true
          setTimeout(() => {
            // alert("您获胜了！");
            view.win()
          }, 300)
        }
        if (e.to.num > e.from.num) {
          score += e.to.num
          view.updateScore(score)
        }
        view.move(e.from, e.to)
      },

      onMoveComplete: e => {
        if (!board.canMove()) {
          isGameOver = true
          setTimeout(() => {
            // alert("本次得分：" + score);
            view.over(score)
          }, 300)
        }
        if (e.moved) {
          setTimeout(() => {
            board.generate()
          }, 200)
        }
      },

      canMove: function () {
        for (var x = 0, arr = this.arr, len = arr.length; x < len; ++x) {
          for (var y = 0; y < len; y++) {
            if (arr[x][y] === 0) {
              return true
            }
            var curr = arr[x][y],
              right = arr[x][y + 1]
            var down = arr[x + 1] ? arr[x + 1][y] : null
            if (right === curr || down === curr) {
              return true
            }
          }
        }
        return false
      },
    }
    var board = new Board(len)
    $(document).keydown(e => {
      e.stopPropagation()
      e.preventDefault()
      if (isGameOver) {
        return false
      }
      switch (e.which) {
        case 37:
          board.moveLeft()
          break
        case 38:
          board.moveUp()
          break
        case 39:
          board.moveRight()
          break
        case 40:
          board.moveDown()
          break
      }
    })
    function start() {
      score = 0
      view.updateScore(0)
      view.cleanNum()
      board.init()
      board.generate()
      board.generate()
      score = 0
      isGameOver = false
    }
    $('#' + prefix + '_restart').click(start)
    start()
  }
  window['My2048'] = My2048
})(window, document, jQuery) //jQuery 区分大小写
