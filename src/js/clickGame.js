// Click 1v1 Game System - Extensible Mode Configuration

// Game Modes Configuration - Easy to customize/add new modes
const GAME_MODES = [
  {
    id: '1v1',
    name: '1v1 Duel',
    description: 'Classic 1 vs 1 click battle',
    icon: '⚔️',
    targetScore: 50,
    opponentSpeed: 800, // ms between opponent clicks (lower = faster)
    opponentAccuracy: 0.85, // 0-1, chance opponent clicks on time
  },
  {
    id: '2v2',
    name: '2v2 Team',
    description: 'Team up with an AI partner',
    icon: '👥',
    targetScore: 60,
    opponentSpeed: 900,
    opponentAccuracy: 0.8,
    teamMode: true,
  },
  {
    id: '3v3',
    name: '3v3 Free For All',
    description: 'Every player for themselves',
    icon: '🔫',
    targetScore: 75,
    opponentSpeed: 700,
    opponentAccuracy: 0.75,
    freeForAll: true,
  },
  {
    id: 'race',
    name: 'Speed Race',
    description: 'Click as fast as possible',
    icon: '⚡',
    targetScore: 100,
    opponentSpeed: 600,
    opponentAccuracy: 0.9,
    timeLimit: 30, // seconds
  },
];

let currentMode = null;
let gameActive = false;
let playerScore = 0;
let opponentScore = 0;
let opponentInterval = null;
let playerClickButton = null;
let opponentButton = null;

// DOM Elements
const playButton = document.getElementById('PlayButton');
const modeSelectionFrame = document.getElementById('ModeSelectionFrame');
const closeModeFrame = document.getElementById('CloseModeFrame');
const modeGrid = document.getElementById('ModeGrid');
const clickGameFrame = document.getElementById('ClickGameFrame');
const closeClickGame = document.getElementById('CloseClickGame');
const gameTitle = document.getElementById('GameTitle');
const playerScoreEl = document.getElementById('PlayerScore');
const opponentScoreEl = document.getElementById('OpponentScore');
const playerClickBtn = document.getElementById('PlayerClickButton');
const opponentBtn = document.getElementById('OpponentButton');
const startGameBtn = document.getElementById('StartGameButton');
const targetScoreEl = document.getElementById('TargetScore');
const gameOverOverlay = document.getElementById('GameOverOverlay');
const gameResultEl = document.getElementById('GameResult');
const finalScoreEl = document.getElementById('FinalScore');
const playAgainBtn = document.getElementById('PlayAgainButton');
const closeOverlayBtn = document.getElementById('CloseOverlayButton');

// Initialize
function initClickGame() {
  // Setup Play button to open Mode Selection using global setupFrame from clickFunction.js
  setupFrame(playButton, modeSelectionFrame, closeModeFrame);

  // Setup close button for Click Game Frame
  if (closeClickGame) {
    closeClickGame.addEventListener('click', () => closeGameFrame(clickGameFrame));
  }

  renderModeCards();
  setupClickGame();
  setupGameOverlay();
}

// Render mode selection cards
function renderModeCards() {
  modeGrid.innerHTML = '';
  GAME_MODES.forEach(mode => {
    const card = document.createElement('div');
    card.className = 'ModeCard';
    card.innerHTML = `
      <div class="ModeIcon">${mode.icon}</div>
      <div class="ModeName">${mode.name}</div>
      <div class="ModeDesc">${mode.description}</div>
    `;
    card.addEventListener('click', () => selectMode(mode));
    modeGrid.appendChild(card);
  });
}

// Select a game mode
function selectMode(mode) {
  currentMode = mode;
  gameTitle.textContent = mode.name;
  targetScoreEl.textContent = mode.targetScore;

  // Close mode selection and open game frame
  closeGameFrame(modeSelectionFrame);
  openGameFrame(clickGameFrame);

  resetGame();
}

// Setup mode selection frame handlers
function setupModeSelection() {
  // Frame already setup via setupFrame
}

