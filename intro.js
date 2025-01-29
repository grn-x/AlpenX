document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('popup-overlay');
    const closeBtn = document.querySelector('.close-btn');

    setTimeout(() => {
        overlay.classList.add('active');
    }, 1000);

    closeBtn.addEventListener('click', () => {
        overlay.classList.remove('active');
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('active');
        }
    });

    const hasSeenPopup = localStorage.getItem('hasSeenWelcomePopup');

    if (!hasSeenPopup) {
        overlay.classList.add('active');
        localStorage.setItem('hasSeenWelcomePopup', 'true');
    }
});