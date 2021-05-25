import "./style.css";
import * as THREE from "three";
import data from "./data.json";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

const portalTexture = new THREE.TextureLoader().load("/rick.jpg");
const normalTexture = new THREE.TextureLoader().load("/normal.jpg");

const geometry = new THREE.TorusGeometry(6, 1, 25, 100);
const material = new THREE.MeshStandardMaterial({
  map: portalTexture,
  normalMap: normalTexture,
});
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xebecdc);
scene.add(pointLight, ambientLight);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: portalTexture,
  });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

const spaceTexture = new THREE.TextureLoader().load("/bg.jpg");
scene.background = spaceTexture;

const taranTexture = new THREE.TextureLoader().load("/profile.jpg");

const taran = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({ map: taranTexture })
);

scene.add(taran);

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(2, 32, 32),
  new THREE.MeshStandardMaterial({
    map: portalTexture,
    normalMap: normalTexture,
  })
);

scene.add(moon);

moon.position.z = 30;
moon.position.setX(-10);

taran.position.z = -5;
taran.position.x = 2;

torus.position.z = -4;

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  taran.rotation.y += 0.01;
  taran.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.005;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  moon.rotation.x += 0.005;

  renderer.render(scene, camera);
}

animate();

const projects = document.querySelector("#projects");

function addProject(data) {
  const project = document.createElement("div");
  project.classList.add(
    "max-w-3xl",
    "rounded",
    "p-5",
    "bg-white",
    "text-black",
    "flex",
    "flex-col"
  );

  const heading = document.createElement("h5");
  heading.classList.add("text-3xl", "font-medium");
  heading.textContent = data.project_name;
  project.append(heading);

  const paragraph = document.createElement("p");
  paragraph.classList.add("py-5", "text-lg", "text-gray-800");
  paragraph.textContent = data.paragraph;
  project.append(paragraph);

  const buttons = document.createElement("div");
  buttons.classList.add("mt-auto", "mb-5", "space-x-4", "flex", "items-center");

  const demoBTN = document.createElement("a");
  demoBTN.classList.add(
    "border",
    "bg-gradient-to-l",
    "from-blue-700",
    "via-blue-800",
    "to-gray-600",
    "px-5",
    "text-white",
    "py-2"
  );
  demoBTN.textContent = "See Live";
  demoBTN.href = data.live_url;
  buttons.append(demoBTN);

  const sourceBTN = document.createElement("a");
  sourceBTN.classList.add("text-blue-800");
  sourceBTN.textContent = "Source Code";
  sourceBTN.href = data.source_code;
  buttons.append(sourceBTN);

  project.append(buttons);

  const img = document.createElement("img");
  img.classList.add("w-full", "rounded", "mt-auto");
  img.src = data.img;

  project.append(img);

  projects.append(project);
}

data.forEach((project) => addProject(project));
