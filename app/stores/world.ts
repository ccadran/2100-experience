import * as THREE from "three";

export const useWorld = defineStore("useWorld", () => {
  const scene = ref<THREE.Group | null>(null);
  const sceneParts = ref<any[]>([]);
  const hiddenSceneParts = ref<any[]>([]);
  return { scene, sceneParts, hiddenSceneParts };
});
