const gameBoard = document.getElementById('game-board');
const message = document.getElementById('message');
const restartBtn = document.getElementById('restart-btn');
const player1ScoreElem = document.getElementById('player1-score');
const player2ScoreElem = document.getElementById('player2-score');
const gameModeSelect = document.getElementById('game-mode');
const difficultySelect = document.getElementById('difficulty');

let board = ['', '', '', '', '', '', '', '', ''];
let player1 = 'X';
let player2 = 'O';
let currentPlayer = player1;
let isPlayerTurn = true;
let gameOver = false;
let player1Score = 0;
let player2Score = 0;
let difficulty = 'easy';
let gameMode = 'ai';
let aiInProgress = false;

// Initialize the game
function initGame() {
  difficulty = difficultySelect.value;
  gameMode = gameModeSelect.value;
  resetGame();
}

// Render the game board
function renderBoard() {
  gameBoard.innerHTML = '';
  board.forEach((cell, i) => {
    const div = document.createElement('div');
    div.classList.add('cell');
    if (cell === player1) div.classList.add('x');
    if (cell === player2) div.classList.add('o');
    if (cell) div.classList.add('taken');
    div.textContent = cell;
    div.addEventListener('click', () => handleMove(i));
    gameBoard.appendChild(div);
  });
}

// Handle a move
function handleMove(i) {
  if (gameOver || board[i] !== '' || (gameMode === 'ai' && !isPlayerTurn)) return;

  board[i] = currentPlayer;
  renderBoard();
  checkGameState(currentPlayer);

  if (!gameOver) {
    if (gameMode === 'ai') {
      // Player vs AI
      if (currentPlayer === player1) {
        isPlayerTurn = false;
        setTimeout(aiMove, 500);
      }
    } else {
      // Player vs Player
      currentPlayer = currentPlayer === player1 ? player2 : player1;
    }
  }
}

// AI's turn
function aiMove() {
  if (gameOver || aiInProgress) return;
  aiInProgress = true;

  let move;
  if (difficulty === 'easy') move = easyAiMove();
  else if (difficulty === 'medium') move = mediumAiMove();
  else move = hardAiMove();

  board[move] = player2;
  renderBoard();
  checkGameState(player2);

  if (!gameOver) isPlayerTurn = true;
  aiInProgress = false;
}

// AI move strategies
function easyAiMove() {
  const available = board.map((v, i) => (v === '' ? i : null)).filter(v => v !== null);
  return available[Math.floor(Math.random() * available.length)];
}

function mediumAiMove() {
  const blockMove = findWinningMove(player1);
  return blockMove !== null ? blockMove : easyAiMove();
}

function hardAiMove() {
  return findWinningMove(player2) || findWinningMove(player1) || easyAiMove();
}

function findWinningMove(currentPlayer) {
  for (let i = 0; i < board.length; i++) {
    if (board[i] === '') {
      board[i] = currentPlayer;
      if (checkWinner(currentPlayer)) {
        board[i] = '';
        return i;
      }
      board[i] = '';
    }
  }
  return null;
}

// Check the game state
function checkGameState(currentPlayer) {
  if (checkWinner(currentPlayer)) {
    message.textContent = currentPlayer === player1 ? 'Player 1 Wins!' : (gameMode === 'ai' ? 'AI Wins!' : 'Player 2 Wins!');
    gameOver = true;
    if (currentPlayer === player1) player1Score++;
    else player2Score++;
    updateScores();
  } else if (board.every(cell => cell !== '')) {
    message.textContent = "It's a Draw!";
    gameOver = true;
  }
}

// Reset the game
function resetGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  gameOver = false;
  message.textContent = '';
  currentPlayer = player1;
  isPlayerTurn = true;
  renderBoard();

  if (gameMode === 'ai') {
    isPlayerTurn = true;
  }
}

// Check for a winner
function checkWinner(currentPlayer) {
  const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]            // Diagonals
  ];
  return winningCombos.some(combo => combo.every(i => board[i] === currentPlayer));
}

// Update the scores
function updateScores() {
  player1ScoreElem.textContent = player1Score;
  player2ScoreElem.textContent = player2Score;
}

// Event listeners
restartBtn.addEventListener('click', resetGame);
window.addEventListener('load', initGame);
gameModeSelect.addEventListener('change', initGame);
difficultySelect.addEventListener('change', initGame);
