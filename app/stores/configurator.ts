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
    paramsWeight: {
      plane: 0.03,
      dailyTransport: 0.2,
      food: 0.25,
      energy: 0.35,
      consumption: 0.17,
    },
  };

  const objectsData = {
    trees: { worst: 2.5, bad: 1.5, normal: 0.5, best: 0 },
    grass: { worst: 3.5, bad: 2.5, normal: 1.5, best: 0.3 },
  };

  const userConfig: Partial<userConfigParams> = {};

  const worldStateSteps: any[] = [];

  return { formParams, userConfig, configParams, worldStateSteps, objectsData };
});
