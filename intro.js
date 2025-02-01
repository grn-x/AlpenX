document.addEventListener('DOMContentLoaded', () => {
    const openButton = document.getElementById('openPopup');
    const closeButton = document.getElementById('closePopup');
    const overlay = document.getElementById('overlay');

    const centerImagesWithCaptions = () => {
        const imageWrappers = document.querySelectorAll('.image-wrapper');

        imageWrappers.forEach(wrapper => {
            const image = wrapper.querySelector('.popup-image');
            const caption = wrapper.querySelector('.caption');

            image.style.maxHeight = '';

            const captionHeight = caption.offsetHeight;

            const computedStyle = window.getComputedStyle(wrapper);
            const paddingTop = parseFloat(computedStyle.paddingTop);
            const paddingBottom = parseFloat(computedStyle.paddingBottom);
            const availableHeight = wrapper.offsetHeight - paddingTop - paddingBottom - captionHeight;

            image.style.maxHeight = `${availableHeight}px`;

            const imageHeight = image.offsetHeight;
            const topSpace = (availableHeight - imageHeight) / 2;

            image.style.marginTop = `${topSpace}px`;
        });
    };

    openButton.addEventListener('click', () => {
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';

        // is wait really necessary?
        setTimeout(() => {
            overlay.style.opacity = '1';
            centerImagesWithCaptions();
        }, 10);
    });

    let resizeTimeout; //TODO fix resizing
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(centerImagesWithCaptions, 100);
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