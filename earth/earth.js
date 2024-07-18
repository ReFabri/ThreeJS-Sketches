import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import getStarfield from "./src/getStarfield.js";
window.THREE = THREE;
const w = window.innerWidth;
const h = window.innerHeight;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * (Math.PI / 180);
scene.add(earthGroup);
const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1, 16);
const material = new THREE.MeshStandardMaterial({
  map: loader.load("./textures/00_earthmap1k.jpg"),
});

const earthMesh = new THREE.Mesh(geometry, material);
earthGroup.add(earthMesh);

const stars = getStarfield({ numStars: 1000 });
scene.add(stars);

// const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
// scene.add(hemiLight);

const sunLight = new THREE.DirectionalLight(0xffffff);
sunLight.position.set(-2, -0.5, 1.5);
scene.add(sunLight);

function animate() {
  requestAnimationFrame(animate);

  earthMesh.rotation.y += 0.002;
  renderer.render(scene, camera);
  controls.update();
}

animate();
