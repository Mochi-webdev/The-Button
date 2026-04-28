const shopItems = [
  {
    id: "skin_orange",
    name: "Orange Button Skin",
    img: "assets/buttons/ButtonCommon2.png",
    desc: "Get an Orange Button Skin!",
    cost: 10000,
    type: "skin",
    value: "ButtonCommon2.png"
  },
  {
    id: "skin_blue",
    name: "Blue Button Skin",
    img: "assets/buttons/ButtonCommon3.png",
    desc: "Get a Blue Button Skin!",
    cost: 10000,
    type: "skin",
    value: "ButtonCommon3.png"
  },
  {
    id: "skin_green",
    name: "Green Button Skin",
    img: "assets/buttons/ButtonCommon4.png",
    desc: "Get a Green Button Skin!",
    cost: 10000,
    type: "skin",
    value: "ButtonCommon4.png"
  }
];
function renderShop() {
  const container = document.getElementById("ShopList");
  container.innerHTML = "";

  shopItems.forEach(item => {
    const owned = localStorage.getItem(item.id) === "true";

    const div = document.createElement("div");
    div.className = "ShopSlot";

    div.innerHTML = `
      <span class="ShopItemName">${item.name}</span>
      <img src="${item.img}" class="ShopItemIcon">
      <span class="ShopItemDesc">${item.desc}</span>
      <span class="ShopItemCost">Cost: ${item.cost} Clicks</span>
      <button ${owned ? "disabled" : ""}>
        ${owned ? "Owned" : "Buy"}
      </button>
    `;

    const button = div.querySelector("button");

    button.addEventListener("click", () => buyItem(item));

    container.appendChild(div);
  });
}
function buyItem(item) {
  let clicks = parseInt(localStorage.getItem("clicks")) || 0;

  if (clicks >= item.cost) {
    clicks -= item.cost;

    localStorage.setItem("clicks", clicks);
    localStorage.setItem(item.id, "true");

    document.getElementById("ClickCount").textContent = clicks;

   
    if (item.type === "skin") {
      localStorage.setItem("activeSkin", item.value);
      applySkin(item.value);
    }

    showPopup(`${item.name} purchased!`, "success");

    renderShop();
  } else {
    showPopup(`Not enough clicks!`, "error");
  }
}
document.addEventListener("DOMContentLoaded", () => {
    renderShop();
});