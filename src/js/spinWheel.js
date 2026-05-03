// Spin Wheel Implementation
const WHEEL_PRIZES = [
  { text: '1000 Clicks', type: 'clicks', value: 1000, color: '#4CAF50', textColor: '#fff' },
  { text: '500 Gems', type: 'gems', value: 500, color: '#2196F3', textColor: '#fff' },
  { text: '50 Clicks', type: 'clicks', value: 50, color: '#4CAF50', textColor: '#fff' },
  { text: 'Try Again', type: 'none', value: 0, color: '#9E9E9E', textColor: '#fff' },
  { text: '200 Gems', type: 'gems', value: 200, color: '#2196F3', textColor: '#fff' },
  { text: '250 Clicks', type: 'clicks', value: 250, color: '#4CAF50', textColor: '#fff' },
  { text: '100 Gems', type: 'gems', value: 100, color: '#2196F3', textColor: '#fff' },
  { text: '10 Gems', type: 'gems', value: 10, color: '#2196F3', textColor: '#fff' },
  { text: 'Double!', type: 'double', value: 0, color: '#FF9800', textColor: '#fff' },
  { text: '10 Clicks', type: 'clicks', value: 10, color: '#4CAF50', textColor: '#fff' },
  { text: '300 Clicks', type: 'clicks', value: 300, color: '#4CAF50', textColor: '#fff' },
  { text: '50 Gems', type: 'gems', value: 50, color: '#2196F3', textColor: '#fff' },
];

class SpinWheel {
  constructor(canvasId, prizes, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.error('Canvas element not found:', canvasId);
      return;
    }
    this.ctx = this.canvas.getContext('2d');
    this.prizes = prizes;
    this.options = {
      rotationResistance: 35,
      minSpins: 5,
      spinDuration: 4000,
      ...options
    };

