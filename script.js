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

function switchPlayer() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  if (currentPlayer === "O") aiMove();
}

function aiMove() {
  const bestMove = findBestMove(board);
  board[bestMove] = "O";

  const cell = document.querySelector(`.cell[data-index="${bestMove}"]`);
  cell.textContent = "O";
  cell.classList.add("o", "taken");

  checkResult();
  if (gameActive) currentPlayer = "X";
}

function checkResult() {
  let roundWon = false;

  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    gameActive = false;
    message.textContent = currentPlayer === "X" ? "You Win!" : "AI Wins!";
    updateScore(currentPlayer);
    return;
  }

  if (!board.includes("")) {
    gameActive = false;
    message.textContent = "It's a Draw!";
    return;
  }
}

function updateScore(winner) {
  if (winner === "X") playerScore++;
  else aiScore++;

  playerScoreElem.textContent = playerScore;
  aiScoreElem.textContent = aiScore;
}

function findBestMove(board) {
  let bestScore = -Infinity;
  let move;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = "O";
      const score = minimax(board, 0, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(board, depth, isMaximizing) {
  const scores = { X: -10, O: 10, draw: 0 };
  const result = checkWinner();

  if (result !== null) return scores[result];

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = "O";
        bestScore = Math.max(bestScore, minimax(board, depth + 1, false));
        board[i] = "";
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = "X";
        bestScore = Math.min(bestScore, minimax(board, depth + 1, true));
        board[i] = "";
      }
    }
    return bestScore;
  }
}

function checkWinner() {
  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  if (!board.includes("")) return "draw";
  return null;
}

restartBtn.addEventListener("click", () => {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;
  message.textContent = "";
  initializeGame();
});

initializeGame();
