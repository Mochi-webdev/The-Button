const Button = document.querySelector(".ButtonImage");

let Gems = parseInt(localStorage.getItem("gems")) || 0;
let ClickIntervalGems = parseInt(localStorage.getItem("clickIntervalGems")) || 0;
let Clicks = parseInt(localStorage.getItem("clicks")) || 0;


function getCurrentSkin() {
    return localStorage.getItem("CurrentSkin") || "ButtonCommon1.png";
}

function setCurrentSkin(skin) {
    localStorage.setItem("CurrentSkin", skin);

    if (Button) {
        Button.src = `assets/buttons/${skin}`;
    }
}

function loadSkin() {
    setCurrentSkin(getCurrentSkin());
}

loadSkin();

const clickEl = document.getElementById("ClickCount");
const gemEl = document.getElementById("GemCount");

if (clickEl) clickEl.textContent = Clicks;
if (gemEl) gemEl.textContent = Gems;

function getClickPower() {
    return 1 + (parseInt(localStorage.getItem("Upgrade1")) || 0);
}

function getGemsBoost() {
    return 1 + (parseInt(localStorage.getItem("Upgrade1")) || 0) * 0.5;
}

if (Button) {
    Button.addEventListener("click", () => {
        let clicks = parseInt(localStorage.getItem("clicks")) || 0;

        const clickPower = getClickPower();
        clicks += clickPower;

        localStorage.setItem("clicks", clicks);
        if (clickEl) clickEl.textContent = clicks;

        
        ClickIntervalGems++;

        let earnedGems = false;

        if (ClickIntervalGems >= 100) {
            ClickIntervalGems = 0;

            const boost = getGemsBoost();
            let Gems = parseInt(localStorage.getItem("gems")) || 0;
            Gems += boost;
            localStorage.setItem("gems", Gems);

            if (gemEl) gemEl.textContent = Gems;

            if (typeof showPopup === "function") {
                showPopup(`+${boost} gems!`, "success");
            }

            earnedGems = true;
        }

        localStorage.setItem("clickIntervalGems", ClickIntervalGems);

        if (typeof spawnFlyingIcon === "function") {
            const rect = Button.getBoundingClientRect();

            for (let i = 0; i < 3; i++) {
                spawnFlyingIcon(
                    rect.left + rect.width / 2,
                    rect.top + rect.height / 2,
                    earnedGems
                        ? document.querySelector(".Gems")
                        : document.querySelector(".Clicks"),
                    earnedGems
                        ? "assets/ui/GemCurrency.png"
                        : "assets/ui/ButtonCurrency.png"
                );
            }
        }
        const originalSrc = Button.src;

        Button.src = originalSrc.replace(".png", "-Down.png");

        setTimeout(() => {
            Button.src = originalSrc;
        }, 100);

    });
}


setInterval(() => {
    const auto1 = parseInt(localStorage.getItem("Upgrade2")) || 0;
    const auto2 = parseInt(localStorage.getItem("Upgrade3")) || 0;

    const autoClicks = auto1 + (auto2 * 5);

    if (autoClicks > 0) {
        let clicks = parseInt(localStorage.getItem("clicks")) || 0;

        clicks += autoClicks;

        localStorage.setItem("clicks", clicks);
        if (clickEl) clickEl.textContent = clicks;
    }
}, 1000);


function setupFrame(openBtn, frame, closeBtn) {
    if (!openBtn || !frame) return;

    openBtn.addEventListener("click", () => {
        frame.style.display = "flex";
        frame.style.pointerEvents = "auto";
        requestAnimationFrame(() => frame.classList.add("open"));
    });

    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            frame.classList.remove("open");
            setTimeout(() => {
                frame.style.display = "none";
                frame.style.pointerEvents = "none";
            }, 250);
        });
    }
}

setupFrame(
    document.querySelector(".UpgradeButton"),
    document.getElementById("UpgradeFrame"),
    document.getElementById("CloseUpgradeFrame")
);

setupFrame(
    document.querySelector(".ShopButton"),
    document.querySelector(".ShopFrame"),
    document.getElementById("CloseShopFrame")
);
setupFrame(
    document.querySelector(".MerchantButton"),
    document.querySelector(".MerchantFrame"),
    document.getElementById("CloseMerchantFrame")
);
setupFrame(
    document.querySelector(".InventoryButton"),
    document.querySelector(".InventoryFrame"),
    document.getElementById("CloseInventoryFrame")
);