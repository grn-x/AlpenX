// Light Gallery Token: lightGallery: 0000-0000-000-0000 license key is not valid for production use lightgallery.min.js:8:16041
// Even though non commercial and open source use is permitted without a license key, the warning is still displayed

//TODO:
// - fix this this horrible filename that somehow slipped through 20240710_191430000_iOS 1.jpg
// - column overlapping masonry layout?
// - fix masonry picture ordering manually?
// - refractor and clean up this mess of a code
// - images to fix:
//      - https://grn-x.github.io/AlpenX/#lg=1&slide=107
//      - https://grn-x.github.io/AlpenX/#lg=1&slide=100

//------------------- Entry Point / Main Execution Block -------------------
loadImages();


// -- LightGallery --
let gallery_instance;
let loadDivsPromiseResolve;
const loadDivsPromise = new Promise((resolve) => {
    loadDivsPromiseResolve = resolve;
});
document.addEventListener('DOMContentLoaded', initializeGallery);

// -- CesiumJS --
let viewer
let map
const polylines = []
const promises = []
let initialPromiseResolve
let mapPin
let callable

const shouldSort = false        //used to be global variables, though through adding identical parameters
const devAddPictures = false    //to the affected functions, they are scoped and overriden anyways
initialize(); //inner async loadReferenceTables() call
cesiumSetup()


//----------- Masonry Layout Overview -----------
async function loadImages() {
    const response = await fetch('geodata/imgsource/final_sorted.txt');
    const text = await response.text();
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);

    const imageMap = new Map();
    lines.forEach((line, index) => {
        const [filename] = line.split(';');
        if (!imageMap.has(filename)) {
            imageMap.set(filename, index);
        }
    }); //TODO: refactor this to a seperate function, make loadImages accept map
    //Looping is done multiple times, combine


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
    ].map(([filename, name]) => [filename, name, imageMap.get(filename) || 0]);

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


let innterHTMLcontent = ''; //else this creates an undefined element in the document
function constructHTMLdivs(filename, location, altText, thumbnailPath = 'geodata/imgsource/combined-thumbnail', imagePath = 'geodata/imgsource/combined') {
    const elementString = `
        <a href="${imagePath}/${filename}" data-src="${imagePath}/${filename}" class="gallery-item" data-location="${location} custom-tag"tag">
        <img src="${thumbnailPath}/thumbnail_${filename}" alt="${altText}" loading="lazy" data-src="${imagePath}/${filename}" class="lg-lazy-thumb" />
        </a>
        `;

    innterHTMLcontent += elementString;
}


