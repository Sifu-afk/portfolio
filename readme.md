    display: flex;
    flex-direction: row-reverse;


    max-width: fit-content;
    margin-inline: auto;
    border: solid 1px purple;
    height: 20%;
    width: 20%;












    import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// Create Scene & Camera
const scene = new THREE.Scene();
const container = document.getElementById("container3D");

const camera = new THREE.PerspectiveCamera(
  75,
  container.clientWidth / container.clientHeight,
  0.1,
  1000
);
camera.position.set(0, 120, 230); // Set initial camera position

// Renderer
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Lights
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(2, 2, 2);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

// Load GLB Model with XHR progress
const loader = new GLTFLoader();
const modelPath = "models/scene.glb"; // Replace with your model path
let object;

loader.load(
  modelPath,
  (gltf) => {
    object = gltf.scene;
    object.scale.set(1, 1, 1); // Default scale
    scene.add(object);

    // Adjust model scale to fit inside the container
    fitModelToContainer(object);
  },
  (xhr) => {
    console.log(`Loading: ${Math.round((xhr.loaded / xhr.total) * 100)}%`);
  },
  (error) => {
    console.error("GLB Load Error:", error);
  }
);

// Function to fit the model inside the container
function fitModelToContainer(object) {
  const boundingBox = new THREE.Box3().setFromObject(object);
  const modelWidth = boundingBox.max.x - boundingBox.min.x;
  const modelHeight = boundingBox.max.y - boundingBox.min.y;

  // Adjust scale of the model based on the container's dimensions
  const scaleX = container.clientWidth / modelWidth;
  const scaleY = container.clientHeight / modelHeight;
  const scale = Math.min(scaleX, scaleY);

  object.scale.set(scale, scale, scale); // Apply the calculated scale
}

// Animation Loop - Spins automatically
function animate() {
  requestAnimationFrame(animate);
  if (object) object.rotation.y += 0.02; // Adjust rotation speed here
  renderer.render(scene, camera);
}

animate();

// Resize Handling (Keeps model inside container)
window.addEventListener("resize", () => {
  const width = container.clientWidth;
  const height = container.clientHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  // Adjust model scale to fit when window is resized
  if (object) fitModelToContainer(object);
});
