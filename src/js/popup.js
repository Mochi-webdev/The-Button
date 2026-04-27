const popupMap = new Map(); 

function showPopup(message, type = 'info') {

    let container = document.getElementById('popup-container');

    if (!container) {
        container = document.createElement('div');
        container.id = 'popup-container';
        container.style.position = 'fixed';
        container.style.top = '20px';
        container.style.left = '50%';
        container.style.transform = 'translateX(-50%)';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '10px';
        container.style.zIndex = '1000';
        document.body.appendChild(container);
    }

    
    if (popupMap.has(message)) {
        const data = popupMap.get(message);
        data.count++;

        data.element.querySelector('.popup-count').textContent = `x${data.count}`;

        clearTimeout(data.timeout);
        data.timeout = removePopupLater(message, data.element);

        return;
    }

    const popup = document.createElement('div');
    popup.className = `popup popup-${type}`;

    popup.style.padding = '12px 24px';
    popup.style.borderRadius = '7px';
    popup.style.color = '#fff';
    popup.style.fontFamily = 'Arial, sans-serif';
    popup.style.fontSize = '20px';
    popup.style.opacity = '0';
    popup.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    popup.style.transition = 'opacity 0.3s ease';
    popup.style.display = 'flex';
    popup.style.justifyContent = 'space-between';
    popup.style.alignItems = 'center';
    popup.style.minWidth = '250px';
    popup.style.maxWidth = '400px';

  
    switch (type) {
        case 'success': popup.style.backgroundColor = '#4caf50'; break;
        case 'error': popup.style.backgroundColor = '#f44336'; break;
        case 'warning': popup.style.backgroundColor = '#ff9800'; break;
        default: popup.style.backgroundColor = '#2196f3';
    }

    
    const text = document.createElement('span');
    text.textContent = message;

  
    const counter = document.createElement('span');
    counter.className = 'popup-count';
    counter.style.marginLeft = '10px';
    counter.style.fontWeight = 'bold';
    counter.textContent = 'x1';

    popup.appendChild(text);
    popup.appendChild(counter);

    container.appendChild(popup);

   
    requestAnimationFrame(() => {
        popup.style.opacity = '0.7';
    });

    const timeout = removePopupLater(message, popup);
    popupMap.set(message, { element: popup, count: 1, timeout });

    const maxPopups = 5;
    if (container.children.length > maxPopups) {
        container.removeChild(container.firstChild);
    }
}

function removePopupLater(message, popup) {
    return setTimeout(() => {
        popup.style.opacity = '0';
        setTimeout(() => {
            popup.remove();
            popupMap.delete(message);
        }, 300);
    }, 3000);
}

window.showPopup = showPopup;

function animateValue(element, start, end, duration = 200) {
    let startTime = null;

    function update(currentTime) {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);

        const value = Math.floor(start + (end - start) * progress);
        element.textContent = value;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}
function spawnFlyingIcon(x, y, targetElement, iconSrc) {
    const icon = document.createElement("img");
    icon.src = iconSrc;

    icon.style.position = "fixed";
    icon.style.left = x + "px";
    icon.style.top = y + "px";
    icon.style.width = "24px";
    icon.style.pointerEvents = "none";
    icon.style.zIndex = 999;

    document.body.appendChild(icon);

    const targetRect = targetElement.getBoundingClientRect();

    const dx = targetRect.left + targetRect.width / 2 - x;
    const dy = targetRect.top + targetRect.height / 2 - y;

    icon.animate([
        { transform: "translate(0,0) scale(1)", opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px) scale(0.5)`, opacity: 0.3 }
    ], {
        duration: 500,
        easing: "ease-in-out"
    });

    setTimeout(() => icon.remove(), 500);
}