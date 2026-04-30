
const GAME_MODES = [
  {
    id: '1v1',
    name: '1v1 Duel',
    description: 'Classic 1 vs 1 click battle',
    icon: '⚔️',
    targetScore: 50,
    opponentSpeed: 800, 
    opponentAccuracy: 0.85, 
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
    timeLimit: 30, 
  },
];

let currentMode = null;
let gameActive = false;
let playerScore = 0;
let opponentScore = 0;
let opponentInterval = null;
let playerClickButton = null;
let opponentButton = null;


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


function initClickGame() {
  setupFrame(playButton, modeSelectionFrame, closeModeFrame);
  setupFrame(clickGameFrame, null, closeClickGame);

  renderModeCards();
  setupModeSelection();
  setupClickGame();
  setupGameOverlay();
}

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


function selectMode(mode) {
  currentMode = mode;
  gameTitle.textContent = mode.name;
  targetScoreEl.textContent = mode.targetScore;

  closeFrame(modeSelectionFrame);
  openFrame(clickGameFrame);

  resetGame();
}


function setupModeSelection() {
  
}


function setupClickGame() {
  if (!playerClickBtn || !opponentBtn) return;

  playerClickButton = playerClickBtn;
  opponentButton = opponentBtn;

  playerClickButton.addEventListener('click', handlePlayerClick);
  startGameBtn.addEventListener('click', startGame);
}


function handlePlayerClick() {
  if (!gameActive) return;

  playerScore++;
  updateScoreDisplay();

  
  playerClickButton.style.transform = 'scale(0.95)';
  setTimeout(() => {
    playerClickButton.style.transform = '';
  }, 100);

  checkWinCondition();
}


function startGame() {
  if (gameActive) return;

  gameActive = true;
  startGameBtn.textContent = 'Game in Progress...';
  startGameBtn.disabled = true;

  resetScores();
  updateScoreDisplay();

 
  startOpponentAI();

  showPopup('Game started! First to ' + currentMode.targetScore + ' wins!', 'info');
}


function resetScores() {
  playerScore = 0;
  opponentScore = 0;
}


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


function startOpponentAI() {
  if (opponentInterval) clearInterval(opponentInterval);

  const speed = currentMode.opponentSpeed;
  const accuracy = currentMode.opponentAccuracy;

  opponentInterval = setInterval(() => {
    if (!gameActive) return;

    
    if (Math.random() <= accuracy) {
      opponentScore++;
      updateScoreDisplay();

      
      opponentButton.style.transform = 'scale(0.95)';
      setTimeout(() => {
        opponentButton.style.transform = '';
      }, 100);

      checkWinCondition();
    }
  }, speed);
}


function updateScoreDisplay() {
  if (playerScoreEl) playerScoreEl.textContent = playerScore;
  if (opponentScoreEl) opponentScoreEl.textContent = opponentScore;
}


function checkWinCondition() {
  const target = currentMode.targetScore;

  if (playerScore >= target) {
    endGame('win');
  } else if (opponentScore >= target) {
    endGame('lose');
  }
}


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

  setTimeout(() => {
    openFrame(gameOverOverlay);
  }, 500);

  showPopup(result === 'win' ? 'You won the match!' : 'You lost!', result === 'win' ? 'success' : 'error');
}


function setupGameOverlay() {
  playAgainBtn.addEventListener('click', () => {
    closeFrame(gameOverOverlay);
    resetGame();
    startGame();
  });

  closeOverlayBtn.addEventListener('click', () => {
    closeFrame(gameOverOverlay);
    closeFrame(clickGameFrame);
    resetGame();
  });
}


function setupFrame(openBtn, frame, closeBtn) {
  if (!openBtn || !frame) return;

  openBtn.addEventListener('click', () => {
    frame.style.display = 'flex';
    frame.style.pointerEvents = 'auto';
    requestAnimationFrame(() => frame.classList.add('open'));
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      frame.classList.remove('open');
      if (frame !== gameOverOverlay) {
        setTimeout(() => {
          frame.style.display = 'none';
          frame.style.pointerEvents = 'none';
        }, 250);
      }
    });
  }
}

function openFrame(frame) {
  if (!frame) return;
  frame.style.display = 'flex';
  frame.style.pointerEvents = 'auto';
  requestAnimationFrame(() => frame.classList.add('open'));
}

function closeFrame(frame) {
  if (!frame) return;
  frame.classList.remove('open');
  if (frame !== gameOverOverlay) {
    setTimeout(() => {
      frame.style.display = 'none';
      frame.style.pointerEvents = 'none';
    }, 250);
  }
}


document.addEventListener('DOMContentLoaded', initClickGame);
