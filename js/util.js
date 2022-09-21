'use strict'
var totalSeconds = 0

function renderBoard(board) {
  //,selector) {
  var strHTML = ''
  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>'
    for (var j = 0; j < board[0].length; j++) {
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
  document.getElementById('count_up_timer').innerHTML = gGame.secsPassed
}

function renderButtons() {
  var strHTML = ''
  for (var i = 0; i < 3; i++) {
    strHTML += `<button "data=${i}" onclick="difficultiesSelector(this,${i})" > 
    ${gLevel[i].label} </button>`
  }
  var elButton = document.querySelector('.level-buttons')
  elButton.innerHTML = strHTML
}

function difficultiesSelector(level, diffI) {
  console.log(level)
  gBoard = []
  // clearInterval(timerId)
  //document.getElementById('count_up_timer').innerHTML = '0:0.0'
  initGame(diffI)
}

function renderCell(elCell, cellI, cellJ) {
  if (gBoard[cellI][cellJ].isShown || gBoard[cellI][cellJ].isMarked) return
  gBoard[cellI][cellJ].isMine
    ? (elCell.innerHTML = MINE)
    : (elCell.innerText = gBoard[cellI][cellJ].minesAroundCount)
  gBoard[cellI][cellJ].isShown = true
}

document.querySelector('.game-board').addEventListener(
  'contextmenu',
  function (e) {
    // do something here...
    e.preventDefault()
  },
  false
)
