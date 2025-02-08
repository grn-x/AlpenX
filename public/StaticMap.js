document.addEventListener('DOMContentLoaded', () => {
    //console.log("Ignore the \"Uncaught TypeError: progressBar is null\" error. i have no idea how to fix it. It originates from the main.js toggle fallback function, trying to load up the script without the html");
    // i actually do know how to fix it, it is because the index.html references this script before the togglefallback method inside the main js does
    //<script type="module" src="StaticMap.js"></script>
    const modelViewer = document.querySelector('#static-map');
    const checkbox = document.querySelector('#neutral');
    const progressBar = document.querySelector('#progress-bar');
    const progressBarFill = progressBar.querySelector('div');

    window.switchSrc = (src) => {
        modelViewer.src = src;
        progressBar.style.display = 'block';
    };

    modelViewer.addEventListener('progress', (event) => {
        const progress = event.detail.totalProgress;
        progressBarFill.style.width = `${progress * 100}%`;
        if (progress === 1) {
            progressBar.style.display = 'none';
        }
    });

    checkbox.addEventListener('change', async () => {
        if (checkbox.checked) {
            const fileUrl = './geodata/objects/map/compressed_level14_zoom.glb';
            const exists = await fileExists(fileUrl);
            if (exists) {
                switchSrc(fileUrl);
            } else {
                alert('Map not yet available');
                //consume checking event and not check the box
                checkbox.checked = false;
            }
        } else {
            switchSrc('./geodata/objects/map/compressed_png_texture.glb');
        }
    });

    async function fileExists(url) {
        try {
            const response = await fetch(url, {method: 'HEAD'});
            return response.ok;
        } catch (error) {
            console.error('Error checking file existence:', error);
            return false;
        }
    }

});

