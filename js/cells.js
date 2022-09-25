'use strict'

function renderCell(elCell, cellI, cellJ) {
  if (!gGame.isOn) return
  if (gBoard[cellI][cellJ].isShown || gBoard[cellI][cellJ].isMarked) return
  if (gBoard[cellI][cellJ].isMine) {
    elCell.innerHTML = MINE
  } else {
    if (gBoard[cellI][cellJ].minesAroundCount)
      elCell.innerText = gBoard[cellI][cellJ].minesAroundCount
  }
  gBoard[cellI][cellJ].isShown = true
  elCell.classList.add('shown')
  gGame.shownCount++
}

function cellClicked(elCell, cellI, cellJ) {
  if (!gameTimer) {
    gameTimer = setInterval(countUpTimer, 1000)
    placeMines(gBoard, cellI, cellJ)
  }
  if (gBoard[cellI][cellJ].isMarked) return

  renderCell(elCell, cellI, cellJ)
  if (!gBoard[cellI][cellJ].minesAroundCount && !gBoard[cellI][cellJ].isMine) {
    expandShown(gBoard, elCell, cellI, cellJ)
  }
  movesStack.unshift({ i: cellI, j: cellJ, isBatch: false })
  checkGameOver(cellI, cellJ)
}

function cellMarked(elCell, cellI, cellJ) {
  if (!gameTimer) {
    gameTimer = setInterval(countUpTimer, 1000)
    placeMines(gBoard, cellI, cellJ)
  }
  if (gBoard[cellI][cellJ].isShown) return
  if (gBoard[cellI][cellJ].isMarked) {
    gBoard[cellI][cellJ].isMarked = false
    elCell.innerHTML = ''
    gGame.markedCount--
    gNotUsedFlags++
  } else {
    if (gNotUsedFlags < 1) return
    gBoard[cellI][cellJ].isMarked = true
    elCell.innerHTML = FLAG
    gGame.markedCount += 1
    gNotUsedFlags--
    if (gBoard[cellI][cellJ].isMine) gFoundMines++

    if (!undoToggle) movesStack.unshift({ i: cellI, j: cellJ, isBatch: false })
  }
  checkVictory()
  document.getElementById('flags-counter').innerText = gNotUsedFlags
}

function expandShown(board, elCell, cellI, cellJ) {
  var currNegCell
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= board.length) continue
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= board[i].length) continue
      if (i === cellI && j === cellJ) continue
      currNegCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
      if (!board[i][j].isMine) {
        renderCell(currNegCell, i, j)
      }
      //   if (board[i][j].minesAroundCount === 0 && !board[i][j].isMine)
      //     console.log(currNegCell, i, j)
      //   // cellClicked(currNegCell, i, j)
      movesStack.unshift({ i: i, j: j, isBatch: true })
    }
  }
}
