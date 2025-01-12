import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import WebGL from "three/addons/capabilities/WebGL.js";
import gsap from "gsap";

if (WebGL.isWebGL2Available()) {
  //Create scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x009a49);

  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  //Create camera
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
  //const camera = new THREE.OrthographicCamera(-1 * aspectRatio, 1 * aspectRatio, 1, -1, 0.1, 100);
  scene.add(camera);
  //camera.position.x = 1;
  //camera.position.y = 1;
  camera.position.z = 3;

  //Cursor moves
  const cursor = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  };

  window.addEventListener("mousemove", (event) => {
    cursor.targetX = event.clientX / sizes.width - 0.5;
    cursor.targetY = -(event.clientY / sizes.height - 0.5); // Note the negative sign
  });

  //Add Canvas
  const canvas = document.querySelector("canvas.webgl");

  //Create renderer
  const renderer = new THREE.WebGLRenderer({ canvas: canvas });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio); // For sharper rendering

  //Add orbit controls
  const controls = new OrbitControls(camera, canvas);
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
  cube.position.set(0, 0, 0);

  //Scale cube
  cube.scale.set(1, 1, 1);

  //Add axes helper
  //const axesHelper = new THREE.AxesHelper();
  //scene.add(axesHelper);

  //Clock
  //This is intended to ensure same frame rate regardless of computer performance
  const clock = new THREE.Clock();

  //Testing the use of gsap library (which has its own tick built in)
  //gsap.to(cube.position, { duration: 1, delay: 1, x: 2 });

  //Animation loop
  function animate() {
    const elapsedTime = clock.getElapsedTime(); //Time elapsed since last frame

    controls.update(); //for orbit

    // Gentle automatic rotation when not interacting
    if (!controls.isDragging) {
      //Multiply rotation speed by deltaTime
      cube.rotation.x = elapsedTime * 0.5;
      cube.rotation.y = elapsedTime * 0.5;
      cube.position.y = Math.sin(elapsedTime) * 0.25;
    }

    //Update camera
    // cursor.x += (cursor.targetX - cursor.x) * 0.1;
    // cursor.y += (cursor.targetY - cursor.y) * 0.1;

    // camera.position.x = Math.sin(cursor.x * Math.PI) * 3;
    // camera.position.y = cursor.y * 3;
    // camera.lookAt(cube.position);

    renderer.render(scene, camera);
  }
  renderer.setAnimationLoop(animate);

  // Handle window resize
  window.addEventListener("resize", () => {
    // Update sizes object with new dimensions
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Optional: limit pixel ratio for performance
  });
} else {
  const warning = WebGL.getWebGL2ErrorMessage();
  document.getElementById("container").appendChild(warning);
}
