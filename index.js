import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";

import getStarfield from "./src/getStarfield.js";
import { getFresnelMat } from "./src/getFresnelMat.js";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 2;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const earthGroup = new THREE.Group();
earthGroup.rotation.z = (-23.4 * Math.PI) / 180;
scene.add(earthGroup);
new OrbitControls(camera, renderer.domElement);
const detail = 12;
const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1, detail);
const material = new THREE.MeshPhongMaterial({
  map: loader.load("./textures/00_earthmap1k.jpg"),
  specularMap: loader.load("./textures/02_earthspec1k.jpg"),
  bumpMap: loader.load("./textures/01_earthbump1k.jpg"),
  bumpScale: 0.04,
});
const earthMesh = new THREE.Mesh(geometry, material);
earthGroup.add(earthMesh);

const lightsMat = new THREE.MeshBasicMaterial({
  map: loader.load("./textures/03_earthlights1k.jpg"),
  blending: THREE.AdditiveBlending,
});
const lightsMesh = new THREE.Mesh(geometry, lightsMat);
earthGroup.add(lightsMesh);

const cloudsMat = new THREE.MeshStandardMaterial({
  map: loader.load("./textures/04_earthcloudmap.jpg"),
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending,
  alphaMap: loader.load("./textures/05_earthcloudmaptrans.jpg"),
  // alphaTest: 0.3,
});
const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
cloudsMesh.scale.setScalar(1.003);
earthGroup.add(cloudsMesh);

const fresnelMat = getFresnelMat();
const glowMesh = new THREE.Mesh(geometry, fresnelMat);
glowMesh.scale.setScalar(1.01);
earthGroup.add(glowMesh);

const stars = getStarfield({ numStars: 2000 });
scene.add(stars);

const sunLight = new THREE.DirectionalLight(0xffffff);
sunLight.position.set(-2, 0.5, 1.5);
scene.add(sunLight);

let variable = 1;
function animate() {
  requestAnimationFrame(animate);
  earthMesh.rotation.y = variable;
  lightsMesh.rotation.y = variable;
  cloudsMesh.rotation.y = variable;
  glowMesh.rotation.y = variable;
  // stars.rotation.y -= 0.0002;
  renderer.render(scene, camera);
}
animate();
function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", handleWindowResize, false);

const buttons = document.querySelector(".button-collection");
for (let i = 0; i < buttons.children.length; i++) {
  buttons.children[i].addEventListener("click", function () {
    changeCountry(buttons.children[i].textContent);
  });
}

function changeCountry(text) {
  let coordinates = { Netherlands: [0.07310324298965885, 0.9812947968639684] };
  // console.log(earthMesh.rotation.y);
  console.log(coordinates[text][0]);
  camera.position.set(coordinates[text][0], coordinates[text][1], 1);
  // camera.lookAt(
  //   new THREE.Vector3(coordinates[text][0], coordinates[text][1], 0.5)
  // );
  console.log(camera.position);
  console.log(text);
  // earthMesh.rotation.y = variable;
  // lightsMesh.rotation.y = variable;
  // cloudsMesh.rotation.y = variable;
  // glowMesh.rotation.y = variable;
  // stars.rotation.y -= 0.0002;
  renderer.render(scene, camera);
}
