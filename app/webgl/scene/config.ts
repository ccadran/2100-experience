import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useWorld } from "~/stores/world";
import { useConfig } from "~/stores/configurator";

export function initScene() {
  const worldStore = useWorld();
  const container = document.querySelector(".webgl");
  if (!container) return;

  const globalScene = new THREE.Scene();
  globalScene.background = new THREE.Color(0xaaaaaa);

  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 8, 10);
  camera.lookAt(0, 0, 0);

  const canvas = container.querySelector("canvas");
  if (!canvas) return;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 10, 7.5);
  globalScene.add(light);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  globalScene.add(ambientLight);

  const loader = new GLTFLoader();
  loader.load("/3d/states.glb", (gltf: any) => {
    globalScene.add(gltf.scene);
    const target = globalScene.getObjectByName("Scene");

    worldStore.scene = target as THREE.Group;

    const sceneChildrens = worldStore.scene?.children;

    sceneChildrens?.forEach((child) => {
      if (child.name.includes("group")) {
        worldStore.sceneParts.push(child);
      }
    });
    hideElements();
  });

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(globalScene, camera);
  }
  animate();

  window.addEventListener("resize", () => {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}

export function hideElements() {
  const worldStore = useWorld();
  worldStore.hiddenSceneParts = [];

  const sceneChildrens = worldStore.scene?.children;

  sceneChildrens?.forEach((child) => {
    if (child.name.includes("group")) {
      worldStore.hiddenSceneParts.push(child);
      child.visible = false;
    }
  });
  console.log(worldStore.hiddenSceneParts);
}

export function revealElements() {
  const configStore = useConfig();
  const worldStore = useWorld();

  if (configStore.configParams.currentStep <= configStore.configParams.step) {
    const randIndex = Math.floor(
      Math.random() * worldStore.hiddenSceneParts.length
    );
    worldStore.hiddenSceneParts[randIndex].visible = true;
    configStore.configParams.currentStep += 1;
  }
}
