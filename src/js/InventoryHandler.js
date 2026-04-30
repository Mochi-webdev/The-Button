function getSkinFileName(name) {
  const map = {
    orange: "ButtonCommon2.png",
    blue: "ButtonCommon3.png",
    green: "ButtonCommon4.png",
    purple: "ButtonCommon5.png",
    yellow: "ButtonCommon6.png",
    pink: "ButtonCommon7.png",
    iceblue: "IceButtonBlue.png",
    iceorange: "IceButtonOrange.png",
    icegreen: "IceButtonGreen.png",
    Gold: "GoldButton.png",
    Bronze: "BronzeButton.png",
    Silver: "SilverButton.png"
  };

  return map[name] || "ButtonCommon1.png";
}
function renderInventory() {
  const container = document.getElementById("InventoryList");
  if (!container) return;

  container.innerHTML = "";

  const currentSkin = localStorage.getItem("CurrentSkin") || "ButtonCommon1.png";


  addInventoryItem({
    name: "Default Button",
    img: "assets/buttons/ButtonCommon1.png",
    value: "ButtonCommon1.png"
  });


  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    
    if (!key.startsWith("skin_")) continue;

    if (localStorage.getItem(key) !== "true") continue;

    const skinName = key.replace("skin_", "");
    const fileName = getSkinFileName(skinName);

    addInventoryItem({
      name: skinName,
      img: `assets/buttons/${fileName}`,
      value: fileName
    });
  }

  function addInventoryItem(item) {
    const equipped = currentSkin === item.value;

    const div = document.createElement("div");
    div.className = "ShopSlot";

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
      });
    }

    container.appendChild(div);
  }
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