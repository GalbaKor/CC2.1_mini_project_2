import * as THREE from "./three.js";
//import * as Tone from "tone";
import { OrbitControls } from "./OrbitControls.js";
import { planetClass } from "./planets.js";
import { theSun } from "./sun.js";
//import { Player } from "tone";

let scene, sceneHeight, sceneWidth;
sceneWidth = window.innerWidth;
sceneHeight = window.innerHeight;
let camera, renderer, orbit;
let colour, intensity, light;
let ambientLight;
let clock, delta, interval;
let planetLoad;
let startButton = document.getElementById("startButton"); //adds startButton variable using html element
startButton.addEventListener("click", init); //event listenener that when clicked, does the init function

function init() {
  //initiatilises the scene
  sceneCreate();
  cameraCreate();
  orbitControl();

  /*createWireCube();*/

  clock = new THREE.Clock();
  delta = 0;
  interval = 1 / 2;

  planetLoad = new planetClass(scene);
  new theSun(scene);

  play();
  // attempt at making a pivot point for the cube
}
function sceneCreate() {
  //creates the scene by removing overlay and setting up a canvas as large and wide as the window
  //remove overlay
  let overlay = document.getElementById("overlay");
  overlay.remove();
  //create our scene
  sceneWidth = window.innerWidth;
  sceneHeight = window.innerHeight;
  scene = new THREE.Scene();
  //window resizer
  window.addEventListener("resize", onWindowResize, false); //if screen is resized, call the onWindowResize function, else do nothing
}
function onWindowResize() {
  //sets the sceneHeight and Width to be the same as the window, relocates camera to center of screen
  //resize & align
  sceneHeight = window.innerHeight;
  sceneWidth = window.innerWidth;
  renderer.setSize(sceneWidth, sceneHeight);
  camera.aspect = sceneWidth / sceneHeight;
  camera.updateProjectionMatrix();
}
function cameraCreate() {
  //creates a camera in the middle of the screen
  //create camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(70, 0, 2.5);

  //specify our renderer and add it to our document
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  //lighting
  colour = 0xffffff;
  intensity = 1;
  light = new THREE.DirectionalLight(colour, intensity);
  light.position.set(-1, 2, 4);
  scene.add(light);
  ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
}
function orbitControl() {
  //create the orbit controls instance so we can use the mouse move around our scene
  orbit = new OrbitControls(camera, renderer.domElement);
  orbit.enabled = true;
  orbit.enableZoom = true;
}
function play() {
  renderer.setAnimationLoop(() => {
    update();
    render();
  });
}
function update() {
  orbit.update();
  //update stuff in here
  delta += clock.getDelta();
  planetLoad.update();
  //Sun.update();
  if (delta > interval) {
    delta = delta % interval;
  }
}
function render() {
  renderer.render(scene, camera);
}
