
window.updateStatsFrame = function () {
    const container = document.getElementById("StatsList");
  if (!container) return;

  container.innerHTML = "";

  const clickPower = getClickPower();
  const gemsBoost = getGemsBoost();
  const currentSkin = localStorage.getItem("CurrentSkin") || "ButtonCommon1.png";
  const skin = ITEMS.find(item => item.value === currentSkin);
  const skinBonus = skin?.clickBonus || 0;

  
  const powerDiv = document.createElement("div");
  powerDiv.style.cssText = "font-weight: bold; color: #4CAF50; font-size: 18px; margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid rgba(0,0,0,0.1);";
  powerDiv.textContent = `Click Power: ${clickPower} per click`;
  container.appendChild(powerDiv);

  const gemsDiv = document.createElement("div");
  gemsDiv.style.cssText = "font-weight: bold; color: #2196f3; font-size: 16px; margin-bottom: 8px;";
  gemsDiv.textContent = `Gems Bonus: ${gemsBoost.toFixed(1)}x`;
  container.appendChild(gemsDiv);

  if (skinBonus > 0) {
    const skinDiv = document.createElement("div");
    skinDiv.style.cssText = "font-weight: bold; color: #9c27b0; font-size: 16px; margin-bottom: 8px;";
    skinDiv.textContent = `Skin Bonus: +${Math.floor(skinBonus * 100)}%`;
    container.appendChild(skinDiv);
  }

  upgrades.forEach(upg => {
    const level = parseInt(localStorage.getItem(upg.statKey)) || 0;

    if (level > 0) {
      const div = document.createElement("div");
      div.textContent = `${upg.name}: Lv ${level}`;
      container.appendChild(div);
    }
  });
};


const upgrades = [
  {
    id: "Upgrade1",
    costBase: 150,
    costScale: 2,
    statKey: "Upgrade1",
    buttonId: "BuyUpgrade1",
    costTextId: "UpgradeCostClickBoost",
    name: "Click Boost",
    effectText: (lvl) => `Click power: ${1 + lvl} (base) x ${1 + lvl * 0.5} (bonus) = ${(1 + lvl) * (1 + lvl * 0.5)} per click`,
    amount: 1
  },
  {
    id: "Upgrade2",
    costBase: 100,
    costScale: 2,
    statKey: "Upgrade2",
    buttonId: "BuyUpgrade2",
    costTextId: "UpgradeCostAutoClicker",
    name: "Auto Clicker",
    effectText: (lvl) => `Auto clicks: ${lvl}/sec`,
    amount: 1
  },
    {
    id: "Upgrade3",
    costBase: 500,
    costScale: 1.24,
    statKey: "Upgrade3",
    buttonId: "BuyUpgrade3",
    costTextId: "UpgradeCostAutoClicker2",
    name: "Hired Clicker",
    effectText: (lvl) => `Auto clicks: ${lvl}/sec`,
    amount: 5
  },
];

updateStatsFrame();
function getLevel(upg) {
  return parseInt(localStorage.getItem(upg.statKey)) || 0;
}

function getCost(upg, level) {
  return Math.floor(upg.costBase * Math.pow(upg.costScale, level));
}


upgrades.forEach(upg => {

  const btn = document.getElementById(upg.buttonId);
  const costText = document.getElementById(upg.costTextId);

  function updateUI() {
    const level = getLevel(upg);
    const cost = getCost(upg, level);

    if (costText) {
      costText.textContent = `Cost: ${cost} clicks`;
    }
  }

  function buy() {
    let clicks = parseInt(localStorage.getItem("clicks")) || 0;

    const level = getLevel(upg);
    const cost = getCost(upg, level);

    if (clicks >= cost) {
      clicks -= cost;
      

      localStorage.setItem("clicks", clicks);
      localStorage.setItem(upg.statKey, level + upg.amount);

      document.getElementById("ClickCount").textContent = clicks;

      showPopup(
        `${upg.name} upgraded! ${upg.effectText(level + 1)}`,
        "success"
      );

      updateUI();
    } else {
      showPopup(`Not enough clicks! Need ${cost}`, "error");
    }
  }

  if (btn) btn.addEventListener("click", buy);

  updateUI();
});
setInterval(updateStatsFrame, 1000);