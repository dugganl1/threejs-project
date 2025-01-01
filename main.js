import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import WebGL from "three/addons/capabilities/WebGL.js";

if (WebGL.isWebGL2Available()) {
  //Create scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x009a49);

  //Create camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  //Create renderer
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio); // For sharper rendering
  document.body.appendChild(renderer.domElement);

  //Add orbit controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // Add smooth damping effect
  controls.dampingFactor = 0.05;

  //Add lights
  // Add ambient light (general room lighting)
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // white light, half intensity
  scene.add(ambientLight);

  // Add directional light (like sunlight)
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // white light, full intensity
  directionalLight.position.set(5, 5, 5); // Position the light
  scene.add(directionalLight);

  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(5, 5, 5);
  scene.add(pointLight);

  //Create a cube
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshPhongMaterial({
    color: 0xffb81c,
    shininess: 100,
    flatShading: false,
  });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  camera.position.z = 3;

  //Animation loop
  function animate() {
    controls.update(); //for orbit

    // Gentle automatic rotation when not interacting
    if (!controls.isDragging) {
      cube.rotation.x += 0.003;
      cube.rotation.y += 0.003;
    }

    renderer.render(scene, camera);
  }
  renderer.setAnimationLoop(animate);

  // Handle window resize
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
} else {
  const warning = WebGL.getWebGL2ErrorMessage();
  document.getElementById("container").appendChild(warning);
}
