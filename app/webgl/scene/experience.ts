import gsap from "gsap";

export async function moveToStep(target: number) {
  const worldStore = useWorld();
  const configStore = useConfig();
  const uiStore = useUi();
  await uiStore.cloudsTransition?.showClouds();

  let targetStep: number = configStore.currentStep;
  if (typeof target === "number") {
    targetStep = target;
  }

  if (targetStep <= configStore.worldStateSteps.length - 1 && targetStep >= 0) {
    configStore.currentStep = targetStep;
  } else {
    alert("THIS STEP DOES NOT EXIST");
  }
  const currentStep = configStore.worldStateSteps[configStore.currentStep];

  const currentTemperature = currentStep.temperature;

  worldStore.sceneParts.forEach((part) => {
    if (part.name.includes("group")) {
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
    }

    //TODO regarder la hiérarchie du part.children.forEach
    else if (part.name.includes("impact")) {
      Object.entries(configStore.worldParams).forEach(([key, value]) => {
        if (!part.name.includes(key)) return;

        const paramValue = currentStep.params[key];

        const levels = {
          low: paramValue >= 25,
          mid: paramValue >= 50,
          high: paramValue >= 75,
        };

        part.children.forEach((child) => {
          const level = Object.keys(levels).find((l) =>
            child.name.includes(l)
          ) as keyof typeof levels;
          child.visible = level ? levels[level] : false;
        });
      });
    }
  });

  await uiStore.cloudsTransition?.hideClouds();
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