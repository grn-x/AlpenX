<!-- Sample code to test refractoring / conversion -->
export class ModalSystem {
    constructor() {
        this.initialized = false;
        this.modalHTML = null;
        this.styleSheet = null;
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

        this.initialized = true;
    }

    async openDialog() {
        await this.initialize();

        const existingModal = document.querySelector('#overlay');
        if (existingModal) {
            existingModal.remove();
        }

        document.body.insertAdjacentHTML('beforeend', this.modalHTML);

        const overlay = document.getElementById('overlay');
        const closeButton = document.getElementById('closePopup');

        const closePopup = () => {
            overlay.style.opacity = '0';
            document.body.style.overflow = 'auto';
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 300);
        };

        closeButton.addEventListener('click', closePopup);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closePopup();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closePopup();
        });

        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            overlay.style.opacity = '1';
            this.centerImagesWithCaptions();
            if (this.innerCalcCaptionHeight() || window.innerWidth/window.innerHeight < 1) {
                this.applyStyles();
            }
            this.centerImagesWithCaptions();
        }, 100);

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => this.centerImagesWithCaptions(), 0);
        });
    }

    centerImagesWithCaptions() {
        const imageWrappers = document.querySelectorAll('.image-wrapper');
        imageWrappers.forEach(wrapper => {
            const image = wrapper.querySelector('.intro-image');
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
    }

    innerCalcCaptionHeight() {
        const imageWrappers = document.querySelectorAll('.image-wrapper');
        return Array.from(imageWrappers).some(wrapper => {
            const image = wrapper.querySelector('.intro-image');
            const caption = wrapper.querySelector('.caption');
            const wrapperHeight = wrapper.offsetHeight;
            const captionHeight = caption.offsetHeight;
            const halfWrapperHeight = wrapperHeight / 2;
            const halfWrapperHeightMinusCaption = halfWrapperHeight - captionHeight;
            return halfWrapperHeightMinusCaption < 0 || image.offsetHeight > (wrapperHeight - captionHeight);
        });
    }

    applyStyles() {
        const imageContainer = document.querySelector('.image-container');
        const popup = document.querySelector('.intro');
        if (imageContainer && popup) {
            imageContainer.style.flexDirection = 'column';
            imageContainer.style.maxWidth = '80%';
            imageContainer.style.margin = '0 auto';
            popup.style.overflowY = 'auto';
        }
    }
}

export const modalSystem = new ModalSystem();