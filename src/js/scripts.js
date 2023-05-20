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
document.body.appendChild(renderer.domElement);

// Controls
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

// Plane
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100, 100, 100),
    new THREE.MeshBasicMaterial({ 
        color: 0xAAAAAA,
        wireframe: true
    })
);
plane.position.y = -2;
plane.rotation.x = -0.5 * Math.PI;
scene.add(plane);

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

const quaternion = new THREE.Quaternion();
const angularVelocity = new THREE.Vector3(-1, 0, 0);
const time = new THREE.Clock();
let delta = 0;

function render() {
    renderer.render(scene, camera);
}

function animate() {
    requestAnimationFrame(animate);

    delta = time.getDelta();

    if (keyMap['KeyW']) angularVelocity.x -= delta * 5;
    if (keyMap['KeyS']) angularVelocity.x += delta * 5;
    if (keyMap['KeyA']) angularVelocity.z += delta * 5;
    if (keyMap['KeyD']) angularVelocity.z -= delta * 5;

    quaternion.setFromAxisAngle(angularVelocity, delta).normalize();
    sphere.applyQuaternion(quaternion);

    plane.position.x += angularVelocity.z * delta;
    plane.position.z -= angularVelocity.x * delta;
    plane.position.x = plane.position.x % 10;
    plane.position.z = plane.position.z % 10;
    
    render();
}

animate();