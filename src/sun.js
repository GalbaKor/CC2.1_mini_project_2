import * as THREE from "./three.js";
//import { Scene } from "three";
//import { Noise } from "noisejs";

export class theSun {
  //this.collidable = true;
  constructor(scene) {
    this.radius = 20;
    this.heroModel = false;
    this.texture = new THREE.TextureLoader().load("/src/textures/2k_sun.jpg");
    this.sunGeometry = new THREE.SphereGeometry(this.radius, 100, 100);
    this.sunMaterial = new THREE.MeshBasicMaterial({ map: this.texture });

    /*this.sunGeometry = new THREE.WireframeGeometry(
      new THREE.SphereGeometry(20, 30, 30)
    );
    this.sunMaterial = new THREE.LineBasicMaterial({
      color: 0xd8d0d1,
      opacity: 0.3,
      blending: THREE.AdditiveBlending
    });*/

    this.sun = new THREE.Mesh(this.sunGeometry, this.sunMaterial);
    this.sun.castShadow = true;
    this.sun.position.y = 0;
    this.sun.position.x = 0;

    scene.add(this.sun);
    console.log("the sun is here");
  }
}
