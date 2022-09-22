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

function renderButtons() {
  var strHTML = ''
  for (var i = 0; i < 3; i++) {
    strHTML += `<button "data=${i}" onclick="difficultiesSelector(${i})" > 
    ${gLevel[i].label} </button>`
  }
  var elButton = document.querySelector('.level-buttons')
  elButton.innerHTML = strHTML
}

function difficultiesSelector(diffI) {
  clearGameData()
  currLevel = diffI
  initGame()
}

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

function clearGameData() {
  gGame.isOn = false
  gBoard = []
  clearInterval(gameTimer)
  gGame.secsPassed = 0
  totalSeconds = 0
  gGame.shownCount = 0
  gGame.markedCount = 0
  foundMines = 0
  document.getElementById(
    'count-up-timer'
  ).innerHTML = `Time ${gGame.secsPassed}`
  document.getElementById('flags-counter').innerHTML = `${notUsedFlags}`
  document.getElementById('restart-button').innerText = '😊'
}
document.querySelector('.game-board').addEventListener(
  'contextmenu',
  function (e) {
    // do something here...
    e.preventDefault()
  },
  false
)