async function loadHTMLdivs(galleryHTMLelement = document.getElementById('lightgallery')) {
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


function initializeGallery() {
    loadDivsPromise.then(() => {

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
            zoom: true,
            zoomPluginStrings: {
                zoomIn: 'Zoom in',
                zoomOut: 'Zoom out',
                actualSize: 'Actual size'
            },
            zoom: {
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


function changeSlide(index) {
    console.log('Attempting to change to slide:', index);
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

function cesiumSetup(shouldSort=false) {
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyZWIyNDVmYS1lZGMwLTRjNzgtOGUwYi05MDI3Y2I5NjhiYjkiLCJpZCI6MjU1Njg5LCJpYXQiOjE3MzE3MTE5NDZ9.fgtGlj3eBn2atRqSMgEKuQTbTtm4Pg3aIpkbyFuAu8o'; // this feels horrible, but i dont have a proxy so there is no solution anyways
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
                //viewer.zoomTo(mapPin);
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

//cannot add this to the cesium toolbar, because this needs to work in the fallback mode as well
    const mapButton = document.createElement('button');
    mapButton.textContent = 'Switch to Static Map';
    mapButton.style.position = 'absolute';
    mapButton.style.top = '10px';
    mapButton.style.left = '10px';
    document.body.appendChild(mapButton);

    mapButton.addEventListener('click', () => {
        toggleFallbackContent(mapButton);
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
}
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


async function initialize(shouldSort = false, devAddPictures = false) {
    //const referenceTablePath = 'geodata\\imgsource\\combined_sorted.txt';
    const referenceTablePath = 'geodata\\imgsource\\final_sorted.txt';
    map = await loadReferenceTables(referenceTablePath);


    if (shouldSort) {

        console.log('Sorting map by keys');
        map.forEach((value, key) => {
            //console.log('http://127.0.0.1:8080/geodata/imgsource/combined/' + key +'\n'+ value);
        });
        const sortedKeys = sortMapKeys(map, viewer, await getPolyLines(true));

        map = sortMapByKeys(map, sortedKeys);
        let mapString = '';
        map.forEach((value, key) => {
            console.log('http://127.0.0.1:8080/geodata/imgsource/combined/' + key + '\n' + value);

            mapString += `${key};${value}\n`;
        });

        navigator.clipboard.writeText(mapString).then(() => {
            console.log('Map data copied to clipboard');
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    }

    initializeBillboards(map, 'geodata/imgsource/combined-thumbnail', !devAddPictures);
}


function sortMapKeys(map, viewer, cartArray = getPolylinesAsCartesianArrays(viewer, true)) {
    console.log('Sorting map by keys');
    const sortedMap = new Map();

    map.forEach((value, key) => {
        sortedMap.set(key, getNumPreviousPoints(value, cartArray));
    });

    return new Map([...sortedMap.entries()].sort((a, b) => a[1] - b[1]));
    ;


}

function sortMapByKeys(map, sortedKeys) {
    const sortedMap = new Map();
    sortedKeys.forEach((value, key) => {
        if (map.has(key)) {
            sortedMap.set(key, map.get(key));
        }
    });
    return sortedMap;
}

function getNumPreviousPoints(pos, cartesianArray) {
    const key = returnNearestPoints(cartesianArray, pos)[1];
    return cartesianArray.indexOf(key);
}

function getPolylinesAsCartesianArrays(viewer, fuse = false) {
    console.log('Getting polylines as cartesian arrays');
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


function loadReferenceTables(referenceTablePath) {
    let map = new Map();
    return fetch(referenceTablePath)
        .then(response => response.text())
        .then(text => {

            const lines = text.split('\n'); // example: IMG-20240709-WA0036.jpg;4271311.463420066 784591.8384901393 4658090.60018335;from Website
            for (const line of lines) {
                if (line.startsWith('//')) continue;
                const [key, valueString, altText] = line.split(';');
                if (valueString) {
                    const [x, y, z] = valueString.split(' ').map(parseFloat);
                    const value = new Cesium.Cartesian3(x, y, z);
                    map.set(key, value);
                    constructHTMLdivs(key, valueString, altText);
                } else {
                    console.warn('Invalid line format:', line);
                }
            }

            loadHTMLdivs();


            return map;
        });
}


function initializeBillboards(map, prePath = '/geodata/imgsource/combined-thumbnail', addClickEvent = true) {
    const billboards = [];

    map.forEach((value, key) => {
        if (value.x && value.y && value.z) {
            const entity = viewer.entities.add({
                position: value,
                billboard: {
                    image: `${prePath}/thumbnail_${key}`, // Path to the image file
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
                    console.log('Clicked on entity:');
                    const pickedObject = viewer.scene.pick(click.position);
                    if (Cesium.defined(pickedObject) && billboards.includes(pickedObject.id)) {
                        const index = Array.from(map.keys()).indexOf(pickedObject.id);
                        const selfIndex = billboards.indexOf(pickedObject.id);
                        console.log('Clicked on entity:', pickedObject.id, ' at index:', index, 'selfIndex:', selfIndex);
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
    trackButton.title = "Track the figure, when it moves after a picture change, or a height profile selection";

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

    // Inner function declaration
    callable = function () {
        //console.log('callable');
        callable = function () { //this seems like an absolute terrible solution, but it kind of works
            // console.log('callable');
            for (let i = 0; i < 5; i++) { //implement css animation instead
                setTimeout(() => {
                    triggerHoverEffect(trackButton, 350);
                }, i * 700); // why do i have to do it this way?
            }
        }
    }

    toolbar.insertBefore(trackButton, modeButton);
    toolbar.insertBefore(hideButton, modeButton);

}


function initializePlane(map) {
    map.forEach((value, key) => {
        console.log('Key:', key, 'Value:', value);

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
    viewer.zoomTo(viewer.entities);
}

async function writeToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        console.log(text, ' copied to clipboard');
    } catch (err) {
        console.error('Failed to copy text: ', err);
    }
}

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
    // return all three 😇👍

    // if(Cesium.Cartesian3.distance(left, clickPosition) < Cesium.Cartesian3.distance(right, clickPosition)) {
    //     return [left, nearestPoint];
    // }
    return [left, nearestPoint, right];
}

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
        console.log('Left is closer');
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
    console.log('Right is closer');

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

function moveCesiumFigure(index) {
    //print(map.values[index].position);
    //mapPin.position = Cesium.Cartesian3.fromElements(10,10,10);

    //print(map.keys()[index]);
    if (!map) {
        console.warn('Map not loaded yet! Wait a few milliseconds for the site to fully initialize');
        return;
    }

    const mapArray = Array.from(map.entries());
    if (index >= 0 && index < mapArray.length) {
        const [key, value] = mapArray[index];
        //console.log('Key:', key, 'Value:', value);
        mapPin.position = value;
    } else {
        console.warn('Index out of bounds:', index);
    }
    console.log('Is visible:', isEntityInRect(mapPin));

    if (!isEntityInRect(mapPin) && viewer.trackedEntity !== mapPin) {
        callable();
    }

}

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

function isEntityInRect(entity) {
    const position = entity.position.getValue(Cesium.JulianDate.now());
    const cartographic = Cesium.Cartographic.fromCartesian(position);
    const viewRectangle = viewer.camera.computeViewRectangle();

    return Cesium.Rectangle.contains(viewRectangle, cartographic);

}

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

    console.log(intersection);
//  1: Cesium.Intersect.INSIDE
//  0: Cesium.Intersect.INTERSECTING
// -1: Cesium.Intersect.OUTSIDE

}


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
    return;
    //await new Promise(resolve => setTimeout(resolve, 2000));
    const {offsetX, offsetY} = raycastOffset(viewer);
    const absoluteCartesian3 = pickRay(viewer.camera);
    console.log('Absolute cartesian3: ', absoluteCartesian3);
    const newPosition = Cesium.Cartesian3.fromElements(
        viewer.camera.position.x + offsetX,
        viewer.camera.position.y + offsetY,
        viewer.camera.position.z
    );
    redBox.position = newPosition;
}

function createCamCenteredBox_deprecated() {
    const {offsetX, offsetY} = calcOffset(viewer.camera);

    console.log('Creating box at: ', viewer.camera.position.x + offsetX, viewer.camera.position.y + offsetY, viewer.camera.position.z);
    console.log('Camera position: ', viewer.camera.position.x, viewer.camera.position.y, viewer.camera.position.z);
    console.log('\n');
    //abort if the offset is too high or the resulting coordinate is nan
    if (isNaN(viewer.camera.position.x + offsetX) || isNaN(viewer.camera.position.y + offsetY)) {
        const error = new Error();
        const stack = error.stack.split('\n')[1].trim();
        console.warn(`Offset is too high, aborting. [${stack}]`);
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
    console.log('Scene: ', scene);
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

// Add Cesium OSM Buildings, a global 3D buildings layer.
Cesium.createOsmBuildingsAsync().then(buildingTileset => {
    viewer.scene.primitives.add(buildingTileset);
});


viewer.camera.changed.addEventListener(() => {
    //updateRedBoxPosition();
});


window.onload = () => {
    //changeBackpackPositionOverTime();
};


//-------------------Chart.js-------------------

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
            y1: {type: 'linear', display: true, position: 'right', beginAtZero: true, grid: {drawOnChartArea: false}},
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


let isFallbackLoaded = false;

function toggleFallbackContent(buttonElement) {
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
        buttonElement.textContent = 'Switch to Dynamic Map';
    }
}
