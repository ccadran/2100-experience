import * as THREE from "three";
import type Camera from "~/webgl/scene/camera";

export const useWorld = defineStore("useWorld", () => {
  const globalScene = ref<THREE.Scene>();
  const scene3d = ref<THREE.Group | null>(null);
  const sceneParts = ref<THREE.Object3D[]>([]);
  const hiddenSceneParts = ref<any[]>([]);
  const camera = ref<Camera>();
  const sceneMeshes = ref<Record<string, any>>({});

  return {
    globalScene,
    scene3d,
    sceneParts,
    hiddenSceneParts,
    camera,
    sceneMeshes,
  };
});
