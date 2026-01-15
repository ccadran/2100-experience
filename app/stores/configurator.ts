import type { UserConfigType, worldImpactsType } from "~/types/config";

export const useConfig = defineStore("useConfig", () => {
  const formParams = {
    step: 5,
    currentStep: 0,
  };

  const configParams = {
    yearsStep: 25, //in years
    currentYear: 2025,
    targetYear: 2100,
    maxTemperature: 5.7,
    currentTemperature: 1.2,
    minTemperature: 0,
    pivotScore: 25,
  };

  const worldParams = {
    plane: {
      name: "plane",
      globalWeight: 0.1, // 10%
      impacts: [{ type: "fog", weight: 0.5 }],
    },
    transport: {
      name: "transport",
      globalWeight: 0.25, // 25%
      impacts: [{ type: "fog", weight: 0.2 }],
    },
    meat: {
      name: "meat",
      globalWeight: 0.15, // 15%
      impacts: [{ type: "waterLevel", weight: 0.7 }],
    },
    promptIA: {
      name: "promptIA",
      globalWeight: 0.02, // 2%
      impacts: [{ type: "waterLevel", weight: 0.3 }],
    },
    products: {
      name: "products",
      globalWeight: 0.15, // 15%
      impacts: [{ type: "factory", weight: 0.5 }],
    },
    phone: {
      name: "phone",
      globalWeight: 0.05, // 5%
      impacts: [
        { type: "factory", weight: 0.15 },
        { type: "rocks", weight: 1 },
      ],
    },
    energy: {
      name: "energy",
      globalWeight: 0.2, // 20%
      impacts: [{ type: "fog", weight: 0.3 }],
    },
    clothes: {
      name: "clothes",
      globalWeight: 0.08, // 8%
      impacts: [{ type: "factory", weight: 0.35 }],
    },
  };

  const worldImpacts: worldImpactsType = {
    fog: {
      name: "fog",
      value: 0,
    },
    waterLevel: {
      name: "waterLevel",
      value: 0,
    },
    factory: {
      name: "factory",
      value: 0,
    },
    rocks: {
      name: "rocks",
      value: 0,
    },
  };

  const objectsData = {
    trees: {
      worst: 3.5,
      bad: 2.0,
      normal: 1.2,
      best: 0.8,
    },
    bushes: {
      worst: 4.0,
      normal: 1.5,
      best: 1.0,
    },
    flowers: {
      worst: 2.0,
      normal: 1.2,
      best: 0.2,
    },
  };

  const userConfig: Partial<UserConfigType> = {};

  const worldStateSteps: any[] = [];

  const currentStep = ref<number>(0);

  const isFormValidated = ref<boolean>(false);

  const globalPercentage = ref<number>(0);

  return {
    formParams,
    userConfig,
    configParams,
    worldParams,
    worldImpacts,
    worldStateSteps,
    objectsData,
    currentStep,
    isFormValidated,
    globalPercentage,
  };
});
