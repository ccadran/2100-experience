import * as THREE from "three";
import { gsap } from "gsap";

interface CameraParams {
  startPosition?: THREE.Vector3;
  endPosition?: THREE.Vector3;
  fov?: number;
  zoomRangeMultiplier?: number;
}

export default class Camera {
  instance: THREE.PerspectiveCamera;
  startPosition: THREE.Vector3;
  endPosition: THREE.Vector3;
  zoomRangeMultiplier: number;
  constructor({
    startPosition = new THREE.Vector3(0, 38, 60),
    endPosition = new THREE.Vector3(0, 28, 40),
    fov = 75,
    zoomRangeMultiplier = 0.1,
  }: CameraParams = {}) {
    this.startPosition = startPosition;
    this.endPosition = endPosition;
    this.zoomRangeMultiplier = zoomRangeMultiplier;
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

  moveForward() {
    if (this.instance.position.z <= 5) return;
    this.instance.position.z -= 0.5;
    this.instance.lookAt(0, 0, 0);
  }
  moveBack() {
    this.instance.position.z += 0.5;
    this.instance.lookAt(0, 0, 0);
  }
  moveLeft() {
    this.instance.position.x -= 0.5;
    this.instance.lookAt(0, 0, 0);
  }
  moveRight() {
    this.instance.position.x += 0.5;
    this.instance.lookAt(0, 0, 0);
  }
  moveDown(percent: number) {
    const target = percent;
    if (this.instance.position.y <= 5) return;
    this.instance.position.y = target;
    console.log(this.instance.position.y);

    this.instance.lookAt(0, 0, 0);
  }
  moveUp(percent: number) {
    const target = percent;
    this.instance.position.y = target;
    this.instance.lookAt(0, 0, 0);
  }
}
