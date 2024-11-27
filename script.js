const gameBoard = document.getElementById('game-board');
const message = document.getElementById('message');
const restartBtn = document.getElementById('restart-btn');
const playerScoreElem = document.getElementById('player-score');
const aiScoreElem = document.getElementById('ai-score');
const difficultySelect = document.getElementById('difficulty');
const firstPlayerSelect = document.getElementById('first-player-select');

let board = ['', '', '', '', '', '', '', '', ''];
let player = 'X';
let ai = 'O';
let isPlayerTurn = true;
let gameOver = false;
let playerScore = 0;
let aiScore = 0;
let difficulty = 'easy';
let firstPlayer = 'player';
let aiInProgress = false; // Prevents overlapping AI turns

// Initialize the game
function initGame() {
  difficulty = difficultySelect.value;
  firstPlayer = firstPlayerSelect.value;
  resetGame();
}

// Render the game board
function renderBoard() {
  gameBoard.innerHTML = '';
  board.forEach((cell, i) => {
    const div = document.createElement('div');
    div.classList.add('cell');
    if (cell === player) div.classList.add('x');
    if (cell === ai) div.classList.add('o');
    if (cell) div.classList.add('taken');
    div.textContent = cell;
    div.addEventListener('click', () => handlePlayerMove(i));
    gameBoard.appendChild(div);
  });
}

// Handle player move
function handlePlayerMove(i) {
  if (!isPlayerTurn || gameOver || board[i] !== '') return;
  board[i] = player;
  isPlayerTurn = false;
  renderBoard();
  checkGameState(player);
  if (!gameOver) {
    setTimeout(aiMove, 500);
  }
}

// AI's turn
function aiMove() {
  if (gameOver || aiInProgress) return; // Prevent overlapping AI moves
  aiInProgress = true;

  let move;
  if (difficulty === 'easy') move = easyAiMove();
  else if (difficulty === 'medium') move = mediumAiMove();
  else move = hardAiMove();

  board[move] = ai;
  renderBoard();
  checkGameState(ai);
  if (!gameOver) isPlayerTurn = true;

  aiInProgress = false; // Allow player turn
}

// AI move strategies
function easyAiMove() {
  const available = board.map((v, i) => (v === '' ? i : null)).filter(v => v !== null);
  return available[Math.floor(Math.random() * available.length)];
}

function mediumAiMove() {
  // Block player or random move
  const blockMove = findWinningMove(player);
  return blockMove !== null ? blockMove : easyAiMove();
}

function hardAiMove() {
  return findWinningMove(ai) || findWinningMove(player) || easyAiMove();
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
    message.textContent = currentPlayer === player ? 'Player Wins!' : 'AI Wins!';
    gameOver = true;
    currentPlayer === player ? playerScore++ : aiScore++;
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
  renderBoard();

  if (firstPlayer === 'ai') {
    isPlayerTurn = false;
    setTimeout(() => {
      aiMove(); // AI moves first
    }, 500);
  } else {
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
  playerScoreElem.textContent = playerScore;
  aiScoreElem.textContent = aiScore;
}

// Event listeners
restartBtn.addEventListener('click', resetGame);
window.addEventListener('load', initGame);
difficultySelect.addEventListener('change', initGame);
firstPlayerSelect.addEventListener('change', initGame);
