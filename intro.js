document.addEventListener('DOMContentLoaded', () => {
    const openButton = document.getElementById('openPopup');
    const closeButton = document.getElementById('closePopup');
    const overlay = document.getElementById('overlay');

    openButton.addEventListener('click', () => {
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';

        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 10);
    });

    const closePopup = () => {
        overlay.style.opacity = '0';
        document.body.style.overflow = 'auto';

        setTimeout(() => {
            overlay.style.display = 'none';
        }, 300);
    };

    closeButton.addEventListener('click', closePopup);

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closePopup();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closePopup();
        }
    });
});