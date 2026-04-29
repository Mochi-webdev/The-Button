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
      <button>Buy</button>
    `;

    const button = div.querySelector("button");
    button.addEventListener("click", () => buyMerchantItem(item));

    container.appendChild(div);
  });
}

function buyMerchantItem(item) {
  let clicks = parseInt(localStorage.getItem("clicks")) || 0;

  if (clicks < item.cost) {
    showPopup("Not enough clicks!", "error");
    return;
  }

  clicks -= item.cost;
  localStorage.setItem("clicks", clicks);
  document.getElementById("ClickCount").textContent = clicks;

  if (item.type === "skin") {
    const roll = Math.random();

    if (roll <= item.chance) {
      localStorage.setItem(item.id, "true");

      showPopup(`Unlocked ${item.name}!`, "success");
    } else {
      showPopup("Failed... try again!", "error");
    }
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