// Setup click game handlers
function setupClickGame() {
  if (!playerClickBtn || !opponentBtn) return;

  playerClickButton = playerClickBtn;
  opponentButton = opponentBtn;

  playerClickButton.addEventListener('click', handlePlayerClick);
  startGameBtn.addEventListener('click', startGame);
}

// Handle player clicking
function handlePlayerClick() {
  if (!gameActive) return;

  playerScore++;
  updateScoreDisplay();

  // Visual feedback
  playerClickButton.style.transform = 'scale(0.95)';
  setTimeout(() => {
    playerClickButton.style.transform = '';
  }, 100);

  checkWinCondition();
}

// Start the game
function startGame() {
  if (gameActive) return;

  gameActive = true;
  startGameBtn.textContent = 'Game in Progress...';
  startGameBtn.disabled = true;

  resetScores();
  updateScoreDisplay();

  // Start opponent AI
  startOpponentAI();

  showPopup('Game started! First to ' + currentMode.targetScore + ' wins!', 'info');
}

// Reset scores
function resetScores() {
  playerScore = 0;
  opponentScore = 0;
}

// Reset game state
function resetGame() {
  gameActive = false;
  resetScores();
  updateScoreDisplay();

  if (opponentInterval) {
    clearInterval(opponentInterval);
    opponentInterval = null;
  }

  if (startGameBtn) {
    startGameBtn.textContent = 'Start Game';
    startGameBtn.disabled = false;
  }
}

// Start opponent AI clicking
function startOpponentAI() {
  if (opponentInterval) clearInterval(opponentInterval);

  const speed = currentMode.opponentSpeed;
  const accuracy = currentMode.opponentAccuracy;

  opponentInterval = setInterval(() => {
    if (!gameActive) return;

    // Simulate opponent accuracy (sometimes misses)
    if (Math.random() <= accuracy) {
      opponentScore++;
      updateScoreDisplay();

      // Visual feedback
      opponentButton.style.transform = 'scale(0.95)';
      setTimeout(() => {
        opponentButton.style.transform = '';
      }, 100);

      checkWinCondition();
    }
  }, speed);
}

// Update score display
function updateScoreDisplay() {
  if (playerScoreEl) playerScoreEl.textContent = playerScore;
  if (opponentScoreEl) opponentScoreEl.textContent = opponentScore;
}

// Check if someone won
function checkWinCondition() {
  const target = currentMode.targetScore;

  if (playerScore >= target) {
    endGame('win');
  } else if (opponentScore >= target) {
    endGame('lose');
  }
}

// End the game
function endGame(result) {
  gameActive = false;

  if (opponentInterval) {
    clearInterval(opponentInterval);
    opponentInterval = null;
  }

  const playerFinal = playerScore;
  const opponentFinal = opponentScore;

  gameResultEl.textContent = result === 'win' ? 'Victory!' : 'Defeat!';
  gameResultEl.style.color = result === 'win' ? '#4CAF50' : '#f44336';
  finalScoreEl.textContent = `${playerFinal} - ${opponentFinal}`;

  // Show overlay after short delay
  setTimeout(() => {
    openGameFrame(gameOverOverlay);
  }, 500);

  showPopup(result === 'win' ? 'You won the match!' : 'You lost!', result === 'win' ? 'success' : 'error');
}

// Setup game overlay buttons
function setupGameOverlay() {
  playAgainBtn.addEventListener('click', () => {
    closeGameFrame(gameOverOverlay);
    resetGame();
    startGame();
  });

  closeOverlayBtn.addEventListener('click', () => {
    closeGameFrame(gameOverOverlay);
    closeGameFrame(clickGameFrame);
    resetGame();
  });
}

// Frame utilities
function openGameFrame(frame) {
  if (!frame) return;
  frame.style.display = 'flex';
  frame.style.pointerEvents = 'auto';
  requestAnimationFrame(() => frame.classList.add('open'));
}

function closeGameFrame(frame) {
  if (!frame) return;
  frame.classList.remove('open');
  setTimeout(() => {
    frame.style.display = 'none';
    frame.style.pointerEvents = 'none';
  }, 250);
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', initClickGame);
