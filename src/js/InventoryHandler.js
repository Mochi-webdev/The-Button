

function renderInventory() {
  const container = document.getElementById("InventoryList");
  if (!container) return;

  container.innerHTML = "";

  const currentSkin =
    localStorage.getItem("CurrentSkin") || "ButtonCommon1.png";

 
  const skins = ITEMS.filter(item => item.type === "skin");

  skins.forEach(item => {
    const owned =
      item.alwaysOwned ||
      localStorage.getItem(item.id) === "true";

    if (!owned) return;

    const equipped = currentSkin === item.value;

    const div = document.createElement("div");
    div.className = `ShopSlot ${item.rarity}`;

    div.innerHTML = `
      <span class="ShopItemName">${item.name}</span>
      <img src="${item.img}" class="ShopItemIcon">

      <button class="EquipButton" ${equipped ? "disabled" : ""}>
        ${equipped ? "Equipped" : "Equip"}
      </button>
    `;

    const button = div.querySelector("button");

    if (!equipped) {
      button.addEventListener("click", () => {
        equipSkin(item.value);
        renderInventory(); 
      });
    }

    container.appendChild(div);
  });
}
function equipSkin(file) {
  localStorage.setItem("CurrentSkin", file);

  const button = document.querySelector(".ButtonImage");
  if (button) {
    button.src = `assets/buttons/${file}`;
  }

  showPopup("Skin equipped!", "success");

  renderInventory();
}
document.addEventListener("DOMContentLoaded", renderInventory);
renderInventory();