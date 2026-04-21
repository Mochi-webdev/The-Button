var Button = document.querySelector(".ButtonImage");

var Clicks = localStorage.getItem("clicks") || 0;
document.getElementById("ClickCount").textContent = Clicks;
Button.addEventListener("click", function() {
    Clicks++;
    localStorage.setItem("clicks", Clicks);
    var buttonImage = Button.src.replace(/(\d+)\.png$/, "1-Down" + ".png");
    Button.src = buttonImage;
    document.getElementById("ClickCount").textContent = Clicks;
    setTimeout(function() {
        Button.src = Button.src.replace("-Down", "");
    }, 100);
});