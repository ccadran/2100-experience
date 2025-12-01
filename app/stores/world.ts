import * as THREE from "three";
import type Camera from "~/webgl/scene/camera";

export const useWorld = defineStore("useWorld", () => {
  const scene = ref<THREE.Group | null>(null);
  const sceneParts = ref<THREE.Object3D[]>([]);
  const hiddenSceneParts = ref<any[]>([]);
  const camera = ref<Camera>();

  return { scene, sceneParts, hiddenSceneParts, camera };
});
