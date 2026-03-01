import * as THREE from "three";
import gsap from "gsap";
import { useAudio } from "~/composables/useAudio";
import { updateImpactNumber } from "./experience";
import type { impactType } from "~/types/config";

// appear sound
const { playReveal } = useAudio();

export function hideElements() {
  const worldStore = useWorld();
  worldStore.hiddenSceneParts = [];

  Object.values(worldStore.sceneMeshes).forEach((meshGroup) => {
    if (
      meshGroup.name.includes("sheeps") ||
      meshGroup.name.includes("chickens") ||
      meshGroup.name.includes("City")
    ) {
      meshGroup.position.y = -10;
      worldStore.hiddenSceneParts.push(markRaw(meshGroup));
    } else {
      meshGroup.children.forEach((mesh) => {
        mesh.visible = false;
        if (mesh.name.includes("normal") || mesh.name.includes("mid")) {
          mesh.position.y = -10;
          worldStore.hiddenSceneParts.push(markRaw(mesh));
        }
      });
    }
  });
}

export function revealElements() {
  const configStore = useConfig();
  const worldStore = useWorld();

  const totalHidden = worldStore.hiddenSceneParts.length;
  if (totalHidden === 0) return;

  const stepsLeft =
    configStore.formParams.step - configStore.formParams.currentStep;

  let numberToReveal;

  if (stepsLeft <= 1) {
    numberToReveal = totalHidden;
  } else {
    numberToReveal = Math.ceil(totalHidden / stepsLeft);
  }

  for (let i = 0; i < numberToReveal; i++) {
    const remaining = worldStore.hiddenSceneParts.length;
    if (remaining === 0) break;

    const randIndex = Math.floor(Math.random() * remaining);
    const partToReveal = worldStore.hiddenSceneParts[randIndex];

    if (partToReveal) {
      partToReveal.visible = true;
      gsap.to(partToReveal.position, {
        y: 0,
        duration: 1,
        ease: "power2.out",
        delay: i * 0.05,
      });
      worldStore.hiddenSceneParts.splice(randIndex, 1);
    }
  }

  if (numberToReveal > 0) playReveal();

  configStore.formParams.currentStep += 1;
}
/*___________INSTANCE CHILDRENS_________*/

export function calculateParmasAssetsNumber(
  instancedMesh: THREE.InstancedMesh,
) {
  let visibleInstancePercentage = 0;
  const randomMultiplier = Math.random() * 0.2 + 0.8;

  if (instancedMesh.name.includes("best")) {
    visibleInstancePercentage = 100 * randomMultiplier;
  } else if (instancedMesh.name.includes("normal")) {
    visibleInstancePercentage = 85 * randomMultiplier;
  } else if (instancedMesh.name.includes("bad")) {
    visibleInstancePercentage = 75 * randomMultiplier;
  } else if (instancedMesh.name.includes("worst")) {
    visibleInstancePercentage = 65 * randomMultiplier;
  }

  const targetInstances = Math.round(
    instancedMesh.count -
      (instancedMesh.count / 100) * visibleInstancePercentage,
  );

  for (let i = 0; i < targetInstances; i++) {
    hideInstanceChildren(
      instancedMesh,
      instancedMesh.userData.childrenArray[i]!,
    );
  }
}

export function hideInstanceChildren(
  instancedMesh: THREE.InstancedMesh,
  index: number,
) {
  const dummy = new THREE.Object3D();

  instancedMesh.getMatrixAt(index, dummy.matrix);
  dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);

  dummy.scale.set(0, 0, 0);
  dummy.updateMatrix();

  instancedMesh.setMatrixAt(index, dummy.matrix);
  instancedMesh.instanceMatrix.needsUpdate = true;
}

export function resetParmasAssets(instancedMesh: THREE.InstancedMesh) {
  instancedMesh.instanceMatrix.copy(instancedMesh.userData.originalMatrix);

  instancedMesh.instanceMatrix.needsUpdate = true;
}

export function updateCity(temperature: number) {
  const worldStore = useWorld();
  const configStore = useConfig();

  const cityGroup = worldStore.globalScene?.getObjectByName("City")!;

  const citySpotNumber = cityGroup.children.length;

  const focusedSpot = Math.round(
    (temperature / configStore.configParams.maxTemperature) * citySpotNumber,
  );

  for (let i = 0; i < cityGroup.children.length!; i++) {
    const citySpot = cityGroup.children[i]!;

    citySpot.children.forEach((child) => {
      if (child.name.includes("house")) {
        if (i < focusedSpot) {
          child.visible = false;
        } else {
          child.visible = true;
        }
      } else if (child.name.includes("building")) {
        if (i < focusedSpot) {
          child.visible = true;
        } else {
          child.visible = false;
        }
      }
    });
  }
}
