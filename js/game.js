'use strict'
var gameTimer
var foundMines = 0
var notUsedFlags
const FLAG = `<img src="img/flag25px.png" alt="flag" />`
const MINE = `<img src="img/mine28px.png" alt="Mine" />`
var gBoard = []
var gGame = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0 }
var gLevel = [
  { label: 'Easy', SIZE: 4, MINES: 2 }, // should remove label and cancel buttons render
  { label: 'Medium', SIZE: 8, MINES: 14 },
  { label: 'Hard', SIZE: 12, MINES: 32 },
]

function initGame() {
  notUsedFlags = gLevel[currLevel].MINES
  //level = 0) {{}
  clearGameData()
  gGame.isOn = true
  renderButtons()
  buildBoard(gLevel[currLevel])
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
        gBoard[i][j].isMine = Math.random() > 0.7 ? true : false
        if (gBoard[i][j].isMine === true) minesOnboard++
      }
    }
  }
  return gBoard
}

function setMinesNegsCount(elCell, cellI, cellJ) {
  var minesCount = 0
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= gBoard[i].length) continue
      if (i === cellI && j === cellJ) continue

      if (gBoard[i][j].isMine) minesCount++
    }
    gBoard[cellI][cellJ].minesAroundCount = minesCount
  }
  renderCell(elCell, cellI, cellJ)
}

function cellClicked(elCell, cellI, cellJ) {
  if (gGame.markedCount === 0 && gGame.shownCount === 0) {
    gameTimer = setInterval(countUpTimer, 1000)
  }
  console.log(gameTimer)
  setMinesNegsCount(elCell, cellI, cellJ)
  //renderCell(elCell, cellI, cellJ)
  checkGameOver(cellI, cellJ)
}

function cellMarked(elCell, cellI, cellJ) {
  console.log(notUsedFlags)
  if (gGame.markedCount === 0 && gGame.shownCount === 0) {
    gameTimer = setInterval(countUpTimer, 1000)
  }
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
  console.log(notUsedFlags)
  document.getElementById('flags-counter').innerText = notUsedFlags
}

function checkGameOver(cellI, cellJ) {
  if (gBoard[cellI][cellJ].isMine) {
    document.getElementById('restart-button').innerText = '🤯'
    console.log('Game Over')
    gGame.isOn = false
    clearInterval(gameTimer)
  }
  checkVictory()
}

function checkVictory() {
  var clearedCells = gGame.shownCount + foundMines
  if (clearedCells === gBoard.length ** 2) {
    document.getElementById('restart-button').innerText = '😎'
    console.log('Game Over')
    gGame.isOn = false
    clearInterval(gameTimer)
  }
}
