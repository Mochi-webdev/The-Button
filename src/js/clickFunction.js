var Button = document.querySelector(".ButtonImage");



var Gems = parseInt(localStorage.getItem("gems")) || 0;
var ClickIntervalGems = parseInt(localStorage.getItem("clickIntervalGems")) || 0;
var Clicks = parseInt(localStorage.getItem("clicks")) || 0;
var Upgrade1 = parseInt(localStorage.getItem("Upgrade1")) || 0;
var AutoClicker = parseInt(localStorage.getItem("Upgrade2")) || 0;

var CurrentSkin = localStorage.getItem("CurrentSkin") || "Default";

function getCurrentSkin() {
    return localStorage.getItem("CurrentSkin") || "Default";
}

function setCurrentSkin(skin) {
    localStorage.setItem("CurrentSkin", skin);
    document.documentElement.style.setProperty('--button-skin', `url('assets/skins/${skin}.png')`);
}

function loadSkin() {
    const skin = getCurrentSkin();
    setCurrentSkin(skin);
}

function getGemsBoost() {
    return 1 + (parseInt(localStorage.getItem("Upgrade1")) || 0) * 0.5;
}


const clickEl = document.getElementById("ClickCount");
const gemEl = document.getElementById("GemCount");

if (clickEl) clickEl.textContent = Clicks;
if (gemEl) gemEl.textContent = Gems;

function updateUpgradeStates() {
    const clicks = parseInt(localStorage.getItem("clicks")) || 0;

    document.querySelectorAll(".UpgradeItem").forEach(item => {
        const costText = item.querySelector(".UpgradeCost");
        const button = item.querySelector("button");

        if (!costText || !button) return;

        const costMatch = costText.textContent.match(/\d+/);
        const cost = costMatch ? parseInt(costMatch[0]) : 0;

        if (clicks >= cost) {
            item.classList.add("affordable");
            item.classList.remove("expensive");

            button.classList.add("affordable");
            button.classList.remove("expensive");
        } else {
            item.classList.add("expensive");
            item.classList.remove("affordable");

            button.classList.add("expensive");
            button.classList.remove("affordable");
        }
    });
}


    Button.addEventListener("click", function () {

        const clickPower = 1 + (parseInt(localStorage.getItem("Upgrade1")) || 0);
        Clicks += clickPower;

        localStorage.setItem("clicks", Clicks);
        if (clickEl) clickEl.textContent = Clicks;

        updateUpgradeStates();

        const rect = Button.getBoundingClientRect();
        let earnedGems = false;

        -
        ClickIntervalGems++;

        if (ClickIntervalGems >= 100) {
            ClickIntervalGems = 0;

            const GemsBoost = getGemsBoost();
            Gems += GemsBoost;

            localStorage.setItem("gems", Gems);

            if (gemEl && typeof animateValue === "function") {
                animateValue(gemEl, parseInt(gemEl.textContent), Gems);
            } else if (gemEl) {
                gemEl.textContent = Gems;
            }

            if (typeof showPopup === "function") {
                showPopup(`+${GemsBoost} gems!`, "success");
            }

            earnedGems = true;
        }

        localStorage.setItem("clickIntervalGems", ClickIntervalGems);

       
        if (typeof spawnFlyingIcon === "function") {
            for (let i = 0; i < 3; i++) {
                spawnFlyingIcon(
                    rect.left + rect.width / 2 + (Math.random() * 40 - 20),
                    rect.top + rect.height / 2 + (Math.random() * 40 - 20),
                    earnedGems
                        ? document.querySelector(".Gems")
                        : document.querySelector(".Clicks"),
                    earnedGems
                        ? "assets/ui/GemCurrency.png"
                        : "assets/ui/ButtonCurrency.png"
                );
            }
        }
    });


var UpgradeButton = document.querySelector(".UpgradeButton");
var UpgradeFrame = document.getElementById("UpgradeFrame");
var CloseUpgradeFrameButton = document.getElementById("CloseUpgradeFrame");

var ShopButton = document.querySelector(".ShopButton");
var ShopFrame = document.querySelector(".ShopFrame");
var CloseShopFrameButton = document.getElementById("CloseShopFrame");

if (ShopButton && ShopFrame) {
    ShopButton.addEventListener("click", function () {
        ShopFrame.style.display = "flex";
        ShopFrame.style.pointerEvents = "auto";
        requestAnimationFrame(() => {
            ShopFrame.classList.add("open");
        });
    });

};


if (CloseShopFrameButton && ShopFrame) {
    CloseShopFrameButton.addEventListener("click", function () {
        ShopFrame.classList.remove("open");

        setTimeout(() => {
            ShopFrame.style.display = "none";
        }, 250);
    });
}




if (UpgradeButton && UpgradeFrame) {
    UpgradeButton.addEventListener("click", function () {
        UpgradeFrame.style.display = "flex";
        UpgradeFrame.style.pointerEvents = "auto";
        requestAnimationFrame(() => {
            UpgradeFrame.classList.add("open");
        });

        updateUpgradeStates();
    });
}

if (CloseUpgradeFrameButton && UpgradeFrame) {
    CloseUpgradeFrameButton.addEventListener("click", function () {
        UpgradeFrame.classList.remove("open");

        setTimeout(() => {
            UpgradeFrame.style.display = "none";
        }, 250);
    });
}


const tabs = document.querySelectorAll(".ShopTab");

tabs.forEach(tab => {
    tab.addEventListener("click", () => {

        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        const category = tab.dataset.category;

        document.querySelectorAll(".UpgradeItem").forEach(item => {
            const itemCats = (item.dataset.category || "").split(" ");

            if (category === "all" || itemCats.includes(category)) {
                item.style.display = "flex";
            } else {
                item.style.display = "none";
            }
        });
    });
});


setInterval(() => {
    const auto1 = parseInt(localStorage.getItem("Upgrade2")) || 0;
    const auto2 = parseInt(localStorage.getItem("Upgrade3")) || 0;

    const autoClicks = auto1 + (auto2 * 5);

    if (autoClicks > 0) {
        Clicks += autoClicks;

        localStorage.setItem("clicks", Clicks);
        document.getElementById("ClickCount").textContent = Clicks;
    }
}, 1000);