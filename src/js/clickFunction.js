var Button = document.querySelector(".ButtonImage");
var Gems = localStorage.getItem("gems") || 0;
var ClickIntervalGems = localStorage.getItem("clickIntervalGems") || 0;
var Clicks = localStorage.getItem("clicks") || 0;
document.getElementById("ClickCount").textContent = Clicks;
document.getElementById("GemCount").textContent = Gems;
Button.addEventListener("click", function() {
    Clicks++;
    localStorage.setItem("clicks", Clicks);
    if (ClickIntervalGems === 100) {
        ClickIntervalGems = 0;
        localStorage.setItem("clickIntervalGems", ClickIntervalGems);
        Gems++;
        localStorage.setItem("gems", Gems);
        document.getElementById("GemCount").textContent = Gems;
    };
    var buttonImage = Button.src.replace(/(\d+)\.png$/, "1-Down" + ".png");
    Button.src = buttonImage;
    document.getElementById("ClickCount").textContent = Clicks;
    ClickIntervalGems++;
    localStorage.setItem("clickIntervalGems", ClickIntervalGems);
    setTimeout(function() {
        Button.src = Button.src.replace("-Down", "");
    }, 100);
});

var UpgradeButton = document.querySelector(".UpgradeButton");
UpgradeButton.addEventListener("click", function() {
    var UpgradeFrame = document.getElementById("UpgradeFrame");
    UpgradeFrame.style.display = "none";

});
