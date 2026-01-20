import gsap from "gsap";
import { delay } from "../utils";
import { hideElements } from "./config";
import * as THREE from "three";


// couleurs du sol
const healthy_color = new THREE.Color("#007411");
const dry_color = new THREE.Color("#dadd7d");


const SKY_CLEAN = {
  top: new THREE.Color("#3377ed"),
  mid: new THREE.Color("#4f75cd"),
  bot: new THREE.Color("#ccddff"),
  fog: new THREE.Color("#ccddff"),
  fogDistMin: 20,
  fogDistMax: 80,
  fogDensity: 2.5
};

const SKY_POLLUTED = {
  top: new THREE.Color("#5e5b55"),
  mid: new THREE.Color("#8a8376"),
  bot: new THREE.Color("#abb6cc"),
  fog: new THREE.Color("#abb6cc"),
  fogDistMin: 18,
  fogDistMax: 80,
  fogDensity: 3.5
};


const currentSkyState = {
  top: new THREE.Color().copy(SKY_CLEAN.top),
  mid: new THREE.Color().copy(SKY_CLEAN.mid),
  bot: new THREE.Color().copy(SKY_CLEAN.bot),
  fog: new THREE.Color().copy(SKY_CLEAN.fog),

  fogDistMin: SKY_CLEAN.fogDistMin,
  fogDistMax: SKY_CLEAN.fogDistMax,
  fogDensity: SKY_CLEAN.fogDensity,
};

const MAX_FOG_SCORE = 16;


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

  const currentFogValue = currentStep.impacts.fog?.value || 0;
  updateSkyAndFog(currentFogValue);

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



// couleur du sol via la temp
function updateGroundColor(currentTemp: number) {
  const worldStore = useWorld();
  const configStore = useConfig();

  if (!worldStore.ground) return;

  const minTemp = configStore.configParams.minTemperature;
  const maxTemp = configStore.configParams.maxTemperature;


  let ratio = (currentTemp - minTemp) / (maxTemp - minTemp);
  ratio = Math.max(0, Math.min(1, ratio));

  const targetColor = new THREE.Color().copy(healthy_color).lerp(dry_color, ratio);

  gsap.to((worldStore.ground.material as THREE.MeshStandardMaterial).color, {
    r: targetColor.r,
    g: targetColor.g,
    b: targetColor.b,
    duration: 1.5,
    ease: "power2.inOut"
  });
}


// couleur et densité du fog via plane trnsprt et energy
function updateSkyAndFog(currentFogValue: number) {
  const worldStore = useWorld();
  
  if (!worldStore.skyContext || !worldStore.skyTexture || !worldStore.fogControls) return;
  let ratio = currentFogValue / MAX_FOG_SCORE;
  ratio = Math.max(0, Math.min(1, ratio));

  const targetTop = new THREE.Color().copy(SKY_CLEAN.top).lerp(SKY_POLLUTED.top, ratio);
  const targetMid = new THREE.Color().copy(SKY_CLEAN.mid).lerp(SKY_POLLUTED.mid, ratio);
  const targetBot = new THREE.Color().copy(SKY_CLEAN.bot).lerp(SKY_POLLUTED.bot, ratio);

  const targetFog = new THREE.Color().copy(SKY_CLEAN.fog).lerp(SKY_POLLUTED.fog, ratio);

  const targetDistMin = SKY_CLEAN.fogDistMin + (SKY_POLLUTED.fogDistMin - SKY_CLEAN.fogDistMin) * ratio;
  const targetDistMax = SKY_CLEAN.fogDistMax + (SKY_POLLUTED.fogDistMax - SKY_CLEAN.fogDistMax) * ratio;
  const targetDensity = SKY_CLEAN.fogDensity + (SKY_POLLUTED.fogDensity - SKY_CLEAN.fogDensity) * ratio;

  gsap.to(currentSkyState.top, { r: targetTop.r, g: targetTop.g, b: targetTop.b, duration: 1.5 });
  gsap.to(currentSkyState.mid, { r: targetMid.r, g: targetMid.g, b: targetMid.b, duration: 1.5 });
  gsap.to(currentSkyState.bot, { r: targetBot.r, g: targetBot.g, b: targetBot.b, duration: 1.5 });
  gsap.to(currentSkyState.fog, { r: targetFog.r, g: targetFog.g, b: targetFog.b, duration: 1.5 });

  gsap.to(currentSkyState, {

    fogDistMin: targetDistMin,
    fogDistMax: targetDistMax,
    fogDensity: targetDensity,
    duration: 1.5,

    onUpdate: () => {
      const ctx = worldStore.skyContext!;
      const gradient = ctx.createLinearGradient(0, 0, 0, 256);
      gradient.addColorStop(0, `#${currentSkyState.top.getHexString()}`);
      gradient.addColorStop(0.3, `#${currentSkyState.mid.getHexString()}`);
      gradient.addColorStop(1, `#${currentSkyState.bot.getHexString()}`);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1, 256);
      worldStore.skyTexture!.needsUpdate = true;

      if (worldStore.fogControls) {
        worldStore.fogControls.updateFogColor(currentSkyState.fog);
        worldStore.fogControls.updateFogDistance(currentSkyState.fogDistMin, currentSkyState.fogDistMax);
        worldStore.fogControls.updateFogDensity(currentSkyState.fogDensity);
      }


      if (worldStore.globalScene) {
        worldStore.globalScene.background = currentSkyState.fog;
      }

    }
  });
}