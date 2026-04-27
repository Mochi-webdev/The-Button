var Button = document.querySelector(".ButtonImage");

var Gems = parseInt(localStorage.getItem("gems")) || 0;
var ClickIntervalGems = parseInt(localStorage.getItem("clickIntervalGems")) || 0;
var Clicks = parseInt(localStorage.getItem("clicks")) || 0;
var Upgrade1 = parseInt(localStorage.getItem("Upgrade1")) || 0;

var GemsBoost = 1 + Upgrade1 * 0.5;

document.getElementById("ClickCount").textContent = Clicks;
document.getElementById("GemCount").textContent = Gems;

Button.addEventListener("click", function() {
    Clicks++;
    localStorage.setItem("clicks", Clicks);

    ClickIntervalGems++;
    
    if (ClickIntervalGems >= 100) {
        ClickIntervalGems = 0;
        Gems += GemsBoost;
        localStorage.setItem("gems", Gems);
        document.getElementById("GemCount").textContent = Gems;
    }

    localStorage.setItem("clickIntervalGems", ClickIntervalGems);

    showPopup(`You earned ${GemsBoost} gems!`, 'info');
    document.getElementById("ClickCount").textContent = Clicks;
});
var UpgradeButton = document.querySelector(".UpgradeButton");
UpgradeButton.addEventListener("click", function() {
    var UpgradeFrame = document.getElementById("UpgradeFrame");
    if (UpgradeFrame.style.display === "none" || UpgradeFrame.style.display === "") {
        UpgradeFrame.style.display = "flex";
    } else {
        UpgradeFrame.style.display = "none";
    }
});
var CloseUpgradeFrameButton = document.getElementById("CloseUpgradeFrame");
CloseUpgradeFrameButton.addEventListener("click", function() {
    var UpgradeFrame = document.getElementById("UpgradeFrame");
    UpgradeFrame.style.display = "none";
});