import * as THREE from "three";
import gsap from "gsap";
import { delay } from "../utils";
import { useAudio } from "~/composables/useAudio";


// camera sound
const { playCamera } = useAudio();

// couleurs du sol
const healthy_color = new THREE.Color("#007411");
const dry_color = new THREE.Color("#a89a02");

import {
  calculateParmasAssetsNumber,
  hideElements,
  hideInstanceChildren,
  updateCity,
} from "./elementsManager";
import type { impactType } from "~/types/config";

export async function moveToStep(target: number | "next" | "previous") {
  const worldStore = useWorld();
  const configStore = useConfig();
  const uiStore = useUi();
  await uiStore.cloudsTransition?.showClouds();

  let targetStep: number = configStore.currentStep;
  if (typeof target === "number") {
    targetStep = target;
  } else if (target === "next") {
    targetStep += 1;
  } else if (target === "previous") {
    targetStep -= 1;
  }
  if (targetStep <= configStore.worldStateSteps.length - 1 && targetStep >= 0) {
    configStore.currentStep = targetStep;
  } else {
    alert("THIS STEP DOES NOT EXIST");
  }
  const currentStep = configStore.worldStateSteps[configStore.currentStep];

  const currentTemperature = currentStep.temperature;
  updateGroundColor(currentTemperature);
  updateCity(currentTemperature);

  const currentFogValue = currentStep.impacts.fog?.value || 0;

  if (worldStore.environment) {
    worldStore.environment.updateSkyAndFog(
      currentFogValue,
      worldStore.cameraOverlay || undefined,
    );
  }

  worldStore.paramsParts.forEach((part) => {
    const firstChild = part.children[0];

    if (!firstChild) return;

    const currentState = getCurrentState(
      firstChild.userData,
      currentTemperature,
    );

    if (!currentState) return;

    part.children.forEach((child) => {
      if (
        child.name.includes(currentState) &&
        child instanceof THREE.InstancedMesh
      ) {
        child.visible = true;
        calculateParmasAssetsNumber(child);
      } else {
        child.visible = false;
      }
    });
  });

  Object.values(configStore.worldImpacts).forEach((impact) => {
    updateImpact(impact.name, currentStep.impacts[impact.name].value);
  });
  await delay(500);
  await uiStore.cloudsTransition?.hideClouds();
}

function updateImpact(
  type: "fog" | "lake" | "factory" | "rocks" | "fields" | "sheeps" | "chickens",
  evolution: number,
) {
  const worldStore = useWorld();

  switch (type) {
    case "fog":
      // worldStore.impactsParts.fog.update(evolution) //function de la classe fog
      break;
    case "fields":
      const fieldsState = getLevel(evolution);

      worldStore.impactsParts.fields?.children.forEach((child) => {
        if (child.name.includes(fieldsState!)) {
          child.visible = true;
        } else {
          child.visible = false;
        }
      });
      break;
    case "sheeps":
      updateImpactNumber({ name: "sheeps", value: evolution });
      break;
    case "chickens":
      updateImpactNumber({ name: "chickens", value: evolution });
      break;
    case "lake":
      const lakeState = getLevel(evolution);

      worldStore.impactsParts.lake?.children.forEach((child) => {
        if (child.name.includes(lakeState!)) {
          console.log("__________________");
          console.log("Visibilité avant :", child.visible);
          child.visible = true;
          console.log("Visibilité après :", child.visible);
          console.log(child);
        } else {
          child.visible = false;
        }
      });
      console.log(worldStore.impactsParts.lake);

      break;
    default:
      break;
  }
}

function getLevel(evolution: number) {
  if (evolution < 20) return "high";
  if (evolution >= 20 && evolution < 75) return "mid";
  if (evolution >= 75) return "low";
}

export function updateImpactNumber(impact: impactType) {
  const worldStore = useWorld();
  const targetInstancedMesh = worldStore.impactsParts[impact.name];
  console.log(targetInstancedMesh);

  const targetInstances = Math.ceil(
    (targetInstancedMesh.count / 100) * impact.value,
  );

  for (let i = 0; i < targetInstances; i++) {
    hideInstanceChildren(targetInstancedMesh, i);
  }
}

function getCurrentState(
  states: Record<string, number>,
  temperature: number,
): string | null {
  return (
    (Object.entries(states) as [string, number][])
      .sort(([, a], [, b]) => b - a)
      .find(([, threshold]) => temperature >= threshold)?.[0] || null
  );
}

// export function handleCameraZoom(value: number) {
//   const worldStore = useWorld();
//   worldStore.camera?.zoom(value);
// }

export function goToCameraSpot(index: number) {
  playCamera();
  const worldStore = useWorld();
  worldStore.camera?.goToSpot(index);
}

export function resetExperience() {
  const configStore = useConfig();
  const worldStore = useWorld();

  configStore.isFormValidated = false;
  configStore.userConfig = {};
  configStore.worldStateSteps = [];
  configStore.globalPercentage = 0;
  configStore.currentStep = 0;
  hideElements();
  worldStore.camera?.goToSpot(0);
}

// couleur du sol via la temp
function updateGroundColor(currentTemp: number) {
  const worldStore = useWorld();
  const configStore = useConfig();

  if (!worldStore.ground) return;

  const minTemp = configStore.configParams.minTemperature;
  const maxTemp = configStore.configParams.maxTemperature;

  let ratio = (currentTemp - minTemp) / (maxTemp - minTemp);
  ratio = Math.max(0, Math.min(1, ratio));

  const targetColor = new THREE.Color()
    .copy(healthy_color)
    .lerp(dry_color, ratio);

  gsap.to((worldStore.ground.material as THREE.MeshStandardMaterial).color, {
    r: targetColor.r,
    g: targetColor.g,
    b: targetColor.b,
    duration: 1.5,
    ease: "power2.inOut",
  });
}
