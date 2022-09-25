'use strict'
var totalSeconds = 0
var currLevel = 0

function renderBoard(board) {
  // var cellId
  var strHTML = ''
  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>'
    for (var j = 0; j < board[0].length; j++) {
      // cellId = (i + 1) * (j + 1)
      strHTML += `<td class="cell" data-i="${i}" data-j="${j}" onclick="cellClicked(this,${i},${j})"
      oncontextmenu="cellMarked(this,${i},${j})"></td>`
    }
    strHTML += '</tr>'
  }

  const elContainer = document.querySelector('.game-board')
  elContainer.innerHTML = strHTML
}

function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function countUpTimer() {
  ++totalSeconds
  gGame.secsPassed = totalSeconds
  document.getElementById(
    'count-up-timer'
  ).innerHTML = `Time ${gGame.secsPassed}`
}

function difficultiesSelector(diffI) {
  clearGameData()
  currLevel = diffI
  initGame()
}

function clearGameData() {
  gGame.isOn = false
  gBoard = []
  clearInterval(gameTimer)
  movesStack = []
  gameTimer = 0
  gGame.secsPassed = 0
  totalSeconds = 0
  gGame.shownCount = 0
  gGame.markedCount = 0
  gFoundMines = 0
  document.getElementById(
    'count-up-timer'
  ).innerHTML = `Time ${gGame.secsPassed}`
  document.getElementById('flags-counter').innerHTML = `${gNotUsedFlags}`
  document.getElementById('restart-button').innerText = '😊'
}

function renderLives(lives) {
  var strHTML = ''
  switch (lives) {
    case 1:
      strHTML = `Lives: ❤️`
      break
    case 2:
      strHTML = `Lives: ❤️❤️`
      break
    case 3:
      strHTML = `Lives: ❤️❤️❤️`
      break
  }
  var elLives = document.getElementById('lives')
  elLives.innerHTML = strHTML
}

function undo() {
  undoToggle = false
  if (gGame.isOn && movesStack.length > 0) {
    var moveI = movesStack[0].i
    var moveJ = movesStack[0].j
    var elCell = document.querySelector(
      `[data-i="${moveI}"][data-j="${moveJ}"]`
    )
    if (gBoard[moveI][moveJ].isMarked) {
      cellMarked(elCell, moveI, moveJ)
      undoToggle = true
    } else {
      elCell.innerText = ''
      gBoard[moveI][moveJ].isShown = !gBoard[moveI][moveJ].isShown
      elCell.classList.remove('shown')
    }
    movesStack.splice(0, 1)
    if (
      movesStack.length > 0 &&
      movesStack[0].isBatch &&
      !gBoard[moveI][moveJ].isMarked
    )
      undo()
  }
}

document.querySelector('.game-board').addEventListener(
  'contextmenu',
  function (e) {
    // do something here...
    e.preventDefault()
  },
  false
)
