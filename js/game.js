'use strict'
// globals
var gameTimer
var gFoundMines = 0
var gNotUsedFlags
var movesStack = []
var undoToggle
var lives
const FLAG = `<img src="img/red-flag25px.png" />`
const MINE = `<img src="img/mine28px.png" alt="Mine" />`
var gBoard = []

var gGame = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0 }
var gLevel = [
  { SIZE: 4, MINES: 2, LIVES: 1 },
  { SIZE: 8, MINES: 14, LIVES: 2 },
  { SIZE: 12, MINES: 32, LIVES: 3 },
]

function initGame() {
  gNotUsedFlags = gLevel[currLevel].MINES
  lives = gLevel[currLevel].LIVES
  renderLives(lives)
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

function placeMines(board, cellI, cellJ) {
  var minesOnboard = 0
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      if (i === cellI && j === cellJ) continue
      if (minesOnboard < gLevel[currLevel].MINES) {
        gBoard[i][j].isMine = Math.random() > 0.7 ? true : false
        if (gBoard[i][j].isMine === true) minesOnboard++
      }
    }
  }
  setMinesNegsCount(board)
}

function checkGameOver(cellI, cellJ) {
  if (gBoard[cellI][cellJ].isMine) {
    lives--
    renderLives(lives)
  }
  if (lives < 0) {
    document.getElementById('restart-button').innerText = '🤯'
    gGame.isOn = false
    clearInterval(gameTimer)
  }
  checkVictory()
}

function checkVictory() {
  var clearedCells = gGame.shownCount + gFoundMines
  if (clearedCells === gBoard.length ** 2) {
    document.getElementById('restart-button').innerText = '😎'
    gGame.isOn = false
    clearInterval(gameTimer)
  }
}
