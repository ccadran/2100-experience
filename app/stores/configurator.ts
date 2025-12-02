import type { userConfigParams } from "~/types/config";

export const useConfig = defineStore("useConfig", () => {
  const formParams = {
    step: 5,
    currentStep: 0,
  };

  const configParams = {
    yearsStep: 10, //in years
    currentYear: 2025,
    targetYear: 2100,
    maxTemperature: 7.1,
  };

  const worldParams = {
    plane: {
      name: "plane",
      weight: 0.03,
    },
    dailyTransport: {
      name: "dailyTransport",
      weight: 0.2,
    },
    food: {
      name: "food",
      weight: 0.25,
    },
    energy: {
      name: "energy",
      weight: 0.35,
    },
    consumption: {
      name: "consumption",
      weight: 0.17,
    },
  };

  const objectsData = {
    trees: { worst: 2.5, bad: 1.5, normal: 0.5, best: 0 },
    grass: { worst: 3.5, bad: 2.5, normal: 1.5, best: 0 },
  };

  const userConfig: Partial<userConfigParams> = {};

  const worldStateSteps: any[] = [];

  const currentStep = ref<number>(0);

  return {
    formParams,
    userConfig,
    configParams,
    worldParams,
    worldStateSteps,
    objectsData,
    currentStep,
  };
});
