
window.updateStatsFrame = function () {
    const container = document.getElementById("StatsList");
  if (!container) return;

  container.innerHTML = "";

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
    effectText: (lvl) => `Boost is now ${1 + lvl * 0.5}`,
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