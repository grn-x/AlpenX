// Light Gallery Token: lightGallery: 0000-0000-000-0000 license key is not valid for production use lightgallery.min.js:8:16041
// Even though non commercial and open source use is permitted without a license key, the warning is still displayed

//TODO:
// - fix this this horrible filename that somehow slipped through 20240710_191430000_iOS 1.jpg
// - column overlapping masonry layout?
// - fix masonry picture ordering manually?
// - refractor and clean up this mess of a code


//------------------- ##START## Entry Point / Main Execution Block -------------------

import { modalSystem } from './intro.js';
let cleanup;
if (cleanup) cleanup();

String.prototype.hashCode = function() { // wow this is pretty neat, thanks js and https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
    var hash = 0,
        i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
        chr = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

document.addEventListener('DOMContentLoaded', () => {
    const correctHash = 675608460;
    const overlay = document.getElementById('lockOverlay');
    const passwordInput = document.getElementById('passwordInput');
    const submitButton = document.getElementById('submitPassword');
    const errorMessage = document.getElementById('errorMessage');
    let anonymousRemoveCallback;

    const initialStyles = {
        position: 'fixed',
        left: '0',
        top: '0',
        width: '50%',
        height: '100%',
        zIndex: '1000',
        display: 'flex',
        filter: 'blur(10px)',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 0.3s',
    };

    function restoreOverlay(cause = null) {
        Object.entries(initialStyles).forEach(([prop, value]) => {
            overlay.style[prop] = value;
        });
        location.reload();
    }


    function manualStyleManipulation(){
        if (testStyles()) {
            restoreOverlay();
        }
    }


    function testStyles() {
        const computedStyle = window.getComputedStyle(overlay);

        if (computedStyle.position !== 'fixed') {
            return true;
        }
        if (computedStyle.left.replaceAll('px', '') !== '0') {
            return true;
        }
        if (computedStyle.top.replaceAll('px', '') !== '0') {
            return true;
        }
        if (computedStyle.width !== '50%') {
            //calculate absolute value of 50% of the viewport width
            //then compare it to the computed value with some margin of error
            if(Math.abs(parseFloat(computedStyle.width) - window.innerWidth * 0.5) > 10) {
                return true;
            }
        }
        if (computedStyle.height !== '100%') {
            if(Math.abs(parseFloat(computedStyle.height) - window.innerHeight) > 10) {
                return true;
            }
        }


        if (computedStyle.zIndex !== '1000') {
            return true;
        }
        if (computedStyle.display !== 'flex') {
            return true;
        }
        if (computedStyle.justifyContent !== 'center') {
            return true;
        }
        if (computedStyle.alignItems !== 'center') {
            return true;
        }
        /*if (computedStyle.transition !== 'all 0.3s ease') {
            console.warn(computedStyle.transition);
            return true;
        }*/

        if(computedStyle.overflow !== 'hidden'){
            return true;
        }
        return false;
    }


    function anonymousCallbackFactory(refreshIntervalID){
        return (inputHash)=>{
            if(inputHash === correctHash)clearInterval(refreshIntervalID);
        };
    }

    anonymousRemoveCallback = anonymousCallbackFactory(setInterval(manualStyleManipulation,1000));



    function checkPassword() {
        const inputHash = passwordInput.value.hashCode();
        if (inputHash === correctHash) {
            anonymousRemoveCallback(inputHash);
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 300);
            sessionStorage.setItem('contentUnlocked', passwordInput.value);
            errorMessage.style.display = 'none';
            passwordInput.classList.remove('incorrect');
        } else {
            errorMessage.style.display = 'block';
            passwordInput.value = '';
            passwordInput.focus();
            passwordInput.classList.add('incorrect');
        }
    }

    const token = parseInt(sessionStorage.getItem('contentUnlocked').hashCode())
    if ( token === correctHash) {
        anonymousRemoveCallback(token);
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 300);
        errorMessage.style.display = 'none';
        passwordInput.classList.remove('incorrect');
    }else{
        //what happened here? password changed in the meantime?
    }

    submitButton.addEventListener('click', checkPassword);
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkPassword();
        }
    });
});


cleanup = await modalSystem.openDialog(); //()=>{//.then(()=>{





let innterHTMLcontent = ''; //else this creates an undefined element in the document
let gallery_instance;
let loadDivsPromiseResolve;
const loadDivsPromise = new Promise((resolve) => {
    loadDivsPromiseResolve = resolve;
});

let name_coordinate_mapping;
let name_order_mapping;
let viewer;
const polylines = [];
const promises = [];
let initialPromiseResolve;
let mapPin;
let callable;

const shouldSort = false;       //used to be global variables, though through adding identical parameters
const devAddPictures = false;   //to the affected functions, they are scoped and overriden anyways
let isFallbackLoaded = false;


let mapButton;
function domContentLoadedCallback() {
    mapButton = document.createElement('button');
    mapButton.textContent = 'Switch to Static Map';
    mapButton.style.position = 'absolute';
    mapButton.style.top = '10px';
    mapButton.style.left = '10px';
    document.body.appendChild(mapButton);

    mapButton.addEventListener('click', () => {
        toggleFallbackContent(mapButton);
    });
}
const referenceTablePath = 'geodata\\imgsource\\final_sorted.txt';
[name_coordinate_mapping, name_order_mapping] = await loadReferenceTables(referenceTablePath); //.then

loadImages(name_order_mapping);


// -- LightGallery --

document.addEventListener('DOMContentLoaded', initializeGallery());
document.addEventListener('DOMContentLoaded', domContentLoadedCallback());
// -- CesiumJS --
try {
    cesiumSetup();//inner async loadReferenceTables() call
}catch (e) {
    console.error('The Cesium Setup method returned an error, switching to fallback mode');
    alert('The Cesium Setup method returned an error, switching to fallback mode\n' + e);
    toggleFallbackContent(mapButton);
}
// -- ChartJS --
initializeChart(); // async function, because it relies on await getPolyLines() to get height profile for chart data


// Add Cesium OSM Buildings, a global 3D buildings layer.
Cesium.createOsmBuildingsAsync().then(buildingTileset => {
    viewer.scene.primitives.add(buildingTileset);
});

/*
viewer.camera.changed.addEventListener(() => {
    //updateRedBoxPosition();
});


window.onload = () => {
    //changeBackpackPositionOverTime();
};*/

//------------------- ##END## Entry Point / Main Execution Block -------------------


function loadReferenceTables(referenceTablePath) {
    let name_coordinate_map = new Map();
    let name_index_map = new Map(); //this could be passed to the sort function before adding the billboards
                            // and instantiating the lightgallery, but its more efficient to have the lookup table preordered
    return fetch(referenceTablePath)
        .then(response => response.text())
        .then(text => {
            let counter = 0;
            const lines = text.split('\n'); // example: IMG-20240709-WA0036.jpg;4271311.463420066 784591.8384901393 4658090.60018335;from Website
            for (const line of lines) {
                if (line.startsWith('//')) continue;
                const [key, valueString, altText] = line.split(';');
                if (valueString) {
                    const [x, y, z] = valueString.split(' ').map(parseFloat);
                    const value = new Cesium.Cartesian3(x, y, z);
                    name_coordinate_map.set(key, value);
                    name_index_map.set(key, counter++);
                    constructHTMLdivs(key, valueString, altText);
                } else {
                    console.warn('Invalid line format:', line);
                }
            }
            loadHTMLdivs(); // async function, because it relies on await loadReferenceTables(), thus making use of the load


            return [name_coordinate_map, name_index_map];
        });
}


//----------- Masonry Layout Overview -----------
/** Load images into the masonry layout, the images are sorted by the order they appear in the reference table in
 * @param map a map that doesnt associate the image name with the location or author but rather the index assuming correct order*/
