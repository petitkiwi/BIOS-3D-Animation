/* 
COURS : https://github.com/Thomas-Jld/mdt-threejs/tree/master/lessons
en JS, pas besoin de préciser le type de la variable 
*/

// IMPORT

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
//import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';


// Create a scene
const scene = new THREE.Scene();
// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-30, 20, 100);
// Import the canvas element
const canvas = document.getElementById('canvas');
// Create a WebGLRenderer and set its width and height
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    // Antialiasing is used to smooth the edges of what is rendered
    antialias: true,
    // Activate the support of transparency
    //alpha: true // si true alors fond transparent sinon fond noir
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
// Create the controls with specified min and max distances
const controls = new OrbitControls(camera, canvas);
controls.minDistance = 1; // Set the minimum zoom distance (prevent zooming out too much)
controls.maxDistance = 100; // Set the maximum zoom distance (adjust as needed)
// Handle the window resize event
window.addEventListener('resize', () => {
    // Update the camera
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    // Update the controls
    //controls.handleResize();
    // Update the renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
});


// BACKGROUND

const background_loader = new THREE.TextureLoader();
let background = background_loader.load('Backgrounds/sky.jpg');
background.mapping = THREE.EquirectangularReflectionMapping;
background.colorSpace = THREE.SRGBColorSpace;
scene.background = background;


// PLAN

// Load the texture for the ground
const textureLoader = new THREE.TextureLoader(); // un seul loader pour several textures
const groundTexture = textureLoader.load('Textures/sand_01_diff_4k.jpg');
// Create a ground plane
const groundGeometry = new THREE.PlaneGeometry(200, 200); // Adjust the size as needed
const groundMaterial = new THREE.MeshStandardMaterial({ map: groundTexture, side: THREE.DoubleSide });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = - Math.PI / 2; // Rotate the ground to be horizontal
ground.scale.set(20, 20, 20)
scene.add(ground);


// FOG

const fogColor = new THREE.Color(0xffffff); // Set the color of the fog
const fogDensity = 0.001; // Set the density of the fog
scene.fog = new THREE.FogExp2(fogColor, fogDensity);


// LIGHTS

// Simulate daylight
const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x404040, 2);
// (color of upper hemisphere [sky], color of lower hemisphere [ground], intensity)
scene.add(hemisphereLight);
const ambient = new THREE.AmbientLight(0xffffff);
scene.add(ambient);

// HELPERS
// const axesHelper = new THREE.AxesHelper(50);
// scene.add(axesHelper);

// GUI
// const gui = new GUI();
// // Object to hold parameters for dat.GUI
// const guiParams = {
//     positionX: 16.4,
//     positionY: 6.6,
//     positionZ: -25.4,
// };


// GLTF MODELS

const BIOS_loader = new GLTFLoader();
BIOS_loader.load('Models/bios.gltf', (gltf) => {
    // Le modèle 3D est chargé ici
    const model = gltf.scene;
    console.log(model)
    // model position according to xyz
    model.position.set(0, 0.5, 0);
    // adjust model roation (radians)
    model.rotation.set(-Math.PI / 2, 0, 0); // Exemple : rotation de 90 degrés autour de l'axe y
    // adjust scale (de quelle taille ça apparaît)
    model.scale.set(15, 15, 13.5);

    scene.add(model);
});

//statue pâques
const statue_loader = new GLTFLoader();
statue_loader.load('Models/statue/scene.gltf', (gltf) => {
    // Le modèle 3D est chargé ici
    const statue = gltf.scene;
    // model position according to xyz
    statue.position.set(-50, 6, 60);
    // adjust model roation (radians)
    statue.rotation.set(0, 4, 0); // Exemple : rotation de 90 degrés autour de l'axe y
    // adjust scale (de quelle taille ça apparaît)
    statue.scale.set(15, 15, 15);

    scene.add(statue);
    scene.add(welcomemesh); // so the text box doesn't appear before it's speaker
});

const nakedguy_loader = new GLTFLoader();
nakedguy_loader.load('Models/naked_guy/scene.gltf', (gltf) => {
    // Le modèle 3D est chargé ici
    const model = gltf.scene;
        // model position according to xyz
    model.position.set(1, 1, 0);
    // adjust model roation (radians)
    model.rotation.set(0, 0, 0); // Exemple : rotation de 90 degrés autour de l'axe y
    // adjust scale (de quelle taille ça apparaît)
    model.scale.set(10, 10, 10);

    scene.add(model);
});

