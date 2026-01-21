import gsap from "gsap";
import { delay } from "../utils";
import { hideElements } from "./elementsManager";

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

  worldStore.paramsParts.forEach((part) => {
    const firstChild = part.children[0];

    if (!firstChild) return;

    const currentState = getCurrentState(
      firstChild.userData,
      currentTemperature,
    );

    if (!currentState) return;

    part.children.forEach((child) => {
      if (child.name.includes(currentState)) {
        child.visible = true;
      } else {
        child.visible = false;
      }
    });
  });

  Object.values(configStore.worldImpacts).forEach((impact) => {
    updateImpact(impact.name, currentStep.impacts[impact.name]);
  });
  await delay(500);
  await uiStore.cloudsTransition?.hideClouds();
}

function updateImpact(
  type: "fog" | "waterLevel" | "factory" | "rocks",
  evolution: number,
) {
  const worldStore = useWorld();
  switch (type) {
    case "fog":
      // worldStore.impactsParts.fog.update(evolution) //function de la classe fog
      break;
    case "waterLevel":
      const levelWater = getLevel(evolution);
      worldStore.impactsParts.waterLevel?.children.forEach((child) => {
        child.visible = child.name === levelWater;
      });
      break;
    case "factory":
      const levelFactory = getLevel(evolution);
      worldStore.impactsParts.waterLevel?.children.forEach((child) => {
        child.visible = child.name === levelFactory;
      });
      break;
    case "rocks":
      const levelRocks = getLevel(evolution);
      worldStore.impactsParts.waterLevel?.children.forEach((child) => {
        child.visible = child.name === levelRocks;
      });
      break;
    default:
      break;
  }
}

function getLevel(evolution: number) {
  if (evolution >= 75) return "high";
  if (evolution >= 50) return "mid";
  if (evolution >= 25) return "low";
  return "normal";
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
