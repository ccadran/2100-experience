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
    maxTemperature: 4.5,
  };

  const worldParams = {
    plane: {
      name: "plane",
      description: "Impact des vols long et court-courriers.",
      weight: 0.1, // 10%
    },
    transport: {
      name: "transport",
      description:
        "Impact de la voiture individuelle, bus, train (hors avion).",
      weight: 0.25, // 25%
    },
    meat: {
      name: "meat",
      description:
        "Impact lié à la production de viande et produits animaux (méthane, déforestation).",
      weight: 0.15, // 15%
    },
    promptIA: {
      name: "promptIA",
      description:
        "Impact lié aux data centers, streaming, et requêtes IA/ChatGPT.",
      weight: 0.02, // 2%
    },
    products: {
      name: "products",
      description:
        "Impact lié à l'importation de nourriture et à la fabrication de produits manufacturés (hors textile et tech).",
      weight: 0.15, // 15%
    },
    phone: {
      name: "phone",
      description:
        "Impact lié à la fabrication (extraction de métaux) et à l'infrastructure des appareils électroniques (téléphones, PC).",
      weight: 0.05, // 5%
    },
    energy: {
      name: "energy",
      description:
        "Impact lié au chauffage (gaz, fioul) et à l'électricité domestique.",
      weight: 0.2, // 20%
    },
    clothes: {
      name: "clothes",
      description:
        "Impact lié à la production, la teinture et le transport des textiles (Fast Fashion).",
      weight: 0.08, // 8%
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
    water: {
      worst: 2.5,
      normal: 1.2,
      best: 0.5,
    },
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
