function renderShop() {
  const container = document.querySelector(".ShopList");
  if (!container) return;

  container.innerHTML = "";

  const shopItems = ITEMS.filter(i => i.inShop);

  shopItems.forEach(item => {
    const owned = localStorage.getItem(item.id) === "true";
    const equipped = localStorage.getItem("CurrentSkin") === item.value;

    const div = document.createElement("div");
    div.className = `ShopSlot ${item.rarity}`;

    div.innerHTML = `
      <span>${item.name}</span>
      <img src="${item.img}">
      <span>${item.desc}</span>
      <span>Cost: ${item.cost}</span>
      <button class="ShopBuyBtn">
        ${!owned ? "Buy" : equipped ? "Equipped" : "Equip"}
      </button>
    `;

    const btn = div.querySelector("button");

    btn.onclick = () => {
      if (!owned) buyItem(item);
      else equipItem(item);
    };

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

  if (item.type === "skin") {
    localStorage.setItem(item.id, "true");
  }

  if (item.type === "boost") {
    item.effect();
  }

  updateClicksUI();

  showPopup(`${item.name} purchased!`, "success");
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