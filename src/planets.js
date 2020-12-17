import * as THREE from "./three.js";
//import { Scene } from "three";
import { Noise } from "./perlin.js";
import { GUI } from "./dat.gui.js";
//import { MathUtils } from "three";

let clock;
let control;

export class planetClass {
  //this.collidable = true;
  constructor(scene) {
    this.numPlanets = 7; // 7 tracks, 7 planets. RIP Neptune, Uranus (and Pluto? still a planet in my heart)

    // adds an invisible object at 0,0,0.  Then I add each planet to the pivotPoint and by rotating the y of the pivotPoint, I rotate everything attached to it.
    this.pivotPoint = new THREE.Object3D();
    scene.add(this.pivotPoint);

    // don't focus on the planets, radius of 3 for all planets as I couldn't figure out how to space randomly sized planets inside the "for"
    // planet geometry is a sphere geometry with a radius of 3 and enough segments that it looks completely smooth
    this.heroModel = false;

    //this.radius = 3; //THREE.MathUtils.randInt(3, 3);
    this.planetGroup = new THREE.Group();
    this.planetArray = []; // array for console logging

    for (var i = 0; i <= this.numPlanets; i++) {
      if (i === 1) {
        this.texture = new THREE.TextureLoader().load(
          "/src/textures/2k_mercury.jpg"
        );
        this.planetGeometry = new THREE.SphereGeometry(3, 100, 100);
      } else if (i === 2) {
        this.texture = new THREE.TextureLoader().load(
          "/src/textures/2k_venus_atmosphere.jpg"
        );
        this.planetGeometry = new THREE.SphereGeometry(5, 100, 100);
      } else if (i === 3) {
        this.texture = new THREE.TextureLoader().load(
          "/src/textures/2k_earth_daymap.jpg"
        );
        this.planetGeometry = new THREE.SphereGeometry(6, 100, 100);
      } else if (i === 4) {
        this.texture = new THREE.TextureLoader().load(
          "/src/textures/2k_mars.jpg"
        );
        this.planetGeometry = new THREE.SphereGeometry(3, 100, 100);
      } else if (i === 5) {
        this.texture = new THREE.TextureLoader().load(
          "/src/textures/2k_jupiter.jpg"
        );
        this.planetGeometry = new THREE.SphereGeometry(7, 100, 100);
      } else if (i === 6) {
        this.texture = new THREE.TextureLoader().load(
          "/src/textures/2k_saturn.jpg"
        );
        this.planetGeometry = new THREE.SphereGeometry(6, 100, 100);
      } else if (i === 7) {
        this.texture = new THREE.TextureLoader().load(
          "/src/textures/2k_eris_fictional.jpg"
        );
        this.planetGeometry = new THREE.SphereGeometry(5, 100, 100);
      }
      this.planetMaterial = new THREE.MeshPhongMaterial({
        map: this.texture
      });

      this.planetArray.push(
        (this.planet[i] = new THREE.Mesh(
          this.planetGeometry,
          this.planetMaterial
        ))
      );
      this.planetArray[i].castShadow = true;
      this.planetArray[i].position.y = 0;
      this.planetArray[i].position.x = 25 + 7 * i * 3;
      this.planetGroup.add(this.planetArray);

      console.log([i]);
    }
    scene.add(this.planetGroup);
    this.pivotPoint.add(this.planetGroup); //have to add the planet to the scene before you can add the planet to the pivot. Adds the whole planet

    control = new (function () {
      this.rotationSpeedY = 0;
      this.noiseAmt = 0;
    })();
    addControls(control);

    function addControls(controlObject) {
      var gui = new GUI();
      gui.add(controlObject, "noiseAmt").min(0).max(10);
      gui.add(controlObject, "rotationSpeedY", -0.02, 0.02, 0.001);
    }
    clock = new THREE.Clock();
  }

  // can't get it so that the noise effects everything in the planetArray.
  // for each object in the array, I want to apply noise to that object

  update() {
    let time = clock.getElapsedTime();
    let noise = new Noise();

    this.pivotPoint.rotation.y += control.rotationSpeedY;

    for (var i = 0; i <= this.planetArray.length; i++) {
      let k = this.planet[i];
      for (var o = 0; o < k.geometry.vertices.length; o++) {
        let p = k.geometry.vertices[o];
        p.normalize().multiplyScalar(
          1 +
            0.3 *
              noise.perlin3(
                p.x * control.noiseAmt + time,
                p.y * control.noiseAmt,
                p.z * control.noiseAmt
              )
        );
      }
      this.planet.geometry.computeVertexNormals();
      this.planet.geometry.normalsNeedUpdate = true;
      this.planet.geometry.verticesNeedUpdate = true;
    }
  }
}
