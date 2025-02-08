/*




<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Three.js First Person Viewer</title>
    <style>
        body {
            margin: 0;
            overflow: hidden;
        }
        canvas {
            display: block;
        }
    </style>
</head>
<body>
    <script type="module">
        import * as THREE from 'https://unpkg.com/three@0.154.0/build/three.module.js';
        import { GLTFLoader } from 'https://unpkg.com/three@0.154.0/examples/jsm/loaders/GLTFLoader.js';
        import { PointerLockControls } from 'https://unpkg.com/three@0.154.0/examples/jsm/controls/PointerLockControls.js';

        console.log("map started");

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        const light = new THREE.AmbientLight(0xffffff, 1); // Ambient
        scene.add(light);

        const loader = new GLTFLoader();
        const modelUrl = 'map-opt.glb'; // Replace with your model URL
        loader.load(modelUrl, (gltf) => {
            scene.add(gltf.scene);
            gltf.scene.position.set(0, 0, 0);
        });

        const controls = new PointerLockControls(camera, document.body);
        document.addEventListener('click', () => {
            controls.lock();
        });

        controls.addEventListener('lock', () => {
            console.log('Pointer locked');
        });

        controls.addEventListener('unlock', () => {
            console.log('Pointer unlocked');
        });

        camera.position.set(0, 1.6, 5); // Adjust height to simulate first-person view

        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };

        animate();

        const moveSpeed = 0.1;
        const velocity = new THREE.Vector3();
        const direction = new THREE.Vector3();
        const keys = {};

        document.addEventListener('keydown', (event) => {
            keys[event.code] = true;
        });

        document.addEventListener('keyup', (event) => {
            keys[event.code] = false;
        });

        const move = () => {
            velocity.set(0, 0, 0);
            direction.set(0, 0, 0);

            if (keys['KeyW']) direction.z -= moveSpeed;
            if (keys['KeyS']) direction.z += moveSpeed;
            if (keys['KeyA']) direction.x -= moveSpeed;
            if (keys['KeyD']) direction.x += moveSpeed;

            direction.normalize();
            direction.applyQuaternion(camera.quaternion);
            velocity.copy(direction);

            camera.position.add(velocity);
        };

        const update = () => {
            move();
        };

        const mainLoop = () => {
            requestAnimationFrame(mainLoop);
            update();
            renderer.render(scene, camera);
        };

        mainLoop();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    </script>
</body>
</html>




------
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 4;

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas') });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.set(10, 10, 20).normalize();
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xffffff, 5, 1);
pointLight.position.set(10, 10, 20);
scene.add(pointLight);

const loader = new GLTFLoader();

loader.load(
    'geodata/objects/figure/map-opt.glb',
    function (gltf) {
        scene.add(gltf.scene);
    },
    undefined,
    function (error) {
        console.error(error);
    }
);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; 
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.minDistance = 1;
controls.maxDistance = 500;
controls.maxPolarAngle = Math.PI / 2;

function animate() {
    requestAnimationFrame(animate);
    controls.update(); 
    renderer.render(scene, camera);
}

animate();*/

(() => {
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
  
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        switchSrc('./geodata/objects/map/compressed_level14_zoom.glb');
      } else {
        switchSrc('./geodata/objects/map/compressed_png_texture.glb'); //Causes redudant get req?
      }
    });
  })();