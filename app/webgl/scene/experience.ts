export function moveToStep(target: number | "next" | "previous") {
  const worldStore = useWorld();
  const configStore = useConfig();

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

  worldStore.sceneParts.forEach((part) => {
    if (part.name.includes("group")) {
      const firstChild = part.children[0];
      if (!firstChild) return;

      const currentState = getCurrentState(
        firstChild.userData,
        currentTemperature
      );

      if (!currentState) return;

      part.children.forEach((child) => {
        child.children.forEach((c) => {
          if (c.name.includes(currentState)) {
            c.visible = true;
          } else {
            c.visible = false;
          }
        });
      });
    } else if (part.name.includes("impact")) {
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

const rafIds = {
  forward: null as number | null,
  back: null as number | null,
  left: null as number | null,
  right: null as number | null,
  down: null as number | null,
  up: null as number | null,
};

export function handleCameraMovements(
  direction: "forward" | "back" | "left" | "right" | "down" | "up",
  pressed: boolean
) {
  const worldStore = useWorld();

  if (pressed) {
    if (rafIds[direction]) return;

    const loop = () => {
      switch (direction) {
        case "forward":
          worldStore.camera?.moveForward();
          break;
        case "back":
          worldStore.camera?.moveBack();
          break;
        case "left":
          worldStore.camera?.moveLeft();
          break;
        case "right":
          worldStore.camera?.moveRight();
          break;
        case "down":
          worldStore.camera?.moveDown();
          break;
        case "up":
          worldStore.camera?.moveUp();
          break;
      }
      rafIds[direction] = requestAnimationFrame(loop);
    };

    loop();
  } else {
    if (rafIds[direction]) {
      cancelAnimationFrame(rafIds[direction]!);
      rafIds[direction] = null;
    }
  }
}

export function sceneTransition() {}
