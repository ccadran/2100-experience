import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import type { userConfigParams } from "~/types/config";
import Camera from "./camera";
import { moveToStep } from "./experience";

export function initScene(): Promise<void> {
  return new Promise((resolve, reject) => {
    const worldStore = useWorld();
    const container = document.querySelector(".webgl");
    if (!container) return;

    const globalScene = new THREE.Scene();
    globalScene.background = new THREE.Color(0xaaaaaa);

    worldStore.camera = new Camera();

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
    loader.load(
      // "/3d/states.glb",
      "/3d/2100-map__V1.glb",
      (gltf: any) => {
        gltf.scene.scale.set(0.1, 0.1, 0.1);
        globalScene.add(gltf.scene);

        const target = globalScene.getObjectByName("Scene");

        worldStore.scene = target as THREE.Group;

        const sceneChildrens = worldStore.scene?.children;

        sceneChildrens?.forEach((child) => {
          if (child.name.includes("group") || child.name.includes("impact")) {
            worldStore.sceneParts.push(child);
          }
        });
        hideElements();
        resolve();
      },
      undefined,
      reject
    );

    function animate() {
      requestAnimationFrame(animate);

      renderer.render(globalScene, worldStore.camera!.instance);
    }
    animate();

    window.addEventListener("resize", () => {
      if (!container) return;
      worldStore.camera!.instance.aspect =
        container.clientWidth / container.clientHeight;
      worldStore.camera!.instance.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });
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
    } else if (child.name.includes("impact")) {
      child.children.forEach((c) => {
        c.visible = false;
      });
    }
  });
}

export function revealElements() {
  const configStore = useConfig();
  const worldStore = useWorld();

  if (configStore.formParams.currentStep <= configStore.formParams.step) {
    if (worldStore.hiddenSceneParts.length < 1) return;
    const randIndex = Math.floor(
      Math.random() * worldStore.hiddenSceneParts.length
    );
    worldStore.hiddenSceneParts[randIndex].visible = true;
    configStore.formParams.currentStep += 1;
    worldStore.hiddenSceneParts.splice(randIndex, 1);
  }
}

export function handleFormValidations(userData: userConfigParams) {
  const configStore = useConfig();
  const finalUserData: any = {};

  const worldStore = useWorld();
  worldStore.camera?.entryAnim();

  Object.entries(userData).forEach(([key, value]) => {
    switch (key) {
      case "plane":
        finalUserData.plane = {
          weight: configStore.worldParams[key].weight,
          percentage: value,
        };
        break;
      case "dailyTransport":
        finalUserData.dailyTransport = {
          weight: configStore.worldParams[key].weight,
          percentage: value,
        };
        break;
      case "food":
        finalUserData.food = {
          weight: configStore.worldParams[key].weight,
          percentage: value,
        };
        break;
      case "energy":
        finalUserData.energy = {
          weight: configStore.worldParams[key].weight,
          percentage: value,
        };
        break;
      case "consumption":
        finalUserData.consumption = {
          weight: configStore.worldParams[key].weight,
          percentage: value,
        };
        break;

      default:
        break;
    }
  });

  configStore.userConfig = finalUserData;

  calculateExperienceSteps();
  setupObjectsData();
  moveToStep(0);
}

function calculateExperienceSteps() {
  const configStore = useConfig();
  const currentYear = configStore.configParams.currentYear;
  const targetYear = configStore.configParams.targetYear;
  const yearsPerStep = configStore.configParams.yearsStep;

  const stepYears: number[] = [currentYear];

  let nextYear = currentYear + yearsPerStep;
  while (nextYear < targetYear - yearsPerStep) {
    stepYears.push(nextYear);
    nextYear += yearsPerStep;
  }

  if (stepYears[stepYears.length - 1] !== targetYear) {
    stepYears.push(targetYear);
  }

  const totalSteps = stepYears.length - 1;

  const worldStateSteps = [];

  const maxTemperature = calculateMaxTemperature();

  for (let i = 0; i <= totalSteps; i++) {
    const progress = i / totalSteps;

    const worldState: any = {
      params: {},
    };
    worldState.year = stepYears[i];
    Object.entries(configStore.userConfig).forEach(([key, value]) => {
      worldState.params[key] = value.percentage * progress;
    });
    worldState.temperature = maxTemperature * progress;
    worldStateSteps.push(worldState);
  }
  configStore.worldStateSteps = worldStateSteps;
}

function calculateMaxTemperature() {
  const configStore = useConfig();

  const globalPercentage = Object.entries(
    configStore.userConfig
  ).reduce<number>((acc, [key, value]) => {
    const weight = value.weight;
    return acc + value.percentage * weight;
  }, 0);

  return (configStore.configParams.maxTemperature * globalPercentage) / 100;
}

function setupObjectsData() {
  const worldStore = useWorld();
  const configStore = useConfig();

  const objectDataMap: Record<string, any> = {
    trees: configStore.objectsData.trees,
    grass: configStore.objectsData.grass,
  };

  worldStore.sceneParts.forEach((scenePart) => {
    const objectType = Object.keys(objectDataMap).find((key) =>
      scenePart.name.includes(key)
    );

    if (objectType) {
      scenePart.children.forEach((child) => {
        child.userData = objectDataMap[objectType];
      });
    }
  });
}
