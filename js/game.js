'use strict'
var gameTimer
var foundMines = 0
var notUsedFlags
const FLAG = `<img src="img/flag25px.png" alt="flag" />`
const MINE = `<img src="img/mine28px.png" alt="Mine" />`
var gBoard = []
var gGame = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0 }
var gLevel = [
  { SIZE: 4, MINES: 2 }, // should remove label and cancel buttons render:done
  { SIZE: 8, MINES: 14 },
  { SIZE: 12, MINES: 32 },
]
function initGame() {
  notUsedFlags = gLevel[currLevel].MINES
  //level = 0) {{}
  clearGameData()
  gGame.isOn = true
  buildBoard(gLevel[currLevel])
  renderBoard(gBoard)
}

function buildBoard(level) {
  for (var i = 0; i < level.SIZE; i++) {
    gBoard[i] = []
    for (var j = 0; j < level.SIZE; j++) {
      gBoard[i][j] = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
      }
    }
  }
  return gBoard
}

function setMinesNegsCount(board) {
  var minesAroundCount = 0
  for (var cellI = 0; cellI < board.length; cellI++) {
    for (var cellJ = 0; cellJ < board[0].length; cellJ++) {
      for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
          if (j < 0 || j >= gBoard[i].length) continue
          if (i === cellI && j === cellJ) continue
          if (gBoard[i][j].isMine) minesAroundCount++
        }
        gBoard[cellI][cellJ].minesAroundCount = minesAroundCount
      }
      minesAroundCount = 0
    }
  }
}
function cellClicked(elCell, cellI, cellJ) {
  if (!gameTimer) {
    gameTimer = setInterval(countUpTimer, 1000)
    placeMines(gBoard, cellI, cellJ)
  }
  renderCell(elCell, cellI, cellJ)
  if (!gBoard[cellI][cellJ].minesAroundCount && !gBoard[cellI][cellJ].isMine) {
    expandShown(gBoard, elCell, cellI, cellJ)
  }
  checkGameOver(cellI, cellJ)
}

function placeMines(board, cellI, cellJ) {
  var minesOnboard = 0
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      if (i === cellI && j === cellJ) continue
      if (minesOnboard < gLevel[currLevel].MINES) {
        gBoard[i][j].isMine = Math.random() > 0.66 ? true : false
        if (gBoard[i][j].isMine === true) minesOnboard++
      }
    }
  }
  setMinesNegsCount(board)
}

function cellMarked(elCell, cellI, cellJ) {
  if (!gameTimer) gameTimer = setInterval(countUpTimer, 1000)
  if (notUsedFlags < 1) return
  if (gBoard[cellI][cellJ].isShown) return
  if (gBoard[cellI][cellJ].isMarked) {
    gBoard[cellI][cellJ].isMarked = false
    elCell.innerHTML = ''
    gGame.markedCount--
    notUsedFlags++
  } else {
    gBoard[cellI][cellJ].isMarked = true
    elCell.innerHTML = FLAG
    gGame.markedCount += 1
    notUsedFlags--
    if (gBoard[cellI][cellJ].isMine) foundMines++
  }
  checkVictory()
  document.getElementById('flags-counter').innerText = notUsedFlags
}

function checkGameOver(cellI, cellJ) {
  if (gBoard[cellI][cellJ].isMine) {
    document.getElementById('restart-button').innerText = '🤯'
    gGame.isOn = false
    clearInterval(gameTimer)
  }
  checkVictory()
}

function checkVictory() {
  var clearedCells = gGame.shownCount + foundMines
  if (clearedCells === gBoard.length ** 2) {
    document.getElementById('restart-button').innerText = '😎'
    gGame.isOn = false
    clearInterval(gameTimer)
  }
}

function expandShown(board, elCell, cellI, cellJ) {
  // console.log(elCell)
  var currNegCell
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= board.length) continue
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= board[i].length) continue
      if (i === cellI && j === cellJ) continue
      currNegCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
      if (!board[i][j].isMine) renderCell(currNegCell, i, j)
    }
  }
}
