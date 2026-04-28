const skins = [
  {
    id: "Orange_Btn", 
    btn_down: "ButtonCommon1-Down.png",
    btn_up: "ButtonCommon1.png",
    color: "orange",
    cost: "10000",
    cost_label: "10k",
    currency: "Clicks",
    tite: "Orange Button Skin",
    buy_label: "Get an Orange Button Skin!"
  },
  {
    id: "Blue_Btn", 
    btn_down: "ButtonCommon2-Down.png",
    btn_up: "ButtonCommon2.png",
    color: "blue",
    cost: "10000",
    cost_label: "10k",
    currency: "Clicks",
    tite: "Blue Button Skin",
    buy_label: "Get a Blue Button Skin!"
  },
  {
    id: "Green_Btn", 
    btn_down: "ButtonCommon3-Down.png",
    btn_up: "ButtonCommon3.png",
    color: "green",
    cost: "10000",
    cost_label: "10k",
    currency: "Clicks",
    tite: "Green Button Skin",
    buy_label: "Get a Green Button Skin!"
  },
  {
    id: "Purple_Btn", 
    btn_down: "ButtonCommon4-Down.png",
    btn_up: "ButtonCommon4.png",
    color: "purple",
    cost: "10000",
    cost_label: "10k",
    currency: "Clicks",
    tite: "Purple Button Skin",
    buy_label: "Get a Purple Button Skin!"
  },
];

const shopList = document.querySelector('.ShopList');

// Funktion zum Erstellen der Shop-Elemente
function renderShop() {
  // Falls die Liste vorher geleert werden soll (verhindert Duplikate beim Neu-Aufruf)
  shopList.innerHTML = "";

  skins.forEach(skin => {
    // Erstelle das Haupt-Container-Div für den Slot
    const shopSlot = document.createElement('div');
    shopSlot.classList.add('ShopSlot');

    // Setze das HTML-Gerüst zusammen (Template String)
    shopSlot.innerHTML = `
      <span class="ShopItemName" id="${skin.id}">${skin.tite}</span>
      <img src="assets/buttons/${skin.btn_up}" alt="${skin.tite}" class="ShopItemIcon">
      <span class="ShopItemDesc">${skin.buy_label}</span>
      <span class="ShopItemCost">Cost: ${skin.cost_label} ${skin.currency}</span>
      <button class="BuyShopItem" data-id="${skin.id}" data-cost="${skin.cost}">Buy</button>
    `;

    // Füge den Slot der Liste hinzu
    shopList.appendChild(shopSlot);
  });
}

// Shop initial aufrufen
document.addEventListener("DOMContentLoaded", () => {
  renderShop();
});