'use strict'
var gameTimer
const FLAG = '<img src="img/flag25px.png" alt="flag"/>'
const MINE = '<img src="img/mine28px.png" alt="Mine" />'
var gBoard = []
var gGame = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0 }
var gLevel = [
  { label: 'Easy', SIZE: 4, MINES: 2 },
  { label: 'Medium', SIZE: 8, MINES: 14 },
  { label: 'Hard', SIZE: 12, MINES: 32 },
]

function initGame(level = 0) {
  renderButtons()
  buildBoard(gLevel[level])
  setMinesNegsCount(gBoard)
  renderBoard(gBoard)
}

function buildBoard(level) {
  var minesOnboard = 0
  for (var i = 0; i < level.SIZE; i++) {
    gBoard[i] = []
    for (var j = 0; j < level.SIZE; j++) {
      gBoard[i][j] = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
      }
      if (minesOnboard < level.MINES) {
        // add support for levels
        gBoard[i][j].isMine = Math.random() > 0.75 ? true : false
        if (gBoard[i][j].isMine === true) minesOnboard++
      }
    }
    //   // console.log(gBoard)
    //   console.log(minesOnboard)
  }

  // gBoard[1][1].isMine = true
  // gBoard[2][2].isMine = true
  return gBoard
}

function setMinesNegsCount(Board) {
  var minesCount = 0
  var cellI
  var cellJ
  for (var x = 0; x < gBoard.length; x++) {
    cellI = x
    for (var y = 0; y < gBoard[0].length; y++) {
      cellJ = y
      for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
          if (j < 0 || j >= gBoard[i].length) continue
          if (i === cellI && j === cellJ) continue

          if (gBoard[i][j].isMine) minesCount++
        }
        gBoard[cellI][cellJ].minesAroundCount = minesCount
      }
      minesCount = 0
    }
  }
}

function cellClicked(elCell, cellI, cellJ) {
  if (gBoard[cellI][cellJ].minesAroundCount !== '') {
  }
  renderCell(elCell, cellI, cellJ)

  if (!gGame.isOn) {
    gGame.isOn = true
    gameTimer = setInterval(countUpTimer, 1000)
  }
}

function cellMarked(elCell, cellI, cellJ) {
  if (gBoard[cellI][cellJ].isShown || gBoard[cellI][cellJ].isMarked) return
  gBoard[cellI][cellJ].isMarked = true
  elCell.innerHTML = FLAG
  gGame.markedCount += 1
}

function checkGameOver() {}
