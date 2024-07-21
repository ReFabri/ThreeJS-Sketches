import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import spline from "./spline.js";

const w = window.innerWidth;
const h = window.innerHeight;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.3);
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(w, h);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

const tubeGeometry = new THREE.TubeGeometry(spline, 222, 0.65, 16, true);
// const tubeMaterial = new THREE.MeshBasicMaterial({
//   color: 0x0099ff,
//   side: THREE.DoubleSide,
//   wireframe: true,
// });

// const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
// scene.add(tube);

const lineGeometry = new THREE.BufferGeometry().setFromPoints(
  spline.getPoints(100)
);
const edges = new THREE.EdgesGeometry(tubeGeometry, 0.1);
const lineMaterial = new THREE.LineBasicMaterial({ color: 0x0099ff });
const tubeLines = new THREE.LineSegments(edges, lineMaterial);
scene.add(tubeLines);

function updateCamera(t) {
  const time = t * 0.1;
  const looptime = 10 * 1000;
  const p = (time % looptime) / looptime;
  const pos = tubeGeometry.parameters.path.getPointAt(p);
  const lookAt = tubeGeometry.parameters.path.getPointAt((p + 0.01) % 1);
  camera.position.copy(pos);
  camera.lookAt(lookAt);
}

function animate(t = 0) {
  requestAnimationFrame(animate);
  updateCamera(t);
  renderer.render(scene, camera);
  controls.update();
}

animate();
