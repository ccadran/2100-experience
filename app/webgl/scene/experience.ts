import { useWorld } from "~/stores/world";
import { useConfig } from "~/stores/configurator";

export function moveToStep(step: number) {
  const worldStore = useWorld();
  const configStore = useConfig();
  const currentStep = configStore.worldStateSteps[step];

  const currentTemperature = currentStep.temperature;

  worldStore.sceneParts.forEach((part) => {
    const firstChild = part.children[0];
    if (!firstChild) return;

    const currentState = getCurrentState(
      firstChild.userData,
      currentTemperature
    );
    if (!currentState) return;
    part.children.forEach((child) => {
      child.children.forEach((c) => {
        console.log(c.name);
        if (c.name.includes(currentState)) {
          c.visible = true;
        } else {
          c.visible = false;
        }
      });
    });
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