const palm_loader = new GLTFLoader();
// add multiple palm trees to the scene
function addPalmTree(position, file) {
    palm_loader.load(file, (gltf) => {
        const model = gltf.scene;
        model.position.copy(position); // Set the position based on the provided argument
        model.rotation.set(0, 0, 0);
        model.scale.set(10, 10, 10);
        scene.add(model);
    });
}
addPalmTree(new THREE.Vector3(30, 0, 0), 'Models/coconut_palm/scene.gltf');
addPalmTree(new THREE.Vector3(100, 0, 30), 'Models/coconut_palm/scene.gltf');
addPalmTree(new THREE.Vector3(-100, 0, -60),  'Models/coconut_palm/scene.gltf');
addPalmTree(new THREE.Vector3(-250, 0, 10), 'Models/coconut_palm/scene.gltf');
addPalmTree(new THREE.Vector3(-25, 0, 10), 'Models/date_palm/scene.gltf');
addPalmTree(new THREE.Vector3(50, 0, 50), 'Models/date_palm/scene.gltf');
addPalmTree(new THREE.Vector3(-100, 0, 92), 'Models/date_palm/scene.gltf');
addPalmTree(new THREE.Vector3(80, 0, 300), 'Models/date_palm/scene.gltf');
addPalmTree(new THREE.Vector3(85, 0, -100), 'Models/date_palm/scene.gltf');


// sea urchin shell
const seaurchinshell_loader = new GLTFLoader();
seaurchinshell_loader.load('Models/seaurchinshell/scene.gltf', (gltf) => {
    // Le modèle 3D est chargé ici
    const model = gltf.scene;
    // // model position according to xyz
    model.position.set(-5.5,2.4,-4);
    // adjust model roation (radians)
    model.rotation.set(0, 0, 0); // Exemple : rotation de 90 degrés autour de l'axe y
    // adjust scale (de quelle taille ça apparaît)
    model.scale.set(5, 5, 5);

    scene.add(model);
    // // GUI
    // model.position.set(guiParams.positionX, guiParams.positionY, guiParams.positionZ);
    // gui.add(guiParams, 'positionX', -100, 100).onChange(updateParam);
    // gui.add(guiParams, 'positionY', -100, 100).onChange(updateParam);
    // gui.add(guiParams, 'positionZ', -100, 100).onChange(updateParam);
    // function updateParam() {
    //     model.position.set(guiParams.positionX, guiParams.positionY, guiParams.positionZ);
    // }
});

// sea urchin (alive lol)
const seaurchin_loader = new GLTFLoader();
seaurchin_loader.load('Models/seaurchin/scene.gltf', (gltf) => {
    // Le modèle 3D est chargé ici
    const model = gltf.scene;
    // model position according to xyz
    model.position.set(7,26,-72);
    // adjust model roation (radians)
    model.rotation.set(0, 0, 0); // Exemple : rotation de 90 degrés autour de l'axe y
    // adjust scale (de quelle taille ça apparaît)
    model.scale.set(15, 15, 15);

    scene.add(model);

    
});

// GROUP MODELS

// Group to hold both models
const skating_teemo = new THREE.Group();
// Load the GLTF
const teemo_loader = new GLTFLoader();
teemo_loader.load('Models/teemo/scene.gltf', (gltf) => {
    const modelteemo = gltf.scene;
    // model.traverse((node) => {
    //     if(node.isMesh) node.material = new THREE.MeshNormalMaterial();
    // })
    modelteemo.position.set(0, 7, 85);
    modelteemo.rotation.set(0, Math.PI, 0);
    modelteemo.scale.set(1, 1, 1);
    skating_teemo.add(modelteemo);
});
// Load the GLTF
const skateboard_loader = new GLTFLoader();
skateboard_loader.load('Models/skateboard/scene.gltf', (gltf) => {
    const modelskate = gltf.scene;
    modelskate.position.set(0, 0, 85);
    modelskate.rotation.set(0, 0, 0);
    modelskate.scale.set(15, 15, 15);
    skating_teemo.add(modelskate); // Add model to the group
});

// Add the models group to the scene
scene.add(skating_teemo);


// TEXT

// welcome text box
const welcometext_loader = new THREE.TextureLoader(); // un seul loader pour several textures
const welcometext = welcometext_loader.load('Images/welcometext.png');
const geowelcometext = new THREE.PlaneGeometry(200, 200); // Adjust the size as needed
const matwelcometext = new THREE.MeshStandardMaterial({ map: welcometext, transparent: true, side: THREE.DoubleSide });
const welcomemesh = new THREE.Mesh(geowelcometext, matwelcometext);
welcomemesh.rotation.set(0,0.1,-0.2)
welcomemesh.scale.set(0.08, 0.08, 0.08)
welcomemesh.position.set(-45, 15, 50)

// bios text box
const biostext_loader = new THREE.TextureLoader(); // un seul loader pour several textures
const biostext = biostext_loader.load('Images/biostext.png');
const geobiostext = new THREE.PlaneGeometry(200, 200); // Adjust the size as needed
const matbiostext = new THREE.MeshStandardMaterial({ map: biostext, transparent: true, side: THREE.DoubleSide });
const biosmesh = new THREE.Mesh(geobiostext, matbiostext);
biosmesh.rotation.set(-0.5,1,0.2)
biosmesh.scale.set(0.08, 0.08, 0.08)
biosmesh.position.set(-10, 15, 29)

