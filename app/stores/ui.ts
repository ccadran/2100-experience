export const useUi = defineStore("useUi", () => {
  const isLoaded = ref<boolean>(false);

  return { isLoaded };
});
