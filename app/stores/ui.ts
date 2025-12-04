export const useUi = defineStore("useUi", () => {
  const isLoaded = ref<boolean>(false);
  const isFormValidated = ref<boolean>(false);

  return { isLoaded, isFormValidated };
});
