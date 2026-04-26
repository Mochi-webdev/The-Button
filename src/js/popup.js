function showPopup(message, type = 'info') {
    
    const existingPopup = document.querySelector('.popup');
    if (existingPopup) {
        existingPopup.remove();
    }

    
    const popup = document.createElement('div');
    popup.className = `popup popup-${type}`;
    popup.textContent = message;

  
    popup.style.position = 'fixed';
    popup.style.top = '20px';
    popup.style.left = '50%';
    popup.style.transform = 'translateX(-50%)';
    popup.style.padding = '12px 24px';
    popup.style.borderRadius = '4px';
    popup.style.color = '#fff';
    popup.style.fontSize = '16px';
    popup.style.zIndex = '1000';
    popup.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    popup.style.transition = 'opacity 0.3s ease';

   
    switch (type) {
        case 'success':
            popup.style.backgroundColor = '#4caf50';
            break;
        case 'error':
            popup.style.backgroundColor = '#f44336';
            break;
        case 'warning':
            popup.style.backgroundColor = '#ff9800';
            break;
        case 'info':
        default:
            popup.style.backgroundColor = '#2196f3';
    }

   
    document.body.appendChild(popup);


    popup.offsetHeight;

  
    popup.style.opacity = '1';

    
    setTimeout(() => {
        popup.style.opacity = '0';
        setTimeout(() => {
            popup.remove();
        }, 300); 
    }, 3000); 
}


window.showPopup = showPopup;