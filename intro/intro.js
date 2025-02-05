<!-- Deprecated sample code to test refractoring / conversion -->
document.addEventListener('DOMContentLoaded', () => {
    const closeButton = document.getElementById('closePopup');
    const overlay = document.getElementById('overlay');
    let initialPopupSize = -1; //this will be replaced by the current screensize the first time,
    // the resize event is triggered using this information we can determine when to scale up again.

    const centerImagesWithCaptions = () => {
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
    };

    const applyStyles = () => {

        if(initialPopupSize === -1){
            initialPopupSize = window.innerWidth;
        }

        const imageContainer = document.querySelector('.image-container');
        const imageWrappers = document.querySelectorAll('.image-wrapper');
        const popup = document.querySelector('.intro');

        /*console.log('before: ');
        console.log(imageContainer.style.flexDirection);
        console.log(imageContainer.style.maxWidth);
        console.log(imageContainer.style.margin);
        console.log(intro.style.overflowY);
        console.log('Done');*/ //are ''

        if (imageContainer && popup) {
            imageContainer.style.flexDirection = 'column';
            imageContainer.style.maxWidth = '80%';
            imageContainer.style.margin = '0 auto';
            imageWrappers.forEach(wrapper => {
                //wrapper.minHeight = '150px';
                //wrapper.padding = '5px';
            });

            popup.style.overflowY = 'auto';
        }
    };

    const removeStyles = () => {
        const imageContainer = document.querySelector('.image-container');
        const popup = document.querySelector('.intro');
        const imageWrappers = document.querySelectorAll('.image-wrapper');

        if (imageContainer && popup) {
            imageContainer.style.flexDirection = '';
            imageContainer.style.maxWidth = '';
            imageContainer.style.margin = '';
            imageWrappers.forEach(wrapper => {
                //wrapper.minHeight = '0';
                //wrapper.padding = '2.5rem';
            });
            popup.style.overflowY = '';
        }
    };
    const innerCalcCaptionHeight = () => {
        /*const imageWrappers = document.querySelectorAll('.image-wrapper');
        imageWrappers.forEach(wrapper => { //wtf you dont support premature return statements??
            const image = wrapper.querySelector('.intro-image');
            const caption = wrapper.querySelector('.caption');
            const wrapperHeight = wrapper.offsetHeight;
            const captionHeight = caption.offsetHeight;
            const halfWrapperHeight = wrapperHeight / 2;
            const halfWrapperHeightMinusCaption = halfWrapperHeight - captionHeight;
            if (halfWrapperHeightMinusCaption < 0 || image.offsetHeight > (wrapperHeight - captionHeight)) {
                console.log('downscale');
                return true;
            }
            //downscale
            //caption.style.fontSize = '0.8em';
        });
        return false;*/

        const imageWrappers = document.querySelectorAll('.image-wrapper');
        return Array.from(imageWrappers).some(wrapper => {
            const image = wrapper.querySelector('.intro-image');
            const caption = wrapper.querySelector('.caption');
            const wrapperHeight = wrapper.offsetHeight;
            const captionHeight = caption.offsetHeight;
            const halfWrapperHeight = wrapperHeight / 2;
            const halfWrapperHeightMinusCaption = halfWrapperHeight - captionHeight;
            if (halfWrapperHeightMinusCaption < 0 || image.offsetHeight > (wrapperHeight - captionHeight)) {
                return true;
            }
            return false;
        });
    };

    /*openButton.addEventListener('click', () => {
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';

        // is wait really necessary?
        setTimeout(() => {
            overlay.style.opacity = '1';
            centerImagesWithCaptions();
            if(innerCalcCaptionHeight()||window.innerWidth/window.innerHeight<1)applyStyles(); //this will set ``initialPopupSize`` to a wrong value
            //innerCalcCaptions somehow wont trigger on mobiles where the actual pixel density is the same, but the
            //aspect ratio is different, this causes all sorts of troubles and im so sick of having to do dirty css js workarounds
            //because im too incompetent to do write proper css what a disease
            centerImagesWithCaptions();

        }, 100);
    });*/

    const open = () => {
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';

        setTimeout(() => {
            overlay.style.opacity = '1';
            centerImagesWithCaptions();
            if(innerCalcCaptionHeight()||window.innerWidth/window.innerHeight<1)applyStyles(); //this will set ``initialPopupSize`` to a wrong value
            //innerCalcCaptions somehow wont trigger on mobiles where the actual pixel density is the same, but the
            //aspect ratio is different, this causes all sorts of troubles and im so sick of having to do dirty css js workarounds
            //because im too incompetent to do write proper css what a disease
            centerImagesWithCaptions();
        }, 100);
    }

    let resizeTimeout; //TODO fix resizing
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(centerImagesWithCaptions, 0);
        //implement the css media query here because if fucking hate what
        //this layout garbage ive created has become
        // if caption height is greater than 1/2*(wrapperheight-captionheight)
        // downscale

        //if (window.innerWidth > (initialPopupSize === -1 ? (innerCalcCaptionHeight() && -1) : initialPopupSize)) {
        if(window.innerWidth > initialPopupSize){
            if(initialPopupSize === -1){
                //initialPopupSize = window.innerWidth;
                if(innerCalcCaptionHeight())applyStyles();
            }
            removeStyles();
        } else if (innerCalcCaptionHeight()) {
            applyStyles();
        }
        //somewhen reset intialPopupSize back to -1 because initialPopupsize

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
        if (e.key === 'Enter') {
            open();
        }
    });
    open();
});