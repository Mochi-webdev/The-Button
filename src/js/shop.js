const shopItems = [
  {
    id: "skin_orange",
    name: "Orange Button",
    img: "assets/buttons/ButtonCommon2.png",
    desc: "Clean orange look",
    cost: 10000,
    rarity: "common",
    type: "skin",
    value: "ButtonCommon2.png"
  },
  {
    id: "skin_blue",
    name: "Blue Button",
    img: "assets/buttons/ButtonCommon3.png",
    desc: "Cool blue vibe",
    cost: 10000,
    rarity: "common",
    type: "skin",
    value: "ButtonCommon3.png"
  },
  {
    id: "skin_green",
    name: "Green Button",
    img: "assets/buttons/ButtonCommon4.png",
    desc: "Nature energy",
    cost: 10000,
    rarity: "common",
    type: "skin",
    value: "ButtonCommon4.png"
  },
   {
    id: "skin_purple",
    name: "Purple Button",
    img: "assets/buttons/ButtonCommon5.png",
    desc: "Mystical purple vibe",
    cost: 10000,
    rarity: "common",
    type: "skin",
    value: "ButtonCommon5.png"
  },
{ 
    id: "skin_yellow",
    name: "Yellow Button",
    img: "assets/buttons/ButtonCommon6.png",
    desc: "Bright and cheerful",
    cost: 10000,
    rarity: "common",
    type: "skin",
    value: "ButtonCommon6.png"
  },
  { 
    id: "skin_pink",
    name: "Pink Button",
    img: "assets/buttons/ButtonCommon7.png",
    desc: "Cute and playful",
    cost: 10000,
    rarity: "common",
    type: "skin",
    value: "ButtonCommon7.png"
  },
   { 
    id: "skin_iceblue",
    name: "Ice Blue Button",
    img: "assets/buttons/IceButtonBlue.png",
    desc: "Cool and refreshing",
    cost: 50000,
    rarity: "rare",
    type: "skin",
    value: "IceButtonBlue.png"
  },
   { 
    id: "skin_iceorange",
    name: "Ice Orange Button",
    img: "assets/buttons/IceButtonOrange.png",
    desc: "Cool and refreshing, also tastes like orange",
    cost: 50000,
    rarity: "rare",
    type: "skin",
    value: "IceButtonOrange.png"
  },
   { 
    id: "skin_icegreen",
    name: "Ice Green Button",
    img: "assets/buttons/IceButtonGreen.png",
    desc: "Cool and refreshing, tastes like green apple",
    cost: 50000,
    rarity: "rare",
    type: "skin",
    value: "IceButtonGreen.png"
  },
];

function renderShop() {
  const container = document.querySelector(".ShopList");
  if (!container) return;

  container.innerHTML = "";

  shopItems.forEach(item => {
    const owned = localStorage.getItem(item.id) === "true";
    const equipped = localStorage.getItem("CurrentSkin") === item.value;

    const div = document.createElement("div");
    div.className = `ShopSlot ${item.rarity}`;

    div.innerHTML = `
      <span class="ShopItemName">${item.name}</span>
      <img src="${item.img}" class="ShopItemIcon">
      <span class="ShopItemDesc">${item.desc}</span>
      <span class="ShopItemCost">Cost: ${item.cost} Clicks</span>

      <button class="ShopButtonBuy">
        ${
          !owned ? "Buy" :
          equipped ? "Equipped" :
          "Equip"
        }
      </button>
    `;

    const button = div.querySelector("button");

    button.addEventListener("click", () => {
      if (!owned) {
        buyItem(item);
      } else {
        equipItem(item);
      }
    });

    container.appendChild(div);
  });
}



function buyItem(item) {
  let clicks = parseInt(localStorage.getItem("clicks")) || 0;

  if (clicks < item.cost) {
    showPopup("Not enough clicks!", "error");
    return;
  }

  clicks -= item.cost;

  localStorage.setItem("clicks", clicks);
  localStorage.setItem(item.id, "true");

  document.getElementById("ClickCount").textContent = clicks;

  showPopup(`${item.name} purchased!`, "success");

  renderShop();
}



function equipItem(item) {
  if (item.type === "skin") {
    localStorage.setItem("CurrentSkin", item.value);

    const button = document.querySelector(".ButtonImage");
    if (button) {
      button.src = `assets/buttons/${item.value}`;
    }

    showPopup(`${item.name} equipped!`, "success");

    renderShop();
  }
}



document.addEventListener("DOMContentLoaded", renderShop);