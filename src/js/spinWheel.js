const WHEEL_PRIZES = [
  { text: '1000 Gems', type: 'gems', value: 1000, color: '#4CAF50', textColor: '#fff' },
  { text: '500 Gems', type: 'gems', value: 500, color: '#2196F3', textColor: '#fff' },
  { text: '50 Clicks', type: 'clicks', value: 50, color: '#4CAF50', textColor: '#fff' },
  { text: 'Try Again', type: 'none', value: 0, color: '#9E9E9E', textColor: '#fff' },
  { text: '200 Gems', type: 'gems', value: 200, color: '#2196F3', textColor: '#fff' },
  { text: '250 Clicks', type: 'clicks', value: 250, color: '#4CAF50', textColor: '#fff' },
  { text: '100 Gems', type: 'gems', value: 100, color: '#2196F3', textColor: '#fff' },
  { text: '10 Gems', type: 'gems', value: 10, color: '#2196F3', textColor: '#fff' },
  { text: 'Double!', type: 'double', value: 0, color: '#FF9800', textColor: '#fff' },
  { text: '10 Clicks', type: 'clicks', value: 10, color: '#4CAF50', textColor: '#fff' },
  {
    text: "Wheel Skin",
    type: "skin",
    itemId: "skin_wheel",
    img: "assets/buttons/WheelButton.png",
    chance: 0.1,
    color: "#9c27b0",
    textColor: "#fff"
  },
  { text: '50 Gems', type: 'gems', value: 50, color: '#2196F3', textColor: '#fff' },
];

class SpinWheel {
  constructor(canvasId, prizes, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.prizes = prizes;
    this.options = {
      rotationResistance: 35,
      minSpins: 5,
      spinDuration: 6000,
      ...options
    };

    this.rotation = 0;
    this.targetRotation = 0;
    this.isSpinning = false;

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
    const r = this.radius;
    const n = this.prizes.length;
    const arcAngle = (2 * Math.PI) / n;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < n; i++) {
      const prize = this.prizes[i];

      const startAngle = i * arcAngle + this.rotation - Math.PI / 2;
      const endAngle = startAngle + arcAngle;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = prize.color;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(startAngle + arcAngle / 2);

      if (prize.img) {
        const img = new Image();
        img.src = prize.img;
        const size = r / 4;
        ctx.drawImage(img, r - size - 10, -size / 2, size, size);
      }

      ctx.fillStyle = prize.textColor;
      ctx.font = `bold ${Math.max(10, r / 12)}px Arial`;
      ctx.textAlign = 'right';

      let label = prize.text;
      if (prize.type === "skin" && prize.chance) {
        label += ` (${Math.floor(prize.chance * 100)}%)`;
      }

      ctx.fillText(label, r - 15, 20);
      ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(cx, cy, r / 6, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();

    ctx.fillStyle = '#333';
    ctx.font = `bold ${r / 8}px Arial`;
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

    const easeOut = t => 1 - Math.pow(1 - t, 4);

    const animate = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = easeOut(progress);

      this.rotation += (this.targetRotation - this.rotation) * eased;
      this.draw();

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.rotation = this.targetRotation;
        this.draw();
        this.isSpinning = false;
        if (this.onSpinComplete) {
          this.onSpinComplete(this.prizes[winningIndex]);
        }
      }
    };

    requestAnimationFrame(animate);
  }
}

let wheel = null;
let isSpinning = false;

document.addEventListener('DOMContentLoaded', () => {
  const wheelFrame = document.getElementById('WheelFrame');
  const spinButton = document.getElementById('SpinButton');
  const wheelResult = document.getElementById('WheelResult');
  const canvas = document.getElementById('SpinWheel');

  if (canvas) {
    wheel = new SpinWheel('SpinWheel', WHEEL_PRIZES, {
      minSpins: 6,
      spinDuration: 4500
    });

    wheel.onSpinComplete = (prize) => {
      isSpinning = false;
      spinButton.disabled = false;

      let message = '';

      if (prize.type === 'clicks') {
        let clicks = parseInt(localStorage.getItem('clicks')) || 0;
        clicks += prize.value;
        localStorage.setItem('clicks', clicks);
        message = `+${prize.value} Clicks`;

        document.getElementById('ClickCount').textContent = clicks;

      } else if (prize.type === 'gems') {
        let gems = parseInt(localStorage.getItem('gems')) || 0;
        gems += prize.value;
        localStorage.setItem('gems', gems);
        message = `+${prize.value} Gems`;

        document.getElementById('GemCount').textContent = gems;

      } else if (prize.type === 'skin') {
        const owned = localStorage.getItem(prize.itemId) === "true";

        if (owned) {
          let clicks = parseInt(localStorage.getItem("clicks")) || 0;
          clicks += 500;
          localStorage.setItem("clicks", clicks);
          document.getElementById("ClickCount").textContent = clicks;
          message = 'Duplicate → +500 clicks';
        } else {
          localStorage.setItem(prize.itemId, "true");
          message = 'New Skin Unlocked';
        }
      } else {
        message = 'Try again';
      }

      wheelResult.innerHTML = message;

      if (prize.img) {
        const img = document.createElement("img");
        img.src = prize.img;
        img.style.width = "80px";
        wheelResult.appendChild(img);
      }
    };
  }

  spinButton.addEventListener('click', () => {
    if (isSpinning) return;

    let gems = parseInt(localStorage.getItem('gems')) || 0;
    if (gems < 100) return;

    gems -= 100;
    localStorage.setItem('gems', gems);
    document.getElementById('GemCount').textContent = gems;

    isSpinning = true;
    spinButton.disabled = true;

    const weights = WHEEL_PRIZES.map(p => {
      if (p.type === "skin") return p.chance || 0.1;
      if (p.type === "none") return 0.5;
      return 1.5;
    });

    let total = weights.reduce((a, b) => a + b, 0);
    let rand = Math.random() * total;
    let index = 0;

    for (let i = 0; i < weights.length; i++) {
      rand -= weights[i];
      if (rand <= 0) {
        index = i;
        break;
      }
    }

    wheel.spin(index);
  });
});