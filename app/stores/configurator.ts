export const useConfig = defineStore("useConfig", () => {
  const configParams = {
    step: 5,
    currentStep: 0,
  };

  return { configParams };
});
