import CloudsTransition from "~/webgl/scene/Clouds";

export const useUi = defineStore("useUi", () => {
  const isLoaded = ref<boolean>(false);

  const cloudsTransition = ref<CloudsTransition>();

  return { isLoaded, cloudsTransition };
});
