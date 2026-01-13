import gsap from "gsap";


export async function moveToStep(targetStep: number) {
  const worldStore = useWorld();
  const configStore = useConfig();
  const uiStore = useUi();

  await uiStore.cloudsTransition?.showClouds();

  if (
    targetStep >= 0 &&
    targetStep < configStore.worldStateSteps.length
  ) {
    configStore.currentStep = targetStep;
  } else {
    console.warn("STEP OUT OF RANGE", targetStep);
    await uiStore.cloudsTransition?.hideClouds();
    return;
  }

  const currentStep = configStore.worldStateSteps[configStore.currentStep];
  const currentTemperature = currentStep.temperature;

  worldStore.paramsParts.forEach((part) => {
    const firstChild = part.children[0];
    console.log(firstChild);

    if (!firstChild) return;

    const currentState = getCurrentState(
      firstChild.userData,
      currentTemperature
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
    updateImact(impact.name, currentStep.impacts[impact.name]);
  });

  await uiStore.cloudsTransition?.hideClouds();
}

function updateImact(
  type: "fog" | "waterLevel" | "factory" | "rocks",
  evolution: number
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
  temperature: number
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