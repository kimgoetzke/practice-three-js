import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    500
);
camera.position.set(0, 2, 3);

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Controls
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

// Plane 1
const plane1 = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100, 100, 100),
    new THREE.MeshStandardMaterial({ 
        color: 0xAAAAAA,
        wireframe: true
    })
);
plane1.position.y = -2;
plane1.rotation.x = -0.5 * Math.PI;
scene.add(plane1);

// Plane 2
const plane2 = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100, 100, 100),
    new THREE.MeshStandardMaterial({ 
        color: 0x555555,
        wireframe: false
    })
);
plane2.position.y = -2.05;
plane2.rotation.x = -0.5 * Math.PI;
plane2.receiveShadow = true;
scene.add(plane2);

// Lights: Ambient
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.05);
scene.add(ambientLight);

// Lights: Directional
const directionalLight =new THREE.DirectionalLight(0xFFFFFF, 0.03);
directionalLight.position.set(10, 10, 0);
directionalLight.castShadow = true;
scene.add(directionalLight);

// const dLightHelper = new THREE.DirectionalLightHelper(directionalLight);
// scene.add(dLightHelper);

// Fog
scene.fog = new THREE.FogExp2(0x000000, 0.05, 100);

// Sphere
const sphere = new THREE.Mesh( 
    new THREE.SphereGeometry(),
    new THREE.MeshNormalMaterial({ 
        wireframe: true
    })
    );
sphere.position.y = -1;
sphere.castShadow = true;
scene.add(sphere);

// onWindowResize
window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
};

// onMouseMovement
const mousePosition = new THREE.Vector2();
window.addEventListener('mousemove', onMouseMovement);
function onMouseMovement() {
        mousePosition.x = (clientX / window.innerWidth) * 2 - 1;
        mousePosition.y = (clientY / window.innerHeight) * 2 - 1;
}

// onDocumentKey
const keyMap = {}
const onDocumentKey = e => keyMap[e.code] = e.type === 'keydown';
document.addEventListener('keydown', onDocumentKey, false);
document.addEventListener('keyup', onDocumentKey, false);

// Movement related variables
const quaternion = new THREE.Quaternion();
const angularVelocity = new THREE.Vector3(-1, 0, 0);
const v0 = new THREE.Vector3();
const time = new THREE.Clock();
let delta = 0;

// Function: Render
function render() {
    renderer.render(scene, camera);
}

// Function: Animate
function animate() {
    requestAnimationFrame(animate);

    delta = time.getDelta();
    if (keyMap['KeyW']) angularVelocity.x -= delta * 5;
    if (keyMap['KeyS']) angularVelocity.x += delta * 5;
    if (keyMap['KeyA']) angularVelocity.z += delta * 5;
    if (keyMap['KeyD']) angularVelocity.z -= delta * 5;
    if (keyMap['KeyQ']) angularVelocity.lerp(v0, 0.1);

    quaternion.setFromAxisAngle(angularVelocity, delta).normalize();
    sphere.applyQuaternion(quaternion);

    plane1.position.x += angularVelocity.z * delta;
    plane1.position.z -= angularVelocity.x * delta;
    plane1.position.x = plane1.position.x % 10;
    plane1.position.z = plane1.position.z % 10;

    render();
}

// Animate
animate();