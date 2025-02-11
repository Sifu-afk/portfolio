// 3Dimages.js

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Create Scene & Camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 5); // Position the camera

// Renderer
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
const container = document.getElementById('container3D');

// Set the size of the renderer based on container's size
function resizeRenderer() {
  const width = container.offsetWidth;
  const height = container.offsetHeight;

  renderer.setSize(width, height);
  camera.aspect = width / height; // Update aspect ratio based on container size
  camera.updateProjectionMatrix(); // Update camera's projection matrix
}

resizeRenderer(); // Call on load to set initial size
container.appendChild(renderer.domElement);

// Lights
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(2, 2, 2);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

// OrbitControls (camera controls)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = false; // Disable zooming with scroll

// Load GLB Model
const loader = new GLTFLoader();
const modelPath = 'models/scene.glb'; // Make sure this is correct
let object;

loader.load(
  modelPath,
  (gltf) => {
    object = gltf.scene;
    object.scale.set(1, 1, 1); // Ensure the model scale stays constant
    scene.add(object);
    adjustModelScale(); // Adjust model scale after loading
  }
  (xhr) => {
    console.log(`Loading: ${Math.round((xhr.loaded / xhr.total) * 100)}%`);
  },
  (error) => {
    console.error('GLB Load Error:', error);
  }
);

// Adjust the scale of the model to fit the height of the container
function adjustModelScale() {
  const containerHeight = container.offsetHeight;
  const modelHeight = getModelHeight(object); // Get the height of the model
  const scaleFactor = containerHeight / modelHeight; // Calculate scale factor to fit height

  object.scale.set(scaleFactor, scaleFactor, scaleFactor); // Apply scale to the model
}

// Get the height of the model (bounding box method)
function getModelHeight(model) {
  const box = new THREE.Box3().setFromObject(model);
  const size = new THREE.Vector3();
  box.getSize(size);
  return size.y; // Height is along the Y-axis
}

// Scroll Rotation (Only Y-axis)
let scrollSpeed = 0.005; // Adjust scroll speed
let scrollAmount = 0; // Track scroll amount

document.addEventListener('wheel', (event) => {
  scrollAmount += event.deltaY * scrollSpeed;
  if (object) {
    object.rotation.y = scrollAmount; // Apply rotation only on Y-axis
  }
});

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  controls.update(); // Ensure smooth damping of OrbitControls
  renderer.render(scene, camera);
}

animate();

// Resize Handling (Fit inside the div)
window.addEventListener('resize', resizeRenderer);