function loadImages(map) {

    const masonry_images = [
        ['20240707_101042000_iOS 2.jpg', 'Tag 0 <br> Bahnhof Bamberg'],
        ['20240707_191117000_iOS.jpg', 'Tag 0 <br> Jugendherberge Oberstdorf-Kornau'],
        ['20240708_082738-Benedikt.jpg', 'Tag 1 <br> Start Spielmannsau'],
        ['20240708_132056-Benedikt.jpg', 'Tag 1 <br> Abstieg nach Holzgau'],
        ['20240708_195554000_iOS.jpg', 'Tag 1 <br> Hanssens Wasserfall'],
        ['20240708_145905000_iOS.jpg', 'Tag 1 <br> Holzgau Hängebrücke'],
        ['20240709_110555-Benedikt.jpg', 'Tag 2 <br> Pfad durch Blumenfeld'],
        ['20240709_093154610_iOS.jpg', 'Tag 2 <br> Langzeitbelichtung Gletscherbach'],
        ['20240709_093146000_iOS.jpg', 'Tag 2 <br> Gletscherbachquerung zur Kemptner Hütte'],
        ['20240709_100734000_iOS.jpg', 'Tag 2 <br> Rast vor Aufstieg zum Flarschjoch'],
        ['20240709_164623-Benedikt.jpg', 'Tag 2 <br> Freiwilliger Aufstieg zur Samspitze'],
        ['20240709_183857000_iOS.jpg', 'Tag 2 <br> Abendlicher Ausblick auf Arlbergregion'],
        ['20240710_191430000_iOS 1.jpg', 'Tag 3 <br> Abstieg nach Schnann'],
        ['20240710_085919-Benedikt.jpg', 'Tag 3 <br> Abstieg neben Schannerbach'],
        ['20240710_072631000_iOS.jpg', 'Tag 3 <br> Schnanner Klamm'],
        ['20240710_130012000_iOS.jpg', 'Tag 3 <br> Aussichtsplattform Adlerhorst im Piztal'],
        ['20240711_102048-Benedikt.jpg', 'Tag 4 <br> Aufstieg zur Braunschweiger Hütte'],
        ['20240711_120408-Benedikt.jpg', 'Tag 4 <br> Aufstieg zur Braunschweiger Hütte'],
        ['20240711_100426000_iOS.jpg', 'Tag 4 <br> Aufstieg zur Braunschweiger Hütte'],
        ['20240711_121302000_iOS.jpg', 'Tag 4 <br> Gletscherteich hinter Braunschweiger Hütte'],
        ['20240712_065157-Benedikt.jpg', 'Tag 5 <br> Rückblick auf Braunschweiger Hütte'],
        ['20240712_071405-Benedikt.jpg', 'Tag 5 <br> Aufstieg zu Pitztaler Jöchl'],
        ['20240712_072239-Benedikt.jpg', 'Tag 5 <br> Aufstieg zu Pitztaler Jöchl'],
        ['20240712_105708-Benedikt.jpg', 'Tag 5 <br> Panoramaroute; Ausblick verdeckt durch Regendunst'],
        ['20240712_112410-Benedikt.jpg', 'Tag 5 <br> Blick auf Herberge in Vent'],
        ['DSC09874.jpg', 'Tag 6 <br> Rückblick auf Vent'],
        ['DSC09884.jpg', 'Tag 6 <br> Erste Rast auf Weg nach Meran'],
        ['DSC09916.jpg', 'Tag 6 <br> Weg nach Meran'],
        ['DSC09949.jpg', 'Tag 6 <br> Aufstieg zu Similaun Hütte'],
        ['DSC09973.jpg', 'Tag 6 <br> Ankunft auf der Similaun Hütte'],
        ['DSC09986.jpg', 'Tag 6 <br> Pizza Essen in Meran']
    ].map(([filename, name]) => [filename, name, map.get(filename) || 0]);

    masonry_images.sort((a, b) => a[2] - b[2]);


    const image_path = 'geodata/imgsource/combined-thumbnail/1024/';
    const row = document.querySelector('.row');
    const cols = 4;
    const colsCollection = {};

    for (let i = 1; i <= cols; i++) {
        colsCollection[`col${i}`] = document.createElement('div');
        colsCollection[`col${i}`].classList.add('column');
    }

    for (let i = 0; i < masonry_images.length; i++) {
        const itemContainer = document.createElement('div');
        itemContainer.classList.add('item');
        const item = document.createElement('img');
        item.src = `${image_path}${masonry_images[i][0]}`;
        itemContainer.appendChild(item);

        const hoverText = document.createElement('div');
        hoverText.classList.add('hover-text');
        hoverText.innerHTML = masonry_images[i][1];
        itemContainer.appendChild(hoverText);

        itemContainer.addEventListener('click', () => {
            //console.log('Image Name: ', images[i]);
            changeSlide(masonry_images[i][2]);
        });

        colsCollection[`col${(i % cols) + 1}`].appendChild(itemContainer);
    }

    Object.values(colsCollection).forEach(column => {
        row.appendChild(column);
    });

}


//-------------------- LightGallery --------------------

/**
 * Constructs HTML anchor elements with embedded image tags for a gallery and appends them to the global `innterHTMLcontent` string.
 *
 * This function is used to create HTML anchor elements that link to full-sized images and contain thumbnail images.
 * The constructed HTML string is appended to the global `innterHTMLcontent` variable.
 *
 * @param {string} filename - The name of the image file.
 * @param {string} location - The location coordinates of the image.
 * @param {string} altText - The alternative text for the image.
 * @param {string} [thumbnailPath='geodata/imgsource/combined-thumbnail'] - The path to the thumbnail images.
 * @param {string} [imagePath='geodata/imgsource/combined'] - The path to the full-sized images.
 *
 * @see {@link loadReferenceTables} - This function calls `constructHTMLdivs` to create HTML elements for each image in the reference table.
 * <br>
 * @see {@link loadHTMLdivs} - The resulting HTML string is used by this function to populate the gallery element in the DOM.
 */

function constructHTMLdivs(filename, location, altText, thumbnailPath = 'geodata/imgsource/combined-thumbnail', imagePath = 'geodata/imgsource/combined') {
    const elementString = `
        <a href="${imagePath}/${filename}" data-src="${imagePath}/${filename}" class="gallery-item" data-location="${location} custom-tag"tag">
        <img src="${thumbnailPath}/thumbnail_${filename}" alt="${altText}" loading="lazy" data-src="${imagePath}/${filename}" class="lg-lazy-thumb" />
        </a>
        `;

    innterHTMLcontent += elementString;
}

/** Append the constructed picture divs string into the lightgallery element, this method manages the timing(the dom structure does not exist
 * upon immediate page load) and ensures through the globally defined promise, that other methods depending on the pictures
 * (like the lightgallery instantiation) get triggered at the correct time
 * this is called by {@link loadReferenceTables} because {@link constructHTMLdivs} needs to complete
 * its cycle beforehand */
//is async necessary? it shouldnt at least
function loadHTMLdivs(galleryHTMLelement = document.getElementById('lightgallery')) {
    const addElement = () => {
        galleryHTMLelement.innerHTML = innterHTMLcontent;
        loadDivsPromiseResolve(); // Resolve the promise when loadHTMLdivs is completed

    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addElement);
    } else {
        addElement();

    }
}

/**
 * Initializes the LightGallery instance and sets up event listeners for gallery interactions.
 *
 * This function schedules the initialization of LightGallery once the `loadDivsPromise` is resolved.
 * It configures the gallery with various options such as zoom, autoplay, and thumbnail display.
 * Event listeners are added to handle gallery resize and slide change events.
 *
 * @see loadDivsPromise - The promise that resolves when the HTML divs are loaded.
 * @see moveCesiumFigure - Function to move the Cesium figure based on the current slide index.
 */
function initializeGallery() {
    loadDivsPromise.then(() => {
        console.log('promise resolved');
        const gallery = document.getElementById('lightgallery');

        gallery_instance = lightGallery(gallery, {
            container: document.getElementById('galleryContainer'),
            download: false,
            controls: true,
            mousewheel: true,
            preload: 2,
            resetScrollPosition: false,
            showMaximizeIcon: true,
            plugins: [lgZoom, lgThumbnail, lgAutoplay, lgHash],
            thumbnail: true,
            //zoom: true,
            zoomPluginStrings: {
                zoomIn: 'Zoom in',
                zoomOut: 'Zoom out',
                actualSize: 'Actual size'
            },
            zoom: {
                enable: true,
                scale: 1.5,
                zoomFromOrigin: true // Does not seem to work //rtfm

            },
            autoplay: true,
            autoplayControls: true,
            slideShowInterval: 3000,
            progressBar: true
        });

        gallery.addEventListener('lgContainerResize', (event) => {
            //changeSlide(1);

            //moveCesiumFigure(index); //lookup table in between to interpolate between the points and the index?
        });

        gallery.addEventListener('lgAfterSlide', (event) => {
            const {index, prevIndex} = event.detail;


            moveCesiumFigure(index); //lookup table in between to interpolate between the points and the index?

        });
    });

}

/**
 * Changes the current slide in the LightGallery instance to the specified index.
 *
 * This method acts as an interface between the LightGallery instance and
 * the CesiumJS viewer, and the masonry layout (add graph later).
 *
 * @param {number} index - The index of the slide to change to.
 *
 * @see {@link loadImages} - places a click event on the masonry layout images to call this function.
 * @see {@link initializeBillboards} - places a click event on the CesiumJS billboards to call this function.
 */
