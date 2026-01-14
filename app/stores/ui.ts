import CloudsTransition from "~/webgl/scene/Clouds";

export const useUi = defineStore("useUi", () => {
  const isLoaded = ref<boolean>(false);
  const isFormValidated = ref(false);

  const cloudsTransition = ref<CloudsTransition>();

  const previewStep = ref<number | null>(null);

  return { isLoaded, isFormValidated, cloudsTransition, previewStep };
});