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
      minSpins: 6,
      spinDuration: 4500,
      ...options
    };

    this.rotation = 0;
    this.targetRotation = 0;
    this.isSpinning = false;

    this.images = {};
    this.preloadImages();

    this.resize = this.resize.bind(this);
    window.addEventListener('resize', this.resize);

    this.resize();
  }

  preloadImages() {
    this.prizes.forEach(p => {
      if (p.img) {
        const img = new Image();
        img.src = p.img;
        this.images[p.img] = img;
      }
    });
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const size = Math.min(420, rect.width - 20);

    this.canvas.width = size;
    this.canvas.height = size;

    this.radius = size / 2 - 8;
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
    const arc = (2 * Math.PI) / n;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < n; i++) {
      const p = this.prizes[i];

      const start = i * arc + this.rotation - Math.PI / 2;
      const end = start + arc;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, end);
      ctx.closePath();
      ctx.fillStyle = p.color;
      ctx.fill();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(start + arc / 2);

      if (p.img && this.images[p.img]?.complete) {
        const imgSize = r * 0.25;
        ctx.drawImage(this.images[p.img], r - imgSize - 10, -imgSize / 2, imgSize, imgSize);
      }

      ctx.fillStyle = p.textColor;
      ctx.font = `bold ${Math.max(12, r * 0.08)}px Arial`;
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";

      let text = p.text;
      if (p.type === "skin") text += " 10%";

      ctx.fillText(text, r - 15, 0);

      ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(cx, cy, r / 6, 0, 2 * Math.PI);
    ctx.fillStyle = "#fff";
    ctx.fill();

    ctx.fillStyle = "#333";
    ctx.font = `bold ${r / 7}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("SPIN", cx, cy);
  }

  spin(index) {
    if (this.isSpinning) return;

    this.isSpinning = true;

    const n = this.prizes.length;
    const arc = (2 * Math.PI) / n;

    const spins = this.options.minSpins * 2 * Math.PI;
    const target = index * arc + arc / 2;

    const current = this.rotation % (2 * Math.PI);

    this.targetRotation = this.rotation + spins + (2 * Math.PI - current) + (3 * Math.PI / 2 - target);

    const start = performance.now();
    const duration = this.options.spinDuration;

    const ease = t => 1 - Math.pow(1 - t, 4);

    const anim = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const e = ease(t);

      this.rotation = this.rotation + (this.targetRotation - this.rotation) * e;
      this.draw();

      if (t < 1) {
        requestAnimationFrame(anim);
      } else {
        this.rotation = this.targetRotation;
        this.draw();
        this.isSpinning = false;
        if (this.onSpinComplete) this.onSpinComplete(this.prizes[index]);
      }
    };

    requestAnimationFrame(anim);
  }
}

let wheel;
let isSpinning = false;

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("SpinWheel");
  const spinBtn = document.getElementById("SpinButton");
  const result = document.getElementById("WheelResult");

  wheel = new SpinWheel("SpinWheel", WHEEL_PRIZES);

  wheel.onSpinComplete = (prize) => {
    isSpinning = false;
    spinBtn.disabled = false;

    let msg = "";

    if (prize.type === "gems") {
      let g = +localStorage.getItem("gems") || 0;
      g += prize.value;
      localStorage.setItem("gems", g);
      document.getElementById("GemCount").textContent = g;
      msg = `+${prize.value} Gems`;
    } 
    else if (prize.type === "clicks") {
      let c = +localStorage.getItem("clicks") || 0;
      c += prize.value;
      localStorage.setItem("clicks", c);
      document.getElementById("ClickCount").textContent = c;
      msg = `+${prize.value} Clicks`;
    } 
    else if (prize.type === "skin") {
      if (localStorage.getItem(prize.itemId)) {
        let c = +localStorage.getItem("clicks") || 0;
        c += 500;
        localStorage.setItem("clicks", c);
        document.getElementById("ClickCount").textContent = c;
        msg = "Duplicate → +500 clicks";
      } else {
        localStorage.setItem(prize.itemId, true);
        msg = "New Skin Unlocked";
      }
    } 
    else if (prize.type === "double") {
      msg = "Spin Again!";
    } 
    else {
      msg = "Try again";
    }

    result.textContent = msg;
    result.className = "WheelResult win";
  };

  spinBtn.onclick = () => {
    if (isSpinning) return;

    let gems = +localStorage.getItem("gems") || 0;
    if (gems < 100) return;

    gems -= 100;
    localStorage.setItem("gems", gems);
    document.getElementById("GemCount").textContent = gems;

    isSpinning = true;
    spinBtn.disabled = true;

    const weights = WHEEL_PRIZES.map(p => p.type === "skin" ? p.chance : p.type === "none" ? 0.5 : 1.5);
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
  };
});