    this.rotation = 0;
    this.targetRotation = 0;
    this.isSpinning = false;
    this.animationFrame = null;
    this.winningPrize = null;

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.draw();
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const size = Math.min(400, rect.width - 40, 400);
    this.canvas.width = size;
    this.canvas.height = size;
    this.radius = size / 2 - 10;
    this.centerX = size / 2;
    this.centerY = size / 2;
    this.draw();
  }

  draw() {
    const ctx = this.ctx;
    const cx = this.centerX;
    const cy = this.centerY;
    const r = Math.max(10, this.radius);
    const n = this.prizes.length;
    const arcAngle = (2 * Math.PI) / n;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.fillStyle = '#f5f5f5';
    ctx.fill();
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 3;
    ctx.stroke();

    for (let i = 0; i < n; i++) {
      const startAngle = i * arcAngle + this.rotation - Math.PI / 2;
      const endAngle = startAngle + arcAngle;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = this.prizes[i].color;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(startAngle + arcAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = this.prizes[i].textColor;
      ctx.font = `bold ${Math.max(10, r / 10)}px Arial`;
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 2;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      
      const text = this.prizes[i].text;
      ctx.fillText(text, r - 15, 5);
      ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(cx, cy, Math.max(5, r / 6), 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#333';
    ctx.font = `bold ${Math.max(10, r / 8)}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SPIN', cx, cy);
  }

  spin(winningIndex) {
    if (this.isSpinning) return;
    this.isSpinning = true;

    const n = this.prizes.length;
    const arcAngle = (2 * Math.PI) / n;
    
    const extraRotations = this.options.minSpins * 2 * Math.PI;
    const targetArcCenter = winningIndex * arcAngle + arcAngle / 2;
    
    const currentMod = ((this.rotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    
    this.targetRotation = this.rotation + extraRotations + 
      (2 * Math.PI - currentMod) + (3 * Math.PI / 2 - targetArcCenter);

    const startTime = performance.now();
    const duration = this.options.spinDuration;

    const easeOut = (t) => {
      return 1 - Math.pow(1 - t, 4);
    };

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOut(progress);

      this.rotation = this.rotation + 
        (this.targetRotation - this.rotation) * easedProgress;

      this.draw();

      if (progress < 1) {
        this.animationFrame = requestAnimationFrame(animate);
      } else {
        this.rotation = this.targetRotation;
        this.draw();
        this.isSpinning = false;
        if (this.onSpinComplete) {
          this.onSpinComplete(this.prizes[winningIndex]);
        }
      }
    };

    this.animationFrame = requestAnimationFrame(animate);
  }

  stop() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    this.isSpinning = false;
  }

  destroy() {
    this.stop();
    window.removeEventListener('resize', this.resize);
  }
}

window.SpinWheel = SpinWheel;
window.WHEEL_PRIZES = WHEEL_PRIZES;

// Initialize wheel when DOM is ready
let wheel = null;
let isSpinning = false;

document.addEventListener('DOMContentLoaded', () => {
  const wheelFrame = document.getElementById('WheelFrame');
  const spinButton = document.getElementById('SpinButton');
  const wheelResult = document.getElementById('WheelResult');
  const closeWheelBtn = document.getElementById('CloseWheelFrame');

  const wheelOpener = document.querySelector('.WheelButton');
  if (wheelOpener && wheelFrame) {
    wheelOpener.addEventListener('click', () => {
      wheelFrame.style.display = 'flex';
      wheelFrame.style.pointerEvents = 'auto';
      requestAnimationFrame(() => wheelFrame.classList.add('open'));
    });
  }

  const canvas = document.getElementById('SpinWheel');
  if (canvas) {
    wheel = new SpinWheel('SpinWheel', WHEEL_PRIZES, {
      minSpins: 6,
      spinDuration: 4500
    });

    wheel.onSpinComplete = (prize) => {
      isSpinning = false;
      if (spinButton) spinButton.disabled = false;
      if (wheelFrame) wheelFrame.classList.remove('spinning');

      let message = '';
      let resultClass = 'neutral';

      if (prize.type === 'clicks') {
        const currentClicks = parseInt(localStorage.getItem('clicks')) || 0;
        localStorage.setItem('clicks', currentClicks + prize.value);
        message = `+${prize.value.toLocaleString()} Clicks! 🎉`;
        resultClass = 'win';
        
        const clickEl = document.getElementById('ClickCount');
        if (clickEl) clickEl.textContent = currentClicks + prize.value;
      } else if (prize.type === 'gems') {
        const currentGems = parseInt(localStorage.getItem('gems')) || 0;
        localStorage.setItem('gems', currentGems + prize.value);
        message = `+${prize.value} Gems! 💎`;
        resultClass = 'win';
        
        const gemEl = document.getElementById('GemCount');
        if (gemEl) gemEl.textContent = currentGems + prize.value;
      } else if (prize.type === 'double') {
        message = 'Double Spin Bonus! Spin Again!';
        resultClass = 'win';
      } else {
        message = 'Better luck next time! Try again!';
        resultClass = 'lose';
      }

      if (wheelResult) {
        wheelResult.textContent = message;
        wheelResult.className = `WheelResult ${resultClass}`;
      }

      // Flash animation on canvas
      if (wheel && wheel.draw && wheel.ctx) {
        const originalDraw = wheel.draw.bind(wheel);
        let flashCount = 0;
        const flash = () => {
          originalDraw();
          if (flashCount < 6) {
            wheel.ctx.fillStyle = flashCount % 2 === 0 ? 'rgba(255,215,0,0.3)' : 'transparent';
            wheel.ctx.fillRect(0, 0, wheel.canvas.width, wheel.canvas.height);
            flashCount++;
            setTimeout(flash, 100);
          }
        };
        flash();
      }
    };
  }

  if (spinButton) {
    spinButton.addEventListener('click', () => {
      if (isSpinning) return;

      const currentGems = parseInt(localStorage.getItem('gems')) || 0;
      const spinCost = 100;

      if (currentGems < spinCost) {
        if (wheelResult) {
          wheelResult.textContent = 'Not enough gems! Need 100 💎';
          wheelResult.className = 'WheelResult lose';
        }
        if (typeof showPopup === 'function') {
          showPopup('Not enough gems! Need 100 💎', 'error');
        }
        return;
      }

      isSpinning = true;
      localStorage.setItem('gems', currentGems - spinCost);
      
      const gemEl = document.getElementById('GemCount');
      if (gemEl) gemEl.textContent = currentGems - spinCost;

      if (wheelResult) {
        wheelResult.textContent = '';
        wheelResult.className = 'WheelResult';
      }

      spinButton.disabled = true;
      if (wheelFrame) wheelFrame.classList.add('spinning');

      const weights = [1, 1.2, 1.5, 0.5, 1, 1, 1.2, 0.8, 0.6, 1.5, 1, 1];
      const totalWeight = weights.reduce((a, b) => a + b, 0);
      let random = Math.random() * totalWeight;
      let winningIndex = 0;
      for (let i = 0; i < weights.length; i++) {
        random -= weights[i];
        if (random <= 0) {
          winningIndex = i;
          break;
        }
      }

      if (wheel) {
        wheel.spin(winningIndex);
      }
    });
  }

  if (closeWheelBtn) {
    closeWheelBtn.addEventListener('click', () => {
      if (wheelFrame) {
        wheelFrame.classList.remove('open');
        wheelFrame.classList.remove('spinning');
        setTimeout(() => {
          wheelFrame.style.display = 'none';
          wheelFrame.style.pointerEvents = 'none';
        }, 350);
      }
      if (wheelResult) {
        wheelResult.textContent = '';
        wheelResult.className = 'WheelResult';
      }
      isSpinning = false;
      if (spinButton) spinButton.disabled = false;
      if (wheel) wheel.stop();
    });
  }
});