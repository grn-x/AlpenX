export class ModalSystem {
    constructor() {
        this.initialized = false;
        this.modalHTML = null;
        this.styleSheet = null;
        this.initialPopupSize = -1;
    }

    async initialize() {
        if (this.initialized) return;

        const htmlResponse = await fetch('./intro.html');
        const htmlText = await htmlResponse.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        this.modalHTML = doc.querySelector('#overlay').outerHTML;

        this.styleSheet = document.createElement('link');
        this.styleSheet.rel = 'stylesheet';
        this.styleSheet.href = './intro.css';
        document.head.appendChild(this.styleSheet);

        await new Promise((resolve) => {
            this.styleSheet.onload = resolve;
        });

        this.initialized = true;
    }

    async openDialog() {
        await this.initialize();

        const existingModal = document.querySelector('#overlay');
        if (existingModal) {
            existingModal.remove();
        }

        document.body.insertAdjacentHTML('beforeend', this.modalHTML);

        await new Promise(resolve => requestAnimationFrame(resolve));

        const overlay = document.getElementById('overlay');
        const closeButton = document.getElementById('closePopup');

        if (!overlay || !closeButton) {
            console.error('Modal elements not found');
            return;
        }

        const closePopup = () => {
            overlay.style.opacity = '0';
            document.body.style.overflow = 'auto';
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 300);
        };

        const cleanup = () => {
            closeButton.removeEventListener('click', closePopup);
            overlay.removeEventListener('click', overlayClick);
            document.removeEventListener('keydown', keydownHandler);
            window.removeEventListener('resize', this.handleResize);
        };

        const overlayClick = (e) => {
            if (e.target === overlay) closePopup();
        };

        const keydownHandler = (e) => {
            if (e.key === 'Escape') closePopup();
        };

        closeButton.addEventListener('click', closePopup);
        overlay.addEventListener('click', overlayClick);
        document.addEventListener('keydown', keydownHandler);

        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';

        const images = overlay.querySelectorAll('.popup-image');
        await Promise.all(
            Array.from(images).map(img =>
                img.complete ? Promise.resolve() : new Promise(resolve => {
                    img.onload = resolve;
                    img.onerror = resolve;
                })
            )
        );

        setTimeout(() => {
            overlay.style.opacity = '1';
            this.centerImagesWithCaptions();

            if (this.initialPopupSize === -1) {
                this.initialPopupSize = window.innerWidth;
            }

            if (this.innerCalcCaptionHeight() || window.innerWidth/window.innerHeight < 1) {
                this.applyStyles();
            } else {
                this.removeStyles();
            }

            this.centerImagesWithCaptions();
        }, 100);

        this.handleResize = this.debounce(() => {
            this.centerImagesWithCaptions();

            if (this.initialPopupSize === -1) {
                this.initialPopupSize = window.innerWidth;
            }

            if (window.innerWidth > this.initialPopupSize) {
                this.removeStyles();
            } else if (this.innerCalcCaptionHeight() || window.innerWidth/window.innerHeight < 1) {
                this.applyStyles();
            }
        }, 150);

        window.addEventListener('resize', this.handleResize);

        return cleanup;
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    centerImagesWithCaptions() {
        const imageWrappers = document.querySelectorAll('.image-wrapper');
        if (!imageWrappers.length) return;

        imageWrappers.forEach(wrapper => {
            const image = wrapper.querySelector('.popup-image');
            const caption = wrapper.querySelector('.caption');

            if (!image || !caption) return;

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
    }

    innerCalcCaptionHeight() {
        const imageWrappers = document.querySelectorAll('.image-wrapper');
        if (!imageWrappers.length) return false;

        return Array.from(imageWrappers).some(wrapper => {
            const image = wrapper.querySelector('.popup-image');
            const caption = wrapper.querySelector('.caption');

            if (!image || !caption) return false;

            const wrapperHeight = wrapper.offsetHeight;
            const captionHeight = caption.offsetHeight;
            const halfWrapperHeight = wrapperHeight / 2;
            const halfWrapperHeightMinusCaption = halfWrapperHeight - captionHeight;
            return halfWrapperHeightMinusCaption < 0 || image.offsetHeight > (wrapperHeight - captionHeight);
        });
    }

    applyStyles() {
        const imageContainer = document.querySelector('.image-container');
        const popup = document.querySelector('.popup');

        if (!imageContainer || !popup) return;

        imageContainer.style.flexDirection = 'column';
        imageContainer.style.maxWidth = '80%';
        imageContainer.style.margin = '0 auto';
        popup.style.overflowY = 'auto';
    }

    removeStyles() {
        const imageContainer = document.querySelector('.image-container');
        const popup = document.querySelector('.popup');

        if (!imageContainer || !popup) return;

        imageContainer.style.flexDirection = '';
        imageContainer.style.maxWidth = '';
        imageContainer.style.margin = '';
        popup.style.overflowY = '';
    }
}

export const modalSystem = new ModalSystem();