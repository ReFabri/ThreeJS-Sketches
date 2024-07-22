import * as THREE from "three";
import spline from "./spline.js";
import { EffectComposer } from "jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "jsm/postprocessing/UnrealBloomPass.js";

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

const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass();
bloomPass.threshold = 0;
bloomPass.strength = 7;
bloomPass.radius = 0.5;
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

const tubeGeometry = new THREE.TubeGeometry(spline, 222, 0.65, 16, true);

const edges = new THREE.EdgesGeometry(tubeGeometry, 0.2);
const lineMaterial = new THREE.LineBasicMaterial({ color: 0x0099ff });
const tubeLines = new THREE.LineSegments(edges, lineMaterial);
scene.add(tubeLines);

const numBoxes = 55;

const size = 0.075;
const boxGeometry = new THREE.BoxGeometry(size, size, size);
for (let i = 0; i < numBoxes; i++) {
  const p = (i / numBoxes + Math.random() * 0.1) % 1;
  const pos = tubeGeometry.parameters.path.getPointAt(p);
  pos.x += Math.random() * 0.2 - 0.1;
  pos.z += Math.random() * 0.2 - 0.1;
  const rote = new THREE.Vector3(
    Math.random() * Math.PI,
    Math.random() * Math.PI,
    Math.random() * Math.PI
  );
  const edges = new THREE.EdgesGeometry(boxGeometry, 0.2);
  const color = new THREE.Color().setHSL(p, 1, 0.5);
  const lineMaterial = new THREE.LineBasicMaterial({ color });
  const boxLines = new THREE.LineSegments(edges, lineMaterial);
  boxLines.position.copy(pos);
  boxLines.rotation.setFromVector3(rote);
  scene.add(boxLines);
}

function updateCamera(t) {
  const time = t * 0.1;
  const loopTime = 6 * 1000;
  const p = (time % loopTime) / loopTime;
  const pos = tubeGeometry.parameters.path.getPointAt(p);
  const lookAt = tubeGeometry.parameters.path.getPointAt((p + 0.01) % 1);
  camera.position.copy(pos);
  camera.lookAt(lookAt);
}

function animate(t = 0) {
  requestAnimationFrame(animate);
  updateCamera(t);
  composer.render(scene, camera);
}

animate();