function changeSlide(index) {
    //gallery_instance.goToSlide(index); ??
    if (gallery_instance) {
        if (true) {
            gallery_instance.openGallery(index);//goToNextSlide(); //goToPreviusSlide(); //closeGallery();
        }
        gallery_instance.slide(index);
    } else {
        console.log('Gallery instance is not initialized.');
    }
}


//-------------------- CesiumJS --------------------

//defined global variables:
//let viewer;
//let mapPin;
//let polylines;
//let callable;

//let viewer
//const shouldSOrt
//let map
//const polylines
//let initialPromiseResolve
//let mapPin
//let callable
//await because of poylines, which are kinda fucked up with the cesium backend; route adding promises are not awaited
// -> so the polylines you somehow have to await the promises, to get all polylines, which are also needed here when sorting later on, what a chaos

/**
 * Sets up the CesiumJS viewer with various configurations and loads GeoJSON data sources for the gpx path.
 *
 * This function sets up event listeners for user interactions and
 * handles the sorting of map keys if necessary/stated and the initialization of billboards.
 *
 * @param {boolean} [shouldSort=false] - Indicates whether the map keys should be sorted. This was used in testing,
 * but is not necessary for the final version, after some refractors, the original system of sorting the map keys,
 * then printing them, to parse them into a lookuptable is not required anymore
 * @param {boolean} [devAddPictures=false] - Indicates whether to enable developer mode for adding pictures,
 * which allows the user to add pictures to the map by clicking on the path. From there, Red cones would be placed to indicate
 * the selected positon, the cartesian 3 coordinates are automatically copied to the clipboard for the python mapping script to
 * access those. Billboard click events would subsqeuntly be ignored
 *
 * This method is called from the main execution block of the application to set up the CesiumJS viewer and asynchronously load the dependent data.
 * It ensures that the viewer is properly configured and that the GeoJSON data sources are loaded and displayed.
 *
 * @see {@link initializeBillboards} - This function is called to initialize the billboards after the GeoJSON data sources are loaded.
 */
