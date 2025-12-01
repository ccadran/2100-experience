import * as THREE from "three";
import { gsap } from "gsap";

interface CameraParams {
  startPosition?: THREE.Vector3;
  endPosition?: THREE.Vector3;
  fov?: number;
}

export default class Camera {
  instance: THREE.PerspectiveCamera;
  startPosition: THREE.Vector3;
  endPosition: THREE.Vector3;
  constructor({
    startPosition = new THREE.Vector3(0, 38, 60),
    endPosition = new THREE.Vector3(0, 28, 40),
    fov = 75,
  }: CameraParams = {}) {
    this.startPosition = startPosition;
    this.endPosition = endPosition;
    const container = document.querySelector(".webgl")!;

    this.instance = new THREE.PerspectiveCamera(
      fov,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );

    this.instance.position.copy(startPosition);
    this.instance.lookAt(0, 0, 0);
  }

  entryAnim() {
    gsap.fromTo(
      this.instance.position,
      {
        x: this.startPosition.x,
        y: this.startPosition.y,
        z: this.startPosition.z,
      },
      { x: this.endPosition.x, y: this.endPosition.y, z: this.endPosition.z }
    );
  }
}
