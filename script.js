// script.js
const gameBoard = document.getElementById("game-board");
const message = document.getElementById("message");
const restartBtn = document.getElementById("restart-btn");
const playerScoreElem = document.getElementById("player-score");
const aiScoreElem = document.getElementById("ai-score");

let board = ["", "", "", "", "", "", "", "", ""];
let playerScore = 0;
let aiScore = 0;
let currentPlayer = "X";
let gameActive = true;

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Initialize the game board
function initializeGame() {
  gameBoard.innerHTML = "";
  board.forEach((_, index) => {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.setAttribute("data-index", index);
    cell.addEventListener("click", handleCellClick);
    gameBoard.appendChild(cell);
  });
}

// Handle cell click
function handleCellClick(event) {
  const cell = event.target;
  const index = cell.getAttribute("data-index");

  if (board[index] !== "" || !gameActive) return;

  board[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer.toLowerCase(), "taken");

  checkResult();
  if (gameActive) switchPlayer();
}

// Switch between player X and AI O
function switchPlayer() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  if (currentPlayer === "O") aiMove();
}

// AI makes a move (smarter but simple)
function aiMove() {
  // Try to take the center if it's available
  if (board[4] === "") {
    board[4] = "O";
    const centerCell = document.querySelector(`.cell[data-index="4"]`);
    centerCell.textContent = "O";
    centerCell.classList.add("o", "taken");
  } else {
    // Check for available cells and make a random move
    const emptyCells = board.map((val, idx) => val === "" ? idx : null).filter(v => v !== null);
    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[randomIndex] = "O";

    const cell = document.querySelector(`.cell[data-index="${randomIndex}"]`);
    cell.textContent = "O";
    cell.classList.add("o", "taken");
  }

  checkResult();
  if (gameActive) currentPlayer = "X";
}

// Check for win or draw
function checkResult() {
  if (checkWinner("X")) {
    gameActive = false;
    message.textContent = "You Win!";
    updateScore("X");
    return;
  }

  if (checkWinner("O")) {
    gameActive = false;
    message.textContent = "AI Wins!";
    updateScore("O");
    return;
  }

  if (!board.includes("")) {
    gameActive = false;
    message.textContent = "It's a Draw!";
    return;
  }
}

// Check if the given player has won
function checkWinner(player) {
  return winningConditions.some(([a, b, c]) => {
    return board[a] === player && board[b] === player && board[c] === player;
  });
}

// Update the score
function updateScore(winner) {
  if (winner === "X") playerScore++;
  else aiScore++;

  playerScoreElem.textContent = playerScore;
  aiScoreElem.textContent = aiScore;
}

// Restart the game
restartBtn.addEventListener("click", () => {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;
  message.textContent = "";
  initializeGame();
});

initializeGame();
