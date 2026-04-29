const MERCHANT_REFRESH_TIME = 5 * 60 * 1000;

const merchantPool = [
  {
    id: "skin_Gold",
    type: "skin",
    name: "Golden Button",
    img: "assets/buttons/GoldButton.png",
    cost: 25000,
    chance: 0.1,
    rarity: "epic",
    value: "GoldButton.png"
  },
  {
    id: "boost_click",
    type: "boost",
    name: "Click Boost Pack",
    desc: "+50 clicks instantly",
    cost: 2000,
    rarity: "common",
    effect: () => {
      let clicks = parseInt(localStorage.getItem("clicks")) || 0;
      clicks += 50;
      localStorage.setItem("clicks", clicks);
    }
  },
  {
    id: "boost_gems",
    type: "boost",
    name: "Gem Pack",
    desc: "+10 gems instantly",
    cost: 3000,
    rarity: "rare",
    effect: () => {
      let gems = parseInt(localStorage.getItem("gems")) || 0;
      gems += 10;
      localStorage.setItem("gems", gems);
    }
  }
];

function getMerchantItems() {
  const saved = localStorage.getItem("merchantItems");
  if (saved) return JSON.parse(saved);

  refreshMerchant();
  return JSON.parse(localStorage.getItem("merchantItems"));
}

function refreshMerchant() {
  const skins = merchantPool.filter(i => i.type === "skin");
  const others = merchantPool.filter(i => i.type !== "skin");

  const randomSkin = skins[Math.floor(Math.random() * skins.length)];

  const randomOthers = [];
  while (randomOthers.length < 2) {
    const item = others[Math.floor(Math.random() * others.length)];
    if (!randomOthers.includes(item)) randomOthers.push(item);
  }

  const selected = [randomSkin, ...randomOthers];

  localStorage.setItem("merchantItems", JSON.stringify(selected));
  localStorage.setItem("merchantLastRefresh", Date.now());

  renderMerchant();
}

function checkMerchantRefresh() {
  const last = parseInt(localStorage.getItem("merchantLastRefresh")) || 0;

  if (Date.now() - last > MERCHANT_REFRESH_TIME) {
    refreshMerchant();
  }
}

function renderMerchant() {
  const container = document.getElementById("MerchantList");
  if (!container) return;

  container.innerHTML = "";

  const items = getMerchantItems();

  items.forEach(item => {
    const div = document.createElement("div");
    div.className = `ShopSlot ${item.rarity}`;

    div.innerHTML = `
      <span class="ShopItemName">${item.name}</span>
      ${item.img ? `<img src="${item.img}" class="ShopItemIcon">` : ""}
      <span class="ShopItemDesc">
        ${item.type === "skin"
          ? `Chance: ${Math.floor(item.chance * 100)}%`
          : item.desc}
      </span>
      <span class="ShopItemCost">Cost: ${item.cost} Clicks</span>
      <button class="BuyButtonMerchant">Buy</button>
    `;

    const button = div.querySelector("button");
    button.addEventListener("click", () => buyMerchantItem(item));

    container.appendChild(div);
  });
}

function startSlotMachine(item, isWin) {
  const overlay = document.getElementById("slot-machine-overlay");
  const reels = [
    document.getElementById("reel1"),
    document.getElementById("reel2"),
    document.getElementById("reel3")
  ];
  const resultText = document.getElementById("slot-result-text");
  
  if (!overlay || !reels[0]) return;

  overlay.classList.remove("hidden");
  resultText.innerText = "SPINNING...";
  resultText.style.color = "white";

  const placeholderIcon = "assets/buttons/ButtonCommon1.png";
  const targetIcon = item.img;

  reels.forEach((reel, index) => {
    reel.innerHTML = "";
    for (let i = 0; i < 30; i++) {
      const img = document.createElement("img");
      img.src = (Math.random() > 0.5) ? placeholderIcon : item.img; 
      img.className = "slot-icon";
      reel.appendChild(img);
    }
    
    const finalImg = document.createElement("img");
    if (isWin) {
      finalImg.src = targetIcon;
    } else {
      finalImg.src = (index === 2) ? placeholderIcon : targetIcon;
    }
    finalImg.className = "slot-icon";
    reel.appendChild(finalImg);

    reel.style.transition = "none";
    reel.style.transform = "translateY(0)";
    
    setTimeout(() => {
      reel.style.transition = `transform ${2 + index * 0.5}s cubic-bezier(0.1, 0, 0.1, 1)`;
      reel.style.transform = "translateY(-3600px)"; 
    }, 50);
  });

  setTimeout(() => {
    if (isWin) {
      resultText.innerText = "JACKPOT!";
      resultText.style.color = "#ffd700";
      showPopup(`Unlocked ${item.name}!`, "success");
    } else {
      resultText.innerText = "SO CLOSE!";
      showPopup("Failed... try again!", "error");
    }
    
    setTimeout(() => {
      overlay.classList.add("hidden");
    }, 2500);
  }, 3500);
}

function buyMerchantItem(item) {
  let clicks = parseInt(localStorage.getItem("clicks")) || 0;

  if (clicks < item.cost) {
    showPopup("Not enough clicks!", "error");
    return;
  }

  clicks -= item.cost;
  localStorage.setItem("clicks", clicks);
  const clickDisplay = document.getElementById("ClickCount");
  if (clickDisplay) clickDisplay.textContent = clicks;

  if (item.type === "skin") {
    const roll = Math.random();
    const isWin = roll <= item.chance;

    if (isWin) {
      localStorage.setItem(item.id, "true");
    }
    
    startSlotMachine(item, isWin);
  } else {
    item.effect();
    showPopup(`${item.name} used!`, "success");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  checkMerchantRefresh();
  renderMerchant();
  setInterval(checkMerchantRefresh, 10000); 
});