async function cesiumSetup(shouldSort = false, devAddPictures = false) {
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyZWIyNDVmYS1lZGMwLTRjNzgtOGUwYi05MDI3Y2I5NjhiYjkiLCJpZCI6MjU1Njg5LCJpYXQiOjE3MzE3MTE5NDZ9.fgtGlj3eBn2atRqSMgEKuQTbTtm4Pg3aIpkbyFuAu8o'; // this feels horrible, but i dont have a proxy so there is no solution anyways
    try {
        viewer = new Cesium.Viewer('cesiumContainer', {
        terrain: Cesium.Terrain.fromWorldTerrain(),
        homeButton: false,
        sceneModePicker: false,
        baseLayerPicker: true,
        navigationHelpButton: false,
        animation: false,
        timeline: false,
        fullscreenButton: false,
        vrButton: false,
        geocoder: true,
        infoBox: false,
        selectionIndicator: false,
    });
    viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);


    const files = new Map([
        ['geodata/geoJson/Day0-0-BusToYH.geojson', ['day0', Cesium.Color.DARKRED, 0]],
        ['geodata/geoJson/Day0-1-WalkToYH.geojson', ['day0', Cesium.Color.CRIMSON, 1]],
        ['geodata/geoJson/Day1-0-WalkToBus.geojson', ['day1', Cesium.Color.TEAL, 2]],
        ['geodata/geoJson/Day1-1-BusToStart.geojson', ['day1', Cesium.Color.STEELBLUE, 3]],
        ['geodata/geoJson/Day1-2-Main.geojson', ['day1', Cesium.Color.TEAL, 4]],
        ['geodata/geoJson/Day2-0-WalkToBus.geojson', ['day2', Cesium.Color.MEDIUMORCHID, 5]],
        ['geodata/geoJson/Day2-1-BusToStart.geojson', ['day2', Cesium.Color.MAGENTA, 6]],
        ['geodata/geoJson/Day2-2-Main.geojson', ['day2', Cesium.Color.MEDIUMORCHID, 7]],
        ['geodata/geoJson/Day3-0-WalkToBus.geojson', ['day3', Cesium.Color.YELLOW, 8]],
        ['geodata/geoJson/Day3-1-BusToTrain.geojson', ['day3', Cesium.Color.GOLD, 9]],
        ['geodata/geoJson/Day3-2-WalkToStore.geojson', ['day3', Cesium.Color.YELLOW, 10]],
        ['geodata/geoJson/Day3-3-TrainToStart.geojson', ['day3', Cesium.Color.GOLDENROD, 11]],
        ['geodata/geoJson/Day3-4-Main.geojson', ['day3', Cesium.Color.YELLOW, 12]],
        ['geodata/geoJson/Day4-0-BusToStore.geojson', ['day4', Cesium.Color.DARKBLUE, 13]],
        ['geodata/geoJson/Day4-1-WalkToStore.geojson', ['day4', Cesium.Color.INDIGO, 14]],
        ['geodata/geoJson/Day4-2-BusToStart.geojson', ['day4', Cesium.Color.DARKBLUE, 15]],
        ['geodata/geoJson/Day4-3-Main.geojson', ['day4', Cesium.Color.INDIGO, 16]],
        ['geodata/geoJson/Day5-0-WalkToBus.geojson', ['day5', Cesium.Color.DARKGREEN, 17]],
        ['geodata/geoJson/Day5-1-BusToStart.geojson', ['day5', Cesium.Color.DARKOLIVEGREEN, 18]],
        ['geodata/geoJson/Day5-2-Main.geojson', ['day5', Cesium.Color.DARKGREEN, 19]],
        ['geodata/geoJson/Day6-0-Main.geojson', ['day6', Cesium.Color.CRIMSON, 20]],
        ['geodata/geoJson/Day7-0-BusToMerano.geojson', ['day7', Cesium.Color.MAROON, 21]],
        ['geodata/geoJson/Day7-1-Pizza.geojson', ['day7', Cesium.Color.FIREBRICK, 22]],
    ]);

    //see at top
    //let map;
    //let mapPin;
    //const polylines = [];
    //const promises = [];
    //let callable;

// Initial promise to ensure the promises array is not empty and the await call works as expected/doesnt skip the whole forloop
    //let initialPromiseResolve;
    const initialPromise = new Promise((resolve) => {
        initialPromiseResolve = resolve;
    });
    promises.push(initialPromise);


    files.forEach((value, key) => {
        const promise = Cesium.GeoJsonDataSource.load(key, {
            clampToGround: true,
            stroke: value[1],
            strokeWidth: 10
        }).then(dataSource => {
            viewer.dataSources.add(dataSource);
            if (!mapPin) {
                mapPin = initializePin(viewer, dataSource.entities.values[0].polyline.positions.getValue(Cesium.JulianDate.now())[0]);
                viewer.flyTo(mapPin);
                //viewer.zoomTo(mapPin); //changing this has absolutely no performance benefits and looks worse
            }


            //polylines.push(dataSource.entities.values[dataSource.entities.values.length-1].polyline.positions.getValue(Cesium.JulianDate.now())); //async shuffles order of polylines on deployment?
            //polylines[counter++] = dataSource.entities.values[dataSource.entities.values.length - 1].polyline.positions.getValue(Cesium.JulianDate.now());
            polylines[value[2]] = dataSource.entities.values[dataSource.entities.values.length - 1].polyline.positions.getValue(Cesium.JulianDate.now());


        });
        promises.push(promise);
        if (initialPromiseResolve) {
            initialPromiseResolve();
            initialPromiseResolve = null;
        }

    });


    if (devAddPictures) {

        viewer.screenSpaceEventHandler.setInputAction(function (click) {
            const pickedObject = viewer.scene.pick(click.position);
            if (Cesium.defined(pickedObject) && pickedObject.id && pickedObject.id.polyline) {
                const cartesian = viewer.scene.pickPosition(click.position);
                if (Cesium.defined(cartesian)) {
                    const intersect = findNearestPointOnSegments(returnNearestPoints(pickedObject.id.polyline.positions.getValue(Cesium.JulianDate.now()), cartesian), cartesian);
                    if (intersect && Cesium.defined(intersect) && intersect.x && intersect.y && intersect.z) {
                        const redCone = viewer.entities.add({
                            position: intersect,
                            orientation: Cesium.Transforms.headingPitchRollQuaternion(
                                intersect,
                                new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(0), Cesium.Math.toRadians(0), Cesium.Math.toRadians(0))
                            ),
                            cylinder: {
                                length: 400,
                                topRadius: 2.0,
                                bottomRadius: 20.0,
                                material: Cesium.Color.RED,
                            },
                            clampToGround: true
                        });
                        //writeToClipboard(`{x: ${intersect.x}, y: ${intersect.y}, z: ${intersect.z}}`);// these are cartesians right?
                        writeToClipboard(`${intersect.x} ${intersect.y} ${intersect.z}`);
                        setTimeout(() => {
                            viewer.entities.remove(redCone);
                        }, 2000);
                    } else {
                        console.error('intersect: ', intersect, ' at clicked point: ', cartesian, '\nNo intersection found! Probably too close to different geojson segment!'); //TODO Fix this

                    }
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    if (shouldSort) {

        console.log('Sorting map by keys'); //wont get triggered in prod
        name_coordinate_mapping.forEach((value, key) => {
            //console.log('http://127.0.0.1:8080/geodata/imgsource/combined/' + key +'\n'+ value);
        });
        const sortedKeys = sortMapKeys(name_coordinate_mapping, viewer, await getPolyLines(true));

        name_coordinate_mapping = sortMapByKeys(name_coordinate_mapping, sortedKeys);
        let mapString = '';
        name_coordinate_mapping.forEach((value, key) => {
            console.log('http://127.0.0.1:8080/geodata/imgsource/combined/' + key + '\n' + value);//wont get triggered in prod

            mapString += `${key};${value}\n`;
        });

        await writeToClipboard(mapString);
    }

    initializeBillboards(name_coordinate_mapping, 'geodata/imgsource/combined-thumbnail', !devAddPictures);
    } catch (e) {
        console.error('CesiumJS failed to initialize, switching to fallback mode');
        alert('CesiumJS failed to initialize, switching to fallback mode\n' + e);
        toggleFallbackContent();
    }

}
/**
 * Retrieves and optionally flattens the polylines from the CesiumJS viewer. Acts as an interface for synchronous access to the asynchronous data loading process.
 *
 * This function waits for all promises in the `promises` array to resolve, which ensures that all GeoJSON data sources are loaded.
 * It then returns the polylines, either as a flat array or a nested array, depending on the `flat` parameter.
 * The duration of the await call is logged to the console.
 *
 * @param {boolean} [flat=true] - If true, the returned polylines array will be flattened.
 *
 * This method is called from various parts of the application where polylines data is required, such as:
 * - {@link initializeChart} - Uses the polylines data to generate the height profile for the chart.
 * - {@link sortMapKeys} - Uses the polylines data to sort the map keys based on their positions.
 * - {@link cesiumSetup} - Ensures that all polylines are loaded before proceeding with further setup.
 *
 * @returns {Promise<Array>} A promise that resolves to an array of polylines, either flattened or nested.
 */
async function getPolyLines(flat = true) {
    const start = performance.now();
    //console.log('Getting polylines: ' + polylines);
    await Promise.all(promises);
    const end = performance.now();
    //console.log('Polylines: ' + polylines);

    const duration = (end - start)
    console.log(`Await call took: ${duration} millis`);

    if (flat) {
        return polylines.flat();
    } else {
        return polylines;
    }
}




/**
 * Sorts the keys of a map based on the number of previous points in a Cartesian array.
 *
 * This function sorts the keys of the provided map by calculating the number of previous points for each value
 * in the Cartesian array. The sorted map is returned with keys ordered by their calculated values. {@link getNumPreviousPoints}
 *
 * This methods result can be combined with this methods map parameter and piped into {@link sortMapByKeys} to sort the map
 *
 * @param {Map} map - The map to be sorted, where keys are image filenames and values are their corresponding Cartesian coordinates.
 * @param {Cesium.Viewer} viewer - The CesiumJS viewer instance used to retrieve the Cartesian arrays.
 * Deprecated because it didnt work, this was the reason to add the getPolyLines() function
 * @param {Array} [cartArray=getPolyLines(true)] - The Cartesian array of polylines used for sorting. {@link getPolyLines}
 *
 * This method is called from:
 * - {@link cesiumSetup} - Was used during development and called if the sort flag was set to true.
 * Back then it wasnt possible to sort and initialize the billboards in one go.
 * Now after some refractoring sessions it should be, though it isnt used anymore, because the lookuptable is preordered
 *
 *
 * @returns {Map} A new map with keys sorted based on the number of previous points in the Cartesian array.
 */
function sortMapKeys(map, viewer, cartArray) {
    console.log('Sorting map by keys'); //wont get triggered in prod
    const sortedMap = new Map();

    map.forEach((value, key) => {
        sortedMap.set(key, getNumPreviousPoints(value, cartArray));
    });

    return new Map([...sortedMap.entries()].sort((a, b) => a[1] - b[1]));
    ;


}

/**
 * Sorts a map based on a provided array of sorted keys.
 *
 * This function creates a new map with keys ordered according to the provided sorted keys array.
 * A possible parameter for the sorted keys array is the result of {@link sortMapKeys}.
 * @param {Map} map - The original map to be sorted.
 * @param {Array} sortedKeys - The array of sorted keys used to order the map.
 *
 * This method is called from:
 * - {@link cesiumSetup} - Ensures that the map keys are sorted before initializing billboards.
 *
 *
 * @returns {Map} A new map with keys sorted according to the provided sorted keys array.
 */
function sortMapByKeys(map, sortedKeys) {
    const sortedMap = new Map();
    sortedKeys.forEach((value, key) => {
        if (map.has(key)) {
            sortedMap.set(key, map.get(key));
        }
    });
    return sortedMap;
}
/**
 * Calculates the number of previous points in a Cartesian array relative to a given position.
 *
 * This function finds the nearest point to the given position in the Cartesian array and returns its index.
 * The index represents the number of previous points in the array relative to the given position.
 *
 * @param {Cesium.Cartesian3} pos - The position to find the nearest point to.
 * @param {Array<Cesium.Cartesian3>} cartesianArray - The array of Cartesian points to search within.
 *
 * This method is called from:
 * - {@link sortMapKeys} - Uses this function to determine the number of previous points for each value in the map.
 *
 * The result is used to:
 * - Sort the keys of a map based on their positions in the Cartesian array.
 *
 * @returns {number} The index of the nearest point in the Cartesian array, representing the number of previous points.
 */
function getNumPreviousPoints(pos, cartesianArray) {
    const key = returnNearestPoints(cartesianArray, pos)[1];
    return cartesianArray.indexOf(key);
}

/**
 * @deprecated Used to retrieve polylines loaded as datasources into the viewer, but didnt work,
 * functionality replaced by async {@link getPolyLines}
 * */
function getPolylinesAsCartesianArrays(viewer, fuse = false) {
    console.log('Getting polylines as cartesian arrays'); //wont get triggered in prod
    const polylines = [];

    viewer.entities.values.forEach(entity => {
        if (entity.polyline && entity.polyline.positions) {
            const positions = entity.polyline.positions.getValue(Cesium.JulianDate.now());
            polylines.push(positions);
        }
    });

    if (fuse) {
        return polylines.flat();
    } else {
        return polylines;
    }
}

/**
 * Initializes billboards on the CesiumJS viewer based on the provided map of Cartesian coordinates.
 *
 * This function adds billboards to the CesiumJS viewer for each entry in the provided map. Each billboard is positioned
 * at the corresponding Cartesian coordinates and displays an image. Optionally, click events can be added to the billboards
 * to trigger slide changes in the gallery, by calling the interfacing method {@link changeSlide}.
 *
 * @param {Map} map - A map where keys are image filenames and values are their corresponding Cartesian coordinates.
 * @param {string} [prePath='/geodata/imgsource/combined-thumbnail'] - The path to the thumbnail images.
 * @param {boolean} [addClickEvent=true] - If true, click events are added to the billboards to change slides in the gallery
 * using {@link changeSlide} this flag is needed during development to switch between adding pictures or retrieving
 * cartesian coordinates for future billboards. It is probably dependent on the global variable `devAddPictures`
 * set in the main exectuin block and passed through the {@link cesiumSetup} function.
 *
 * This method sets the variable `callable` to a function that can be called to trigger the hover effect on the toolbar buttons.
 * The reference of which is used in {@link moveCesiumFigure} to trigger the hover effect on the track map button if its
 * out of view.
 *
 * This method is called from:
 * - {@link cesiumSetup} - Ensures that the billboards are initialized after the CesiumJS viewer is set up.
 *
 * The result is used to:
 * - Display billboards on the CesiumJS viewer at specified positions.
 * - Enable interaction with the billboards to change slides in the gallery.
 */
function initializeBillboards(map, prePath = '/geodata/imgsource/combined-thumbnail', addClickEvent = true) {
    //throw new Error('Test fallback mode');
    const billboards = [];

    map.forEach((value, key) => {
        if (value.x && value.y && value.z) {
            const entity = viewer.entities.add({
                position: value,
                billboard: {
                    image: `${prePath}/thumbnail_${key}`,
                    width: 50,
                    height: 50,
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY, // 0,
                    //eyeOffset: new Cesium.Cartesian3(0.0, 0.0, -20.0) // cant decide on weather always visible or clipping is better
                    //scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.5) // Adjust scale based on distance
                },
                clampToGround: true,
                isBillboard: true
            });

            billboards.push(entity);

            if (addClickEvent) {
                entity.billboard.id = key; // store the key in the billboard id for reference, is there a better way?
                viewer.screenSpaceEventHandler.setInputAction(function (click) {
                    const pickedObject = viewer.scene.pick(click.position);
                    if (Cesium.defined(pickedObject) && billboards.includes(pickedObject.id)) {
                        const index = Array.from(map.keys()).indexOf(pickedObject.id);
                        const selfIndex = billboards.indexOf(pickedObject.id);
                        // console.log('Clicked on entity:', pickedObject.id, ' at index:', index, 'selfIndex:', selfIndex);
                        changeSlide(billboards.indexOf(pickedObject.id));
                    }
                }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
            }
        } else {
            console.warn('No valid cartesian coordinates found for key:', key);
        }
    });

    //distance based size rendering
    viewer.scene.preRender.addEventListener(() => {
        const cameraPosition = viewer.camera.position;
        billboards.forEach(entity => {
            const distance = Cesium.Cartesian3.distance(cameraPosition, entity.position.getValue(Cesium.JulianDate.now()));
            const scale = Math.max(0.3, 1 / (distance / 500)); // TODO: check if scale factor is sufficient
            entity.billboard.width = 50 * scale;
            entity.billboard.height = 50 * scale;
        });
    });


    //putting this into initializeBillboards and not some root function hurts a little, but i need the access to the billboards array
//and i dont wanna define it globally since it doesnt need to, and also its kind of okay to put it here idk
    const toolbar = document.querySelector("div.cesium-viewer-toolbar");
    const modeButton = document.querySelector("span.cesium-sceneModePicker-wrapper");


    // Inner Function
    function triggerHoverEffect(button, duration = 1000) {
        button.classList.add('temp-hover');
        setTimeout(() => {
            button.classList.remove('temp-hover');
        }, duration); // Adjust the duration as needed
    }

    const hideButton = document.createElement("button");
    hideButton.classList.add("cesium-button", "cesium-toolbar-button", "hide-button"); // hide-button css element
    // references     'background-image: url('geodata/objects/figure/eye.png');' Beware, still in use
    hideButton.style.position = "relative";
    hideButton.title = "Toggle Route Preview Image Visibility";

    hideButton.addEventListener("click", () => {
        if (hideButton.classList.contains('hidden')) {
            hideButton.classList.remove('hidden');
            billboards.forEach(entity => {
                entity.show = true;
            });

        } else {
            hideButton.classList.add('hidden');
            billboards.forEach(entity => {
                entity.show = false;
            });
        }
        /*billboards.forEach(entity => {
            entity.show = !entity.show;
        });*/
    });

    const trackButton = document.createElement("button");
    trackButton.classList.add("cesium-button", "cesium-toolbar-button", "track-button"); // track-button css element
    // references     'background-image: url('geodata/objects/figure/map-pin.png');' Beware, still in use
    trackButton.style.position = "relative";
    trackButton.title = "Focus the MapPin\nFollow the figure’s movement after switching the picture or choosing a height profile point";

    trackButton.addEventListener("click", () => {
        if (viewer.trackedEntity === mapPin) {
            viewer.trackedEntity = null;
            trackButton.classList.remove('tracked');

        } else {
            viewer.trackedEntity = mapPin;
            trackButton.classList.add('tracked');

            //triggerHoverEffect(hideButton);
            //triggerHoverEffect(trackButton);

        }
    });

        callable = function () { //this seems like an absolute terrible solution, but it kind of works
            // console.log('callable');
            for (let i = 0; i < 5; i++) { //implement css animation instead
                setTimeout(() => {
                    triggerHoverEffect(trackButton, 350);
                }, i * 700); // why do i have to do it this way?
            }
        }

    toolbar.insertBefore(trackButton, modeButton);
    toolbar.insertBefore(hideButton, modeButton);

}

/**
 * @deprecated probably, honestly have no idea what this was supposed to do and it isnt referenced anywhere anymore
 * TODO
 * @param map containing some value (perhaps the image name) and value containing the cartesian coordinates, which are then
 * used to place ellipsoids on the map
 */
function initializePlane(map) {
    map.forEach((value, key) => {
        console.log('Key:', key, 'Value:', value);//wont get triggered in prod

        if (value.x && value.y && value.z) {
            viewer.entities.add({
                position: value,
                ellipsoid: {
                    radii: new Cesium.Cartesian3(30, 30, 30),
                    maximumCone: Cesium.Math.PI_OVER_TWO,
                    material: Cesium.Color.WHITE.withAlpha(0.9),
                    outline: false,

                },
                clampToGround: true
            });
        } else {
            console.warn('No valid cartesian coordinates found for key:', key);
        }
    });
//zoom to the latest added entity
    //viewer.zoomTo(viewer.entities);

}

/**
 * Writes the provided text to the clipboard.
 *
 * This function attempts to write the given text to the clipboard using the Clipboard API. If the operation is successful,
 * a message is logged to the console indicating that the text was copied. If the operation fails, an error message is logged.
 *
 * @param {string} text - The text to be copied to the clipboard.
 *
 * This method is called from:
 * - {@link cesiumSetup} - Copies the sorted map data to the clipboard after sorting the map keys.
 * And from {@link cesiumSetup} when adding pictures to the map, the selected cartesian coordinates are copied to the clipboard
 *
 * The result is used to:
 * - Provide the sorted map data for further use like python scripts in which i use it to map the images to the coordinates
 * or used it to parse the html divs and the lookuptable
 *
 * @returns {Promise<void>} A promise that resolves when the text has been successfully written to the clipboard. cant remember why i did this :D
 */
async function writeToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        console.log(text, ' copied to clipboard'); //wont get triggered in prod
    } catch (err) {
        console.error('Failed to copy text: ', err);
    }
}
/**
 * Finds the nearest points in a Cartesian array relative to a given position (which is retrieved from the click event)
 * when selecting a point on the map for billboard placement.
 *
 * This function iterates over the provided positions to find the nearest point to the click position.
 * It then returns the nearest point along with (hopefully) its immediate left and right neighbors in the array.
 *
 * @param {Array<Cesium.Cartesian3>} positions - The array of Cartesian points to search within, most likely the polyline segment
 * @param {Cesium.Cartesian3} clickPosition - The position to find the nearest point to.
 *
 * This method is called from:
 * - {@link cesiumSetup} in case the `devAddPictures` flag is set, where the result is passed to {@link findNearestPointOnSegments} for further calculations.
 * - {@link getNumPreviousPoints} - Uses this function to retrieve the middle point at index 1 of the returned array,
 *          to figure out the number of previous points in the Cartesian array.
 *
 * The result is used to:
 * - Determine the nearest points for various calculations and visualizations in the CesiumJS viewer.
 *
 * @returns {Array<Cesium.Cartesian3>} An array containing the 3 closest points which hopefully are the left neighbor, nearest point, and right neighbor.
 */
function returnNearestPoints(positions, clickPosition) {
    let nearestPoint = null;
    let minDistance = Number.MAX_VALUE;

    positions.forEach(position => {
        const distance = Cesium.Cartesian3.distance(position, clickPosition);
        if (distance < minDistance) {
            minDistance = distance;
            nearestPoint = position;
        }
    });
    const left = positions[positions.indexOf(nearestPoint) - 1];
    const right = positions[positions.indexOf(nearestPoint) + 1];

    // problem, if the point to the left and the point two to the left are closer together than the point to the left and the point to the right,
    // a pair not surrounding the clicked coordinate is returned, solution:
    // return all three 😇👍 (in extreme cases the problem persists)

    // if(Cesium.Cartesian3.distance(left, clickPosition) < Cesium.Cartesian3.distance(right, clickPosition)) {
    //     return [left, nearestPoint];
    // }
    return [left, nearestPoint, right];
}
/**
 * @deprecated This function is deprecated in favor of {@link findNearestPointOnSegments}, which uses projection-based calculations for greater accuracy.
 */
function approximateNearestMidpoint(positions, clickPosition) {
    //deprecated using vector arithmetic instead
    const [left, nearestPoint, right] = positions;
    const leftToCenter = Cesium.Cartesian3.distance(left, nearestPoint);
    const leftToPoint = Cesium.Cartesian3.distance(left, clickPosition);

    const rightToCenter = Cesium.Cartesian3.distance(right, nearestPoint);
    const rightToPoint = Cesium.Cartesian3.distance(right, clickPosition);

    const leftRelative = leftToPoint / leftToCenter;
    const rightRelative = rightToPoint / rightToCenter;
    if (leftRelative < rightRelative) {
        const blackBox = viewer.entities.add({
            position: left,
            box: {
                dimensions: new Cesium.Cartesian3(40.0, 40.0, 70.0),
                material: Cesium.Color.BLACK.withAlpha(0.5),
                outline: true,
                outlineColor: Cesium.Color.WHITE,
            },
            clampToGround: true
        });
        setTimeout(() => {
            viewer.entities.remove(blackBox);
        }, 2000);
        return [left, nearestPoint];
    }

    const blackBox = viewer.entities.add({
        position: right,
        box: {
            dimensions: new Cesium.Cartesian3(40.0, 40.0, 70.0),
            material: Cesium.Color.BLACK.withAlpha(0.5),
            outline: true,
            outlineColor: Cesium.Color.WHITE,
        },
        clampToGround: true
    });
    setTimeout(() => {
        viewer.entities.remove(blackBox);
    }, 2000);
    return [nearestPoint, right];

    //use newton like approximation and iteratively calculate the midpoint between the two points until the distance
    //were to increase again
}

/**
 * @deprecated This function was once used to visualize a selection of points in various calculations
 */
function visualizeSelection(positions, cartesian) {


    const clickedPos = viewer.entities.add({
        position: cartesian,
        point: {
            pixelSize: 5,
            color: Cesium.Color.BLACK

        },
        //disableDepthTestDistance : Number.POSITIVE_INFINITY
        clampToGround: true,

    });

    const redCone = viewer.entities.add({
        position: pos1,
        orientation: Cesium.Transforms.headingPitchRollQuaternion(
            pos1,
            new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(0), Cesium.Math.toRadians(0), Cesium.Math.toRadians(0))
        ),
        cylinder: {
            length: 400,
            topRadius: 2.0,
            bottomRadius: 20.0,
            material: Cesium.Color.RED,
        },
        clampToGround: true
    });

    const blueCone = viewer.entities.add({
        position: pos2,
        orientation: Cesium.Transforms.headingPitchRollQuaternion(
            pos2,
            new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(0), Cesium.Math.toRadians(0), Cesium.Math.toRadians(0))
        ),
        cylinder: {
            length: 400,
            topRadius: 2.0,
            bottomRadius: 20.0,
            material: Cesium.Color.BLUE,
        },
        clampToGround: true
    });
    const blackCone = viewer.entities.add({
        position: intersect,
        orientation: Cesium.Transforms.headingPitchRollQuaternion(
            intersect,
            new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(0), Cesium.Math.toRadians(0), Cesium.Math.toRadians(0))
        ),
        cylinder: {
            length: 400,
            topRadius: 2.0,
            bottomRadius: 20.0,
            material: Cesium.Color.BLACK,
        },
        clampToGround: true
    });

    setTimeout(() => {
        viewer.entities.remove(blackBox);
    }, 2000);
    return [nearestPoint, right];
}

/**
 * Finds the nearest point on the segments defined by three points relative to a given point.
 *
 * This function calculates the nearest point on the segments [a, b] and [b, c] to the given point using projection and
 * then selects the closer one, while making sure to clamp the result to the segment. `t = Math.max(0, Math.min(1, t));`
 *
 * @param {Array<Cesium.Cartesian3>} points - An array containing three Cartesian points [a, b, c].
 * @param {Cesium.Cartesian3} point - The point to find the nearest point to.
 *
 * This method is called from:
 * - {@link returnNearestPoints} - Uses this function to find the nearest points on segments for further calculations.
 *
 * The result is used to:
 * - Determine the nearest points for various calculations and visualizations in the CesiumJS viewer.
 *
 * This method was chosen over the deprecated {@link approximateNearestMidpoint} because it provides a more accurate
 * calculation of the nearest point using vector arithmetic. The deprecated method relied on distance comparisons
 * which could lead to incorrect results in certain cases.
 *
 * @returns {Cesium.Cartesian3} The nearest point on the segments to the given point.
 * Thanks copilot for the jsdoc comment :D
 */
function findNearestPointOnSegments(points, point) {
    const [a, b, c] = points;

    // calculate  nearest point on segment
    function nearestPointOnSegment(segmentStart, segmentEnd, point) {
        const ab = Cesium.Cartesian3.subtract(segmentEnd, segmentStart, new Cesium.Cartesian3());
        const ap = Cesium.Cartesian3.subtract(point, segmentStart, new Cesium.Cartesian3());

        const abLengthSquared = Cesium.Cartesian3.magnitudeSquared(ab);
        const dotProduct = Cesium.Cartesian3.dot(ap, ab);
        let t = dotProduct / abLengthSquared;

        // Clamp t to the range [0, 1]
        t = Math.max(0, Math.min(1, t));

        return Cesium.Cartesian3.add(
            segmentStart,
            Cesium.Cartesian3.multiplyByScalar(ab, t, new Cesium.Cartesian3()),
            new Cesium.Cartesian3()
        );
    }

    // Compute the nearest point on both segments
    const nearestOnAB = nearestPointOnSegment(a, b, point);
    const nearestOnBC = nearestPointOnSegment(b, c, point);

    // Compute distances
    const distanceToAB = Cesium.Cartesian3.distance(point, nearestOnAB);
    const distanceToBC = Cesium.Cartesian3.distance(point, nearestOnBC);

    // Determine the closest point
    if (distanceToAB < distanceToBC) {
        return nearestOnAB;
    } else {
        return nearestOnBC;
    }
}

/**
 * Initializes a 3D map pin model on the CesiumJS viewer at the specified initial position.
 *
 * This function adds a 3D model of a map pin to the CesiumJS viewer at the given initial position.
 * The model is animated and clamped to the ground. The viewer's clock is set to animate the model
 * with a slower multiplier to smooth out the animation.
 *
 * @param {Cesium.Viewer} viewer - The CesiumJS viewer instance where the map pin will be added.
 * @param {Cesium.Cartesian3} initialPosition - The initial position of the map pin in Cartesian coordinates.
 *
 * This method is called from:
 * - {@link cesiumSetup} - Initializes the map pin after setting up the CesiumJS viewer. The return value is then stored
 * in the global variable `mapPin`.
 *
 * @returns {Cesium.Entity} The created map pin entity.
 */
function initializePin(viewer, initialPosition) {

    const mapPin = viewer.entities.add({
        position: initialPosition,
        model: {
            uri: 'geodata/objects/figure/floating-map-pin.glb',
            scale: 1000,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            runAnimations: true, // Enable animations
            animations: {
                loop: Cesium.ModelAnimationLoop.REPEAT // Loop the animation indefinitely
            }
        }
    });

    viewer.clock.shouldAnimate = true;
    viewer.clock.multiplier = 0.5; // slow down animation to hide ugly pause on last animation keyframe
    return mapPin;
}


/**
 * Moves the CesiumJS map pin to the position corresponding to the given index in the name-coordinate mapping, defined in the global variable `name_coordinate_mapping`.
 *
 * This function updates the position of the global `mapPin` entity to the coordinates associated with the specified index
 * in the `name_coordinate_mapping`. It also checks if the map pin is within the current view and triggers a hover effect
 * on the toolbar buttons if the pin is out of view and not being tracked, using the globally defined `callable` function,
 * which is set in {@link initializeBillboards}.
 *
 * @param {number} index - The index of the position in the `name_coordinate_mapping` to move the map pin to.
 *
 *
 * This method is called from:
 * - {@link changeSlide} - Does not directly call this function, but indirectly through the slide change callback in the
 * LightGallery instance defined here:
 * - {@link initializeGallery} Contains a callback the map pin position when the slide in the LightGallery instance changes.
 *
 * @see {@link initializeBillboards} - Sets up the `callable` function used to trigger the hover effect on the toolbar buttons.
 */
function moveCesiumFigure(index) {
    //print(map.values[index].position);
    //mapPin.position = Cesium.Cartesian3.fromElements(10,10,10);

    //print(map.keys()[index]);
    if (!name_coordinate_mapping) {
        console.warn('Map not loaded yet! Wait a few milliseconds for the site to fully initialize');
        return;
    }
    if (!mapPin) {
        console.warn('Map Pin not loaded up yet! Wait a few milliseconds for the site to fully initialize');
        return; // i have a strong feeling that this error gets triggered, when the website url contains an image, and
        // he loading up of which is in some rare cases faster than the cesium setup, causing the mapPin to be null
    }

    const mapArray = Array.from(name_coordinate_mapping.entries());
    if (index >= 0 && index < mapArray.length) {
        const [key, value] = mapArray[index];
        //console.log('Key:', key, 'Value:', value);
        mapPin.position = value;
    } else {
        console.warn('Index out of bounds:', index);
    }
//    console.log('Is visible:', isEntityInRect(mapPin));

    if (!isEntityInRect(mapPin) && viewer.trackedEntity !== mapPin) {
        callable();
    }

}

/**
 * These three functions are used to figure out if the `mapPin`'s position passed as parameter is in the view of the camera
 * The viewers cam is accessed through the global variable `viewer` set in the main execution block which i should probably
 * change to be a normal parameter.
 *
 * There are three functions because in theory these should all be working solutions i found on stackoverflow or multiple
 * different cesium forum questions. In practice none of them work, all the time, and i dont know why.
 *
 * @param position
 * @returns {boolean} true if the position is in view, false otherwise
 */
function isPositionInView(position) {

    const globeBoundingSphere = new Cesium.BoundingSphere(
        Cesium.Cartesian3.ZERO,
        viewer.scene.globe.ellipsoid.minimumRadius
    );
    const occluder = new Cesium.Occluder(
        globeBoundingSphere,
        viewer.camera.position
    );

    return occluder.isPointVisible(position);
}
/**
 * These three functions are used to figure out if the `mapPin`'s position passed as parameter is in the view of the camera
 * The viewers cam is accessed through the global variable `viewer` set in the main execution block which i should probably
 * change to be a normal parameter.
 *
 * There are three functions because in theory these should all be working solutions i found on stackoverflow or multiple
 * different cesium forum questions. In practice none of them work, all the time, and i dont know why.
 *
 * @param position
 * @returns {boolean} true if the position is in view, false otherwise
 */
function isEntityInRect(entity) {
    const position = entity.position.getValue(Cesium.JulianDate.now());
    const cartographic = Cesium.Cartographic.fromCartesian(position);
    const viewRectangle = viewer.camera.computeViewRectangle();

    return Cesium.Rectangle.contains(viewRectangle, cartographic);

}
/**
 * These three functions are used to figure out if the `mapPin`'s position passed as parameter is in the view of the camera
 * The viewers cam is accessed through the global variable `viewer` set in the main execution block which i should probably
 * change to be a normal parameter.
 *
 * There are three functions because in theory these should all be working solutions i found on stackoverflow or multiple
 * different cesium forum questions. In practice none of them work, all the time, and i dont know why.
 *
 * @param position
 * @returns {boolean} true if the position is in view, false otherwise
 */
function isEntityInView(entity) {
    const camera = viewer.camera;
    const frustum = camera.frustum;
    const cullingVolume = frustum.computeCullingVolume(
        camera.position,
        camera.direction,
        camera.up
    );

    // Bounding sphere of the entity.
    let boundingSphere = new Cesium.BoundingSphere();
    viewer.dataSourceDisplay.getBoundingSphere(entity, false, boundingSphere);

// Check if the entity is visible in the screen.
    const intersection = cullingVolume.computeVisibility(boundingSphere);

    console.log(intersection);//wont get triggered in prod
//  1: Cesium.Intersect.INSIDE
//  0: Cesium.Intersect.INTERSECTING
// -1: Cesium.Intersect.OUTSIDE

}

//The following functions were used rigth in the beginning when trying to implement my own version of cesiums
//entity tracked functionality. this was because the cesium tracked entity callback will reset the cams pitch angle and zoom
// and also moved on every position change, all of which i didnt want. i eventually plan to reimplement this functionality
function ensureEntityVisible_camreset(entity) {
    const position = entity.position.getValue(Cesium.JulianDate.now());
    const cartographic = Cesium.Cartographic.fromCartesian(position);
    const viewRectangle = viewer.camera.computeViewRectangle();

    if (!Cesium.Rectangle.contains(viewRectangle, cartographic)) {
        viewer.camera.flyTo({
            destination: position,
            duration: 0.5
        });
    }
}

function ensureEntityVisible(entity) {
    const position = entity.position.getValue(Cesium.JulianDate.now());
    const cartographic = Cesium.Cartographic.fromCartesian(position);
    const viewRectangle = viewer.camera.computeViewRectangle();

    if (!Cesium.Rectangle.contains(viewRectangle, cartographic)) {
        const offset = new Cesium.HeadingPitchRange(
            viewer.camera.heading,
            viewer.camera.pitch,
            viewer.camera.positionCartographic.height
        );

        viewer.camera.flyTo({
            destination: position,
            orientation: {
                heading: viewer.camera.heading,
                pitch: viewer.camera.pitch,
                roll: viewer.camera.roll
            },
            offset: offset,
            duration: 0.5
        });
        calcOffset(viewer.camera);
    }
}


async function updateRedBoxPosition() {
    //return;
    //await new Promise(resolve => setTimeout(resolve, 2000));
    const {offsetX, offsetY} = raycastOffset(viewer);
    const absoluteCartesian3 = pickRay(viewer.camera);
    console.log('Absolute cartesian3: ', absoluteCartesian3);//wont get triggered in prod
    const newPosition = Cesium.Cartesian3.fromElements(
        viewer.camera.position.x + offsetX,
        viewer.camera.position.y + offsetY,
        viewer.camera.position.z
    );
    redBox.position = newPosition;
}

function createCamCenteredBox_deprecated() {
    const {offsetX, offsetY} = calcOffset(viewer.camera);

    console.log('Creating box at: ', viewer.camera.position.x + offsetX, viewer.camera.position.y + offsetY, viewer.camera.position.z);//wont get triggered in prod
    console.log('Camera position: ', viewer.camera.position.x, viewer.camera.position.y, viewer.camera.position.z);//wont get triggered in prod
    console.log('\n');//wont get triggered in prod
    //abort if the offset is too high or the resulting coordinate is nan
    if (isNaN(viewer.camera.position.x + offsetX) || isNaN(viewer.camera.position.y + offsetY)) {
        const error = new Error();
        const stack = error.stack.split('\n')[1].trim();
        console.warn(`Offset is too high, aborting. [${stack}]`);//wont get triggered in prod
        return;
    }
    const redBox = viewer.entities.add({
        name: "Red box with black outline",
        position: Cesium.Cartesian3.fromElements(viewer.camera.position.x - offsetX, viewer.camera.position.y - offsetY, viewer.camera.position.z),
        box: {
            dimensions: new Cesium.Cartesian3(4.0, 3.0, 6.0),
            material: Cesium.Color.RED.withAlpha(0.5),
            outline: true,
            outlineColor: Cesium.Color.BLACK,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        },
    });
    //viewer.camera.setView(redBox);
    //viewer.camera.zoomTo(redBox);
}

function calcOffset(viewerCam) {
    const height = camGroundOffset(viewer.scene, Cesium.Ellipsoid.WGS84);
    const offsetX = Math.tan(viewerCam.pitch) * height;
    const offsetY = Math.tan(viewerCam.heading) * height;
    return {offsetX, offsetY};
}

function camGroundOffset(scene, ellipsoid) {
    var cameraHeight = ellipsoid.cartesianToCartographic(scene.camera.position).height;
    return cameraHeight;
}

function raycastOffset(viewer) {
    const scene = viewer.scene;
    const camera = viewer.camera;

    const cameraPosition = camera.positionWC;
    const cameraDirection = camera.directionWC;

    const ray = new Cesium.Ray(cameraPosition, cameraDirection);

    const intersection = scene.globe.pick(ray, scene);

    if (intersection) {
        // Convert the intersection point to a cartographic position
        const cartographic = Cesium.Cartographic.fromCartesian(intersection);
        const offsetX = cartographic.longitude - camera.positionCartographic.longitude;
        const offsetY = cartographic.latitude - camera.positionCartographic.latitude;
        return {offsetX, offsetY};
    } else {
        console.warn('No intersection with the ground found.');
        return {offsetX: 0, offsetY: 0};
    }
}


function pickRay(viewer) {
    const scene = viewer.scene;
    console.log('Scene: ', scene);//wont get triggered in prod
    const windowPosition = new Cesium.Cartesian2(viewer.container.clientWidth / 2, viewer.container.clientHeight / 2);
    const pickRay = scene.camera.getPickRay(windowPosition);
    const pickPosition = scene.globe.pick(pickRay, scene);

    if (pickPosition) {
        const pickPositionCartographic = Cesium.Cartographic.fromCartesian(pickPosition);
        const apilon = pickPositionCartographic.longitude * (180 / Math.PI);
        const apilat = pickPositionCartographic.latitude * (180 / Math.PI);
        return {longitude: apilon, latitude: apilat};
    } else {
        console.warn('No intersection with the ground found.');
        return null;
    }
}



//-------------------Chart.js-------------------
async function initializeChart() {
    Chart.register(Chart.LineElement, Chart.LineController, Chart.Legend, Chart.Tooltip, Chart.LinearScale, Chart.PointElement, Chart.Filler, Chart.Title);


    const gpxData = await getPolyLines(true); //On deployed environment, the routes get shuffled?
    const nthElement = Math.ceil(gpxData.length / screen.width);
    const data = gpxData
        .filter((_, index) => index % nthElement === 0)
        .map(cartesian => Cesium.Cartographic.fromCartesian(cartesian).height);

// Hardcoding these by gpx.studio from the combined route calculated values like a dumbfuck because i dont wanna
// go through the pain of calculating these myself in cesium right now, the rest is real though i swear
    const ROUTE_LENGTH = 213950; //213.95km
    const ROUTE_ELEVATION = 8272; //8272m
    const ROUTE_DESCENT = 8778; //8778m


// Generate labels based on the data length
// If we assume the gpx points to be evenly distributed along the route, we can calculate the distance through the
// proportion of the data length to the total route length
// TODO: test geojson density
//const labels = data.map((_, index) => ROUTE_LENGTH*(data.length - index-1) / data.length); //the wrong way
    const labels = data.map((_, index) => ROUTE_LENGTH * ((index + 1) / data.length));


    const chartData = {
        labels: labels,
        datasets: [{
            data: data,
            fill: true,
            borderColor: '#66ccff',
            backgroundColor: '#66ccff66',
            tension: 0.1,
            pointRadius: 0,
            spanGaps: true
        }]
    };

    const config = {
        type: 'line',
        data: chartData,
        plugins: [{
            beforeInit: (chart, args, options) => {
                const maxHeight = Math.max(...chart.data.datasets[0].data);
                chart.options.scales.x.min = Math.min(...chart.data.labels);
                chart.options.scales.x.max = Math.max(...chart.data.labels);

                chart.options.scales.y.max = Math.ceil((maxHeight + 500) / 500) * 500;
                chart.options.scales.y1.max = Math.ceil((maxHeight + 500) / 500) * 500;

                //chart.options.scales.y.max = Math.floor(maxHeight + 500);
                //chart.options.scales.y1.max = Math.floor(maxHeight + 500);

                //chart.options.scales.y.max = Math.floor(maxHeight + Math.round(maxHeight * 0.2)); i could round that up to
                //chart.options.scales.y1.max = Math.floor(maxHeight + Math.round(maxHeight * 0.2)); the nearest 100 but why actually?
            }
        }],
        options: {
            animation: {
                duration: 7500
            },
            maintainAspectRatio: false,
            interaction: {intersect: false, mode: 'index'},
            tooltip: {position: 'nearest'},
            scales: {
                x: {type: 'linear'},
                y: {type: 'linear', beginAtZero: true},
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    beginAtZero: true,
                    grid: {drawOnChartArea: false}
                },
            },
            plugins: {
                title: {
                    align: "middle",
                    display: true,
                    text: `Distance ${ROUTE_LENGTH.toLocaleString()} m / Ascent ${ROUTE_ELEVATION} m / Descent ${ROUTE_DESCENT} m`
                },
                legend: {display: false},
                tooltip: {
                    displayColors: false,
                    callbacks: {
                        title: (tooltipItems) => {
                            /*console.log('Tooltip items1:', tooltipItems);
                            console.log('Tooltip items:', tooltipItems[0].label);
                            console.log('Tooltip items:', tooltipItems[0].raw);
                            console.log('Tooltip items4:', parseFloat(tooltipItems[0].label));*/
                            let distance;
                            try {
                                distance = (parseFloat(tooltipItems[0].label.replace(/,/g, '')) / 1000).toFixed(2);
                            } catch (error) { // what the actual fuck does chartjs expect me to parse there, that looks like a recipe for parsing crashes
                                console.error('Error parsing distance:', error);
                                distance = 'N/A';
                            }
                            return "Distance: " + distance + 'km';
                        },
                        label: (tooltipItem) => {
                            return "Elevation: " + (Math.ceil(tooltipItem.raw * 100) / 100).toFixed(2) + 'm'
                        },
                    }
                }
            },
            onClick: (event, elements) => {
                if (elements.length > 0) {
                    const index = elements[0].index;
                    //const cartesian = gpxData[index*nthElement]; //TODO shouldnt this not work? we ceil to get the division integer
                    //so the nthElement x the size of the shortened list could in some cases be a bit bigger than the actual list thus getting an out of bounds exception
                    const cartesian = gpxData[Math.min(index * nthElement, gpxData.length - 1)];
                    mapPin.position = cartesian;
                }
            },
            onHover: (event, elements) => {
                if (detectLeftButton()) {
                    // if (event.type === 'mousemove' && event.buttons === 1 && elements.length > 0) {
                    const index = elements[0].index;
                    const cartesian = gpxData[Math.min(index * nthElement, gpxData.length - 1)];
                    mapPin.position = cartesian;
                }
            }
        }
    };

    function detectLeftButton(evt = null) {
        /*evt = evt || window.event;
        if ("buttons" in evt) {
            return evt.buttons == 1;
        }
        var button = evt.which || evt.button;
        return button == 1;
    //----
        if(window.event.which==1){
            return true;
        }*/
//----
        //if (event.type === 'mousemove' && event.buttons === 1 && elements.length > 0) {
        return false;
    }

    const ctx = document.getElementById("route-elevation-chart").getContext("2d");
    const chart = new Chart(ctx, config);

}


function toggleFallbackContent_dpr(buttonElement) {
    const cesiumContainer = document.getElementById('cesiumContainer');

    if (isFallbackLoaded) {
        location.reload(); //reload because im too cheap to implement a proper toggle :)
    } else {
        /*
        fetch('StaticMap.html')
            .then(response => response.text())
            .then(html => {
                // Replace the content of the Cesium container with the new HTML
                cesiumContainer.innerHTML = html;

                const script = document.createElement('script');
                script.src = 'StaticMap.js';
                document.body.appendChild(script);

                isFallbackLoaded = true;
            })
            .catch(error => console.error('Failed to load fallback content:', error));*/
        const cesiumContainer = document.getElementById('cesiumContainer');
        const iframe = document.getElementById('static-map-iframe');

        //cesiumContainer.style.visibility = 'hidden';
        cesiumContainer.style.display = 'none';
        //iframe.style.display = 'block';


        // Show the iframe
        iframe.src = 'StaticMap.html';
        iframe.style.display = 'block';
        isFallbackLoaded = true;
        try {
            buttonElement.textContent = 'Switch to Dynamic Map'; //happend in testing, this will get executed rarely anyways
        }catch (error) {
            console.error('Failed to set button text:', error);
        }
    }
}

function toggleFallbackContent(buttonElement) {
    const cesiumContainer = document.getElementById('cesiumContainer');
    const iframe = document.getElementById('static-map-iframe');

    if (isFallbackLoaded) {
        location.reload(); // Reload because I'm too cheap to implement a proper toggle :)
    } else {
        cesiumContainer.style.display = 'none';

        // Show the iframe
        iframe.src = 'StaticMap.html';
        iframe.style.display = 'block';

        // Add an event listener to load the script after the iframe content is loaded
        iframe.addEventListener('load', () => {
            const script = document.createElement('script');
            script.src = 'StaticMap.js';
            document.body.appendChild(script);
        });

        isFallbackLoaded = true;
        try {
            buttonElement.textContent = 'Switch to Dynamic Map';
        } catch (error) {
            console.error('Failed to set button text:', error);
        }
    }
}
