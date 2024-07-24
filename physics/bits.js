import { EffectComposer } from "jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "jsm/postprocessing/UnrealBloomPass.js";

const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 1.5, 0.4, 100);
bloomPass.threshold = 0.002;
bloomPass.strength = 2.0;
bloomPass.radius = 0;
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

import { OrbitControls } from "jsm/controls/OrbitControls.js";

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

controls.update();

import { getBody, getMouseBall } from "./getBodies.js";

const body = getBody(RAPIER, world);
const mouseBall = getMouseBall(RAPIER, world);
scene.add(mouseBall.mesh);

bodies.forEach((b) => {
  b.update();
});
mouseBall.update(mousePos);

import RAPIER from "https://cdn.skypack.dev/@dimforge/rapier3d-compat@0.11.2";

await RAPIER.init();
let gravity = { x: 0.0, y: 0, z: 0.0 };
let world = new RAPIER.World(gravity);

world.step();
