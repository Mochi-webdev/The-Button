
function renderInventory() {
  const container = document.getElementById("InventoryList");
  if (!container) return;

  container.innerHTML = "";

  const ownedSkins = ITEMS.filter(i =>
    i.type === "skin" &&
    (localStorage.getItem(i.id) === "true" || i.id === "default")
  );

  ownedSkins.forEach(item => {
    const equipped = localStorage.getItem("CurrentSkin") === item.value;

    const div = document.createElement("div");
    div.className = `InventorySlot ${item.rarity}`;

    div.innerHTML = `
      <img src="${item.img}">
      <button>${equipped ? "Equipped" : "Equip"}</button>
    `;

    div.querySelector("button").onclick = () => equipItem(item);

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