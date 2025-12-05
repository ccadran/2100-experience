import * as THREE from "three";
import { gsap } from "gsap";
import { lerp } from "../utils";

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
  targetPosition: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  isMoving: boolean;
  lerpFactor: number = 0.1;
  strengthMultiplier: number = 0.1;
  movementState: any = { forward: 0, back: 0, left: 0, right: 0 };
  lookAtZ: number = 60;
  constructor({
    startPosition = new THREE.Vector3(0, 38, 60),
    endPosition = new THREE.Vector3(0, 28, 40),
    fov = 75,
    zoomRangeMultiplier = 0.1,
  }: CameraParams = {}) {
    this.startPosition = startPosition;
    this.endPosition = endPosition;
    this.zoomRangeMultiplier = zoomRangeMultiplier;
    this.isMoving = false;

    const container = document.querySelector(".webgl")!;

    this.instance = new THREE.PerspectiveCamera(
      fov,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );

    this.instance.position.copy(startPosition);
    this.instance.lookAt(0, 0, 0);

    console.log(this.instance.position);

    this.targetPosition.copy(this.instance.position);
    this.startLoop();
  }

  entryAnim() {
    // gsap.fromTo(
    //   this.instance.position,
    //   {
    //     x: this.startPosition.x,
    //     y: this.startPosition.y,
    //     z: this.startPosition.z,
    //   },
    //   { x: this.endPosition.x, y: this.endPosition.y, z: this.endPosition.z }
    // );
  }

  startLoop() {
    const loop = () => {
      if (this.movementState.forward > 0) {
        const delta = this.strengthMultiplier * this.movementState.forward;
        this.targetPosition.z -= delta;
      }
      if (this.movementState.back > 0) {
        const delta = this.strengthMultiplier * this.movementState.back;
        this.targetPosition.z += delta;
      }
      if (this.movementState.left > 0) {
        const delta = this.strengthMultiplier * this.movementState.left;
        this.targetPosition.x -= delta;
      }
      if (this.movementState.right > 0) {
        const delta = this.strengthMultiplier * this.movementState.right;
        this.targetPosition.x += delta;
      }

      this.instance.position.x = lerp(
        this.instance.position.x,
        this.targetPosition.x,
        this.lerpFactor
      );
      this.instance.position.z = lerp(
        this.instance.position.z,
        this.targetPosition.z,
        this.lerpFactor
      );

      this.instance.position.y = lerp(
        this.instance.position.y,
        this.targetPosition.y,
        this.lerpFactor
      );

      this.instance.lookAt(
        this.instance.position.x,
        0,
        this.instance.position.z - this.lookAtZ
      );

      requestAnimationFrame(loop);
    };
    loop();
  }

  moveForward(strength: number) {
    this.movementState.forward = strength;
  }
  moveBack(strength: number) {
    this.movementState.back = strength;
  }
  moveLeft(strength: number) {
    this.movementState.left = strength;
  }
  moveRight(strength: number) {
    this.movementState.right = strength;
  }

  moveDown(percent: number) {
    if (this.instance.position.y <= 30) return;
    console.log(this.instance.position.y);

    this.targetPosition.y = this.instance.position.y - percent / 10;
  }
  moveUp(percent: number) {
    this.targetPosition.y = this.instance.position.y + percent / 10;
  }

  stopMoving() {
    this.movementState.forward = 0;
    this.movementState.back = 0;
    this.movementState.left = 0;
    this.movementState.right = 0;
  }
}
