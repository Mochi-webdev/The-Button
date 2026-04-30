
const GAME_MODES = {
  ai: [
    {
      id: '1v1-ai',
      name: '1v1 Duel',
      description: 'Classic 1 vs 1 click battle',
      icon: '⚔️',
      targetScore: 50,
      opponentSpeed: 800,
      opponentAccuracy: 0.85,
      matchType: 'ai',
    },
    {
      id: '2v2-ai',
      name: '2v2 Team',
      description: 'Team up with an AI partner',
      icon: '👥',
      targetScore: 60,
      opponentSpeed: 900,
      opponentAccuracy: 0.8,
      teamMode: true,
      matchType: 'ai',
    },
    {
      id: '3v3-ai',
      name: '3v3 Free For All',
      description: 'Every player for themselves',
      icon: '🔫',
      targetScore: 75,
      opponentSpeed: 700,
      opponentAccuracy: 0.75,
      freeForAll: true,
      matchType: 'ai',
    },
    {
      id: 'race-ai',
      name: 'Speed Race',
      description: 'Click as fast as possible',
      icon: '⚡',
      targetScore: 100,
      opponentSpeed: 600,
      opponentAccuracy: 0.9,
      timeLimit: 30,
      matchType: 'ai',
    },
  ],
  public: [
    {
      id: '1v1-public',
      name: '1v1 Public',
      description: 'Queue against real players',
      icon: '🌐',
      targetScore: 50,
      opponentSpeed: 750,
      opponentAccuracy: 0.88,
      matchType: 'public',
    },
    {
      id: '2v2-public',
      name: '2v2 Public',
      description: 'Team queue with randoms',
      icon: '👥',
      targetScore: 60,
      opponentSpeed: 850,
      opponentAccuracy: 0.82,
      teamMode: true,
      matchType: 'public',
    },
  ],
  ranked: [
    {
      id: '1v1-ranked',
      name: 'Ranked 1v1',
      description: 'Competitive ladder matches',
      icon: '🏆',
      targetScore: 50,
      opponentSpeed: 700,
      opponentAccuracy: 0.92,
      matchType: 'ranked',
      ratingChange: 25,
    },
  ],
};

let currentMode = null;
let currentMatchType = 'ai'; // 'ai', 'public', or 'ranked'
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
const toggleOptions = document.querySelectorAll('.ToggleOption');
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
const playerSkinImage = document.getElementById('PlayerSkinImage');


function initClickGame() {
  // Setup Play button to open Mode Selection
  setupFrame(playButton, modeSelectionFrame, closeModeFrame);

  // Setup close button for Click Game Frame - reset game on close
  if (closeClickGame) {
    closeClickGame.addEventListener('click', () => {
      closeFrame(clickGameFrame);
      resetGame();
    });
  }

  // Load player's current skin
  loadPlayerSkin();

  // Setup mode selection toggle
  setupModeSelection();

  renderModeCards();
  setupClickGame();
  setupGameOverlay();
}

function loadPlayerSkin() {
  const currentSkin = localStorage.getItem('CurrentSkin') || 'ButtonCommon1.png';
  const skinPath = `assets/buttons/${currentSkin}`;

  // Update player skin preview and button
  if (playerSkinImage) {
    playerSkinImage.src = skinPath;
  }
  if (playerClickBtn) {
    const img = playerClickBtn.querySelector('.GameButtonImage');
    if (img) img.src = skinPath;
  }
}

function renderModeCards() {
  modeGrid.innerHTML = '';
  const modes = GAME_MODES[currentMatchType] || [];

  modes.forEach(mode => {
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

function setupModeSelection() {
  const toggleOptions = document.querySelectorAll('.ToggleOption');
  toggleOptions.forEach(btn => {
    btn.addEventListener('click', () => {
      toggleOptions.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentMatchType = btn.dataset.type;
      renderModeCards();
    });
  });
}


function setupClickGame() {
  if (!playerClickBtn || !opponentBtn) return;

  playerClickButton = playerClickBtn;
  opponentButton = opponentBtn;

  playerClickButton.addEventListener('click', handlePlayerClick);
  startGameBtn.addEventListener('click', startGame);

  // Load player skin on setup
  loadPlayerSkin();
}

// Update opponent button appearance based on match type
function updateOpponentAppearance() {
  if (!opponentBtn) return;

  const img = opponentBtn.querySelector('.GameButtonImage');
  if (!img) return;

  // For AI modes, use a default "bot" skin (grayed out)
  if (currentMode.matchType === 'ai') {
    img.src = 'assets/buttons/ButtonCommon1.png';
    img.style.opacity = '0.7';
    img.style.filter = 'grayscale(30%)';
  } else {
    // For public/ranked, use a random skin (simulating real opponent)
    const skins = ITEMS.filter(item => item.type === 'skin');
    const randomSkin = skins[Math.floor(Math.random() * skins.length)];
    img.src = `assets/buttons/${randomSkin.value}`;
    img.style.opacity = '1';
    img.style.filter = 'none';
  }
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

  gameActive = false; // Will activate after search for public/ranked
  startGameBtn.textContent = 'Game in Progress...';
  startGameBtn.disabled = true;

  resetScores();
  updateScoreDisplay();

  // Update opponent appearance based on match type
  updateOpponentAppearance();

  // For public/ranked, show "Finding opponent..." first
  if (currentMode.matchType === 'public' || currentMode.matchType === 'ranked') {
    showPopup('Searching for opponent...', 'info');
    setTimeout(() => {
      gameActive = true;
      startOpponentAI();
      showPopup('Match found! Go!', 'success');
    }, 1500);
  } else {
    gameActive = true;
    startOpponentAI();
    showPopup('Game started! First to ' + currentMode.targetScore + ' wins!', 'info');
  }
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

  // Give rewards
  if (result === 'win') {
    let gems = parseInt(localStorage.getItem('gems')) || 0;
    let reward = 10;

    if (currentMode.matchType === 'ranked') {
      reward = 25;
      // TODO: Track rating
    } else if (currentMode.matchType === 'public') {
      reward = 15;
    }

    gems += reward;
    localStorage.setItem('gems', gems);
    const gemEl = document.querySelector('.Gems');
    if (gemEl) gemEl.textContent = gems;

    showPopup(`+${reward} gems!`, 'success');
  } else {
    showPopup('You lost! Better luck next time.', 'error');
  }

  // Show overlay after short delay
  setTimeout(() => {
    openFrame(gameOverOverlay);
  }, 500);
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
