import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// Global variables
let scene, camera, renderer, object, loader, container;

const init3DScene = () => {
  // Get the container div
  container = document.getElementById("container3D");

  // Create Scene & Camera
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight, // Aspect ratio based on container size
    0.1,
    1000
  );
  camera.position.set(0, 120, 1000); // Initial camera position

  // Renderer
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight); // Size based on container
  container.appendChild(renderer.domElement); // Attach renderer to container

  // Lights
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(2, 2, 2);
  scene.add(light);

  const ambientLight = new THREE.AmbientLight(0x333333);
  scene.add(ambientLight);

  // Load GLB Model
  loader = new GLTFLoader();
  const modelPath = "models/scene.glb"; // Ensure path is correct
  loader.load(
    modelPath,
    (gltf) => {
      object = gltf.scene;
      scene.add(object);
      fitModelToContainer(object); // Fit model inside the container
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

    // Calculate scale factor while maintaining the aspect ratio
    const scaleX = container.clientWidth / modelWidth;
    const scaleY = container.clientHeight / modelHeight;
    const scale = Math.min(scaleX, scaleY); // Ensure it fits without distortion

    object.scale.set(scale, scale, scale); // Apply the scale

    // Adjust camera position to fit the model in the container
    adjustCameraPosition();
  }

  // Adjust camera position based on the model size
  function adjustCameraPosition() {
    const boundingBox = new THREE.Box3().setFromObject(object);
    const modelHeight = boundingBox.max.y - boundingBox.min.y;
    camera.position.z = modelHeight * 1; // Adjust camera distance based on model height
  }

  // Resize Handling (Keeps model inside container and adjusts camera)
  window.addEventListener("resize", () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height); // Update renderer size
    camera.aspect = width / height;  // Update camera aspect ratio
    camera.updateProjectionMatrix();

    // Adjust model scale and camera position to fit when window is resized
    if (object) {
      fitModelToContainer(object);
      adjustCameraPosition();
    }
  });

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);

    if (object) object.rotation.y += 0.05; // Auto rotate the model
    renderer.render(scene, camera);
  }

  animate();
};

// Start the 3D scene only after the button is clicked
document.getElementById("startButton").addEventListener("click", () => {
  init3DScene();
});
