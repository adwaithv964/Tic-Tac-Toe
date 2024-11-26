// script.js

let board = ['', '', '', '', '', '', '', '', '']; // 3x3 board
let player = 'X'; // Player starts as 'X'
let ai = 'O';
let gameOver = false;
let playerScore = 0;
let aiScore = 0;
let difficulty = 'hard'; // Default difficulty mode

const gameBoard = document.getElementById('game-board');
const message = document.getElementById('message');
const restartBtn = document.getElementById('restart-btn');
const playerScoreElem = document.getElementById('player-score');
const aiScoreElem = document.getElementById('ai-score');
const difficultySelect = document.getElementById('difficulty');

// Change difficulty mode
difficultySelect.addEventListener('change', (e) => {
  difficulty = e.target.value;
  resetGame();
  renderBoard();  // Ensure the board is rendered after difficulty change
});

function renderBoard() {
  gameBoard.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    if (board[i] !== '') {
      cell.classList.add(board[i].toLowerCase());
      cell.textContent = board[i];
      cell.classList.add('taken');
    } else {
      cell.addEventListener('click', () => handlePlayerMove(i));
    }
    gameBoard.appendChild(cell);
  }
}

function handlePlayerMove(i) {
  if (gameOver || board[i] !== '') return;
  board[i] = player;
  renderBoard();
  if (checkWinner(player)) {
    playerScore++;
    playerScoreElem.textContent = playerScore;
    message.textContent = 'Player Wins!';
    gameOver = true;
    return;
  }
  if (board.every(cell => cell !== '')) {
    message.textContent = 'It\'s a Draw!';
    gameOver = true;
    return;
  }
  setTimeout(aiMove, 500);  // Make AI move after a delay
}

function aiMove() {
  if (gameOver) return;
  let bestMove;

  if (difficulty === 'easy') {
    bestMove = easyAiMove();
  } else if (difficulty === 'medium') {
    bestMove = mediumAiMove();
  } else {
    bestMove = hardAiMove();
  }

  board[bestMove] = ai;
  renderBoard();
  if (checkWinner(ai)) {
    aiScore++;
    aiScoreElem.textContent = aiScore;
    message.textContent = 'AI Wins!';
    gameOver = true;
  }
}

// Easy mode AI move - pick a random empty spot
function easyAiMove() {
  const availableMoves = board.reduce((acc, curr, index) => {
    if (curr === '') acc.push(index);
    return acc;
  }, []);
  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

// Medium mode AI move - try to block player or win
function mediumAiMove() {
  const availableMoves = board.reduce((acc, curr, index) => {
    if (curr === '') acc.push(index);
    return acc;
  }, []);
  
  // Check for a winning move or blocking a player's winning move
  for (let i = 0; i < availableMoves.length; i++) {
    const move = availableMoves[i];
    board[move] = ai;
    if (checkWinner(ai)) {
      board[move] = ''; // Undo move
      return move; // Winning move
    }
    board[move] = player;
    if (checkWinner(player)) {
      board[move] = ''; // Undo move
      return move; // Block the player
    }
    board[move] = ''; // Undo move
  }

  // If no winning/blocking move, pick a random spot
  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

// Hard mode AI move - use minimax algorithm
function hardAiMove() {
  return minimax(board, ai).index;
}

function minimax(newBoard, currentPlayer) {
  const availableMoves = newBoard.reduce((acc, curr, index) => {
    if (curr === '') acc.push(index);
    return acc;
  }, []);

  if (checkWinner(player)) return { score: -10 };
  if (checkWinner(ai)) return { score: 10 };
  if (availableMoves.length === 0) return { score: 0 };

  let moves = [];
  for (let i = 0; i < availableMoves.length; i++) {
    const move = availableMoves[i];
    newBoard[move] = currentPlayer;
    const result = minimax(newBoard, currentPlayer === ai ? player : ai);
    moves.push({ index: move, score: result.score });
    newBoard[move] = ''; // undo move
  }

  let bestMove;
  if (currentPlayer === ai) {
    let bestScore = -Infinity;
    moves.forEach(move => {
      if (move.score > bestScore) {
        bestScore = move.score;
        bestMove = move;
      }
    });
  } else {
    let bestScore = Infinity;
    moves.forEach(move => {
      if (move.score < bestScore) {
        bestScore = move.score;
        bestMove = move;
      }
    });
  }
  
  return bestMove;
}

function checkWinner(player) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  return winPatterns.some(pattern => {
    return pattern.every(index => board[index] === player);
  });
}

function resetGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  gameOver = false;
  message.textContent = '';
  renderBoard();
}

restartBtn.addEventListener('click', resetGame);

renderBoard();