// urhins text box
const urchintext_loader = new THREE.TextureLoader(); // un seul loader pour several textures
const urchintext = urchintext_loader.load('Images/urchintext.png');
const geourchintext = new THREE.PlaneGeometry(200, 200); // Adjust the size as needed
const maturchintext = new THREE.MeshStandardMaterial({ map: urchintext, transparent: true, side: THREE.DoubleSide });
const urchinmesh = new THREE.Mesh(geourchintext, maturchintext);
urchinmesh.rotation.set(0,Math.PI,0)
urchinmesh.scale.set(0.08, 0.08, 0.08)
urchinmesh.position.set(21, 8, -20)

// hi text box
const hitext_loader = new THREE.TextureLoader(); // un seul loader pour several textures
const hitext = urchintext_loader.load('Images/hitext.png');
const geohitext = new THREE.PlaneGeometry(200, 200); // Adjust the size as needed
const mathitext = new THREE.MeshStandardMaterial({ map: hitext, transparent: true, side: THREE.DoubleSide });
const himesh = new THREE.Mesh(geohitext, mathitext);
himesh.rotation.set(0,0,0)
himesh.scale.set(0.08, 0.08, 0.08)
himesh.position.set(-45, 15, 50)

// naked_guy tattoo
const tattoo_loader = new THREE.TextureLoader(); // un seul loader pour several textures
const tattootext = tattoo_loader.load('Images/tattoo.png');
const geotattootext = new THREE.PlaneGeometry(200, 200); // Adjust the size as needed
const mattattootext = new THREE.MeshStandardMaterial({ map: tattootext, transparent: true, side: THREE.DoubleSide });
const tattoomesh = new THREE.Mesh(geotattootext, mattattootext);
tattoomesh.rotation.set(-0.45,0,0)
tattoomesh.scale.set(0.02,0.02,0.02)
tattoomesh.position.set(1.2,14.9,0.9)
scene.add(tattoomesh);


// INTERACTION

let newCameraPosition = camera.position;
let stepsMax = 100;
let currentStep = 0;
let minDistance = 1;

const getCloser = () => {
    camera.position.lerp(newCameraPosition, 0.1)
    currentStep++;
    if (currentStep < stepsMax && camera.position.distanceTo(newCameraPosition)>minDistance) setTimeout(getCloser, 10);
    else {
        currentStep = 0;
        camera.position.lerp(newCameraPosition, 1)
    }
}

function onClick(event) {
    // Coordonnées du clic de la souris normalisées par rapport à la fenêtre
    const mouse = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
    };

    // Création d'un rayon depuis la caméra à l'endroit où la souris a cliqué
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    // ZOOM 1 
    // rayon d'intéraction autour de l'objet cliqué
    const welcome_intersect = raycaster.intersectObject(welcomemesh, true);
    const bios_intersect = raycaster.intersectObject(biosmesh, true);
    const urchin_intersect = raycaster.intersectObject(urchinmesh, true);

    if (welcome_intersect.length > 0) {
        console.log("clicked welcome");
        // Set the new camera position
        newCameraPosition = new THREE.Vector3(22, 24, 35);
        scene.remove(welcomemesh);
        getCloser();
        controls.target.set(0, 0, 0); // Set the focus point of the controls
        scene.add(biosmesh);
    }
    else if(bios_intersect.length > 0)
    {
        // ZOOM 2     
        console.log("clicked bios");
        // Set the new camera position
        newCameraPosition = new THREE.Vector3(10,13.1,-42);
        scene.remove(biosmesh);
        getCloser();
        controls.target.set(0, 0, 0); // Set the focus point of the controls
        scene.add(urchinmesh);
    }   
    else 
    {
        if(urchin_intersect.length > 0)
        {
            // ZOOM 3
            console.log("clicked urchin");
            scene.remove(urchinmesh);
            //window.dispatchEvent(new Event('pointerup'));
            // Open a link when biosmesh is clicked
            //window.location.href = 'https://dvic.devinci.fr/member/claire-lefez'; // open link same tab
            window.open('https://dvic.devinci.fr/member/claire-lefez', '_blank'); // open link new tab
            controls.reset();
            camera.position.set(-30, 20, 100);
            scene.add(himesh);
        }   
    }
}
window.addEventListener("pointerdown", onClick);


// POST PROCESSING EFFECTS

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.1, // strength of the bloom effect
    0.1, // threshold intensity for bright areas
    1 // radius of the bloom effect
);
const outputPass = new OutputPass();

composer.addPass(renderPass);
composer.addPass(bloomPass);
composer.addPass(outputPass);


// ANIMATION LOOP

// next time écran est rafraichi, navigateur rappelle la fonction
const animate = () => {
    // Call animate recursively
    requestAnimationFrame(animate);

    // Rotate the models group around the center of the ground plane
    skating_teemo.rotation.y += 0.008; // rotation speed

    // Update the controls
    controls.update();

    // Render the scene
    //renderer.render(scene, camera);

    // Render the scene
    composer.render();

    //console.log("Camera Position:", camera.position.x, camera.position.y, camera.position.z);

    }
    // Call animate for the first time
    animate();