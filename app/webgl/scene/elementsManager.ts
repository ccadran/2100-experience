import * as THREE from "three";
import gsap from "gsap";

export function setupInstances() {
  const worldStore = useWorld();

  const allMeshes: Record<string, any> = {};
  const targetGroups: Record<string, THREE.Group> = {};

  //stock meshes in objects
  worldStore.paramsParts.forEach((group) => {
    allMeshes[group.name] = {};

    if (!group.name.includes("group")) return;

    group.children.forEach((child) => {
      child.children.forEach((c) => {
        if (c instanceof THREE.Mesh) {
          c.visible = false;
          if (c.name.includes("best")) {
            stockMesh("best", c);
          } else if (c.name.includes("normal")) {
            stockMesh("normal", c);
          } else if (c.name.includes("bad")) {
            stockMesh("bad", c);
          } else if (c.name.includes("worst")) {
            stockMesh("worst", c);
          }
        }
      });
    });
  });
  worldStore.paramsParts = [];

  //create instances
  Object.values(allMeshes).forEach((meshesType) => {
    Object.values(meshesType as THREE.Mesh[][]).forEach((meshGroup) => {
      if (!meshGroup[0]) return;
      const mesheNumbers = meshGroup.length;
      const taregtGroup = meshGroup[0]?.parent?.parent?.name;
      const targetType = meshGroup[0].name;

      if (!taregtGroup) return;

      if (!targetGroups[taregtGroup]) {
        const newGroup = new THREE.Group();
        newGroup.name = taregtGroup;
        targetGroups[taregtGroup] = newGroup;
        worldStore.scene3d?.add(newGroup);
      }

      const instancedMesh = new THREE.InstancedMesh(
        meshGroup[0]?.geometry,
        meshGroup[0]?.material,
        mesheNumbers,
      );
      instancedMesh.name = targetType;

      if (worldStore.scene3d) worldStore.scene3d.updateMatrixWorld(true);

      const parentMatrix = worldStore.scene3d!.matrixWorld;
      const parentInverse = new THREE.Matrix4().copy(parentMatrix).invert();

      const tempMatrix = new THREE.Matrix4();

      for (let i = 0; i < mesheNumbers; i++) {
        const ogObject = meshGroup[i];
        if (!ogObject) continue;

        ogObject.updateMatrixWorld();

        tempMatrix.copy(ogObject.matrixWorld);
        tempMatrix.premultiply(parentInverse);

        instancedMesh.setMatrixAt(i, tempMatrix);
      }

      instancedMesh.instanceMatrix.needsUpdate = true;
      instancedMesh.frustumCulled = false;

      targetGroups[taregtGroup].add(instancedMesh);

      //stock mesh in store object
      worldStore.sceneMeshes[taregtGroup] = markRaw(targetGroups[taregtGroup]);
      if (!worldStore.paramsParts.includes(targetGroups[taregtGroup])) {
        worldStore.paramsParts.push(markRaw(targetGroups[taregtGroup]));
      }

      //delete old meshes
      meshGroup.forEach((mesh) => {
        const parent = mesh.parent;
        mesh.removeFromParent();

        if (parent && parent.children.length === 0) {
          parent.removeFromParent();
        }
      });
      //DELETE THE BASE mesh
      worldStore.globalScene?.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          if (
            o.name.includes("normal") ||
            o.name.includes("bad") ||
            o.name.includes("worst") ||
            o.name.includes("best")
          ) {
            o.visible = false;
          }
        }
      });
    });
  });

  /*functions*/

  //stock mesh & create objects
  function stockMesh(
    type: "best" | "normal" | "bad" | "worst",
    object: THREE.Mesh,
  ) {
    if (!allMeshes[object.parent!.parent!.name][type]) {
      allMeshes[object.parent!.parent!.name][type] = [];
    }
    allMeshes[object.parent!.parent!.name][type].push(object);
  }
}

export function setupDecorInstances() {
  const worldStore = useWorld();

  const instancesGroup: THREE.Object3D[] = [];

  worldStore.globalScene?.traverse((c) => {
    if (c.name.includes("instance")) {
      instancesGroup.push(c);
    }
  });

  instancesGroup.forEach((group) => {
    const firstChild = group.children[0] as THREE.Mesh;

    const instancedMesh = new THREE.InstancedMesh(
      firstChild.geometry,
      firstChild.material,
      group.children.length,
    );
    instancedMesh.name = group.name;

    if (worldStore.scene3d) worldStore.scene3d.updateMatrixWorld(true);

    const parentMatrix = worldStore.scene3d!.matrixWorld;
    const parentInverse = new THREE.Matrix4().copy(parentMatrix).invert();

    const tempMatrix = new THREE.Matrix4();

    for (let i = 0; i < group.children.length; i++) {
      const ogObject = group.children[i];

      if (!ogObject) continue;

      ogObject.updateMatrixWorld();

      tempMatrix.copy(ogObject.matrixWorld);
      tempMatrix.premultiply(parentInverse);

      instancedMesh.setMatrixAt(i, tempMatrix);
    }

    instancedMesh.instanceMatrix.needsUpdate = true;
    instancedMesh.frustumCulled = true;

    worldStore.globalScene!.add(instancedMesh);

    group.children.forEach((mesh) => {
      const parent = mesh.parent;
      mesh.removeFromParent();

      if (parent && parent.children.length === 0) {
        parent.removeFromParent();
      }
    });
  });
}

export function hideElements() {
  const worldStore = useWorld();
  worldStore.hiddenSceneParts = [];

  Object.values(worldStore.sceneMeshes).forEach((meshGroup) => {
    meshGroup.children.forEach((mesh) => {
      mesh.visible = false;
      if (mesh.name.includes("normal")) {
        mesh.position.y = -10;
        worldStore.hiddenSceneParts.push(mesh);
      }
    });
  });
}

export function revealElements() {
  const configStore = useConfig();
  const worldStore = useWorld();

  if (configStore.formParams.currentStep <= configStore.formParams.step) {
    if (worldStore.hiddenSceneParts.length < 1) return;
    const randIndex = Math.floor(
      Math.random() * worldStore.hiddenSceneParts.length,
    );
    worldStore.hiddenSceneParts[randIndex].visible = true;

    gsap.to(worldStore.hiddenSceneParts[randIndex].position, {
      y: 0,
      duration: 1,
      ease: "power2.inOut",
    });
    console.log(worldStore.hiddenSceneParts[randIndex]);
    configStore.formParams.currentStep += 1;
    worldStore.hiddenSceneParts.splice(randIndex, 1);
  }
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
    visibleInstancePercentage = 75 * randomMultiplier;
  } else if (instancedMesh.name.includes("bad")) {
    visibleInstancePercentage = 50 * randomMultiplier;
  } else if (instancedMesh.name.includes("worst")) {
    visibleInstancePercentage = 25 * randomMultiplier;
  }

  const targetInstances = Math.round(
    instancedMesh.count -
      (instancedMesh.count / 100) * visibleInstancePercentage,
  );

  console.log(instancedMesh.userData);

  for (let i = 0; i < targetInstances; i++) {
    hideInstanceChildren(
      instancedMesh,
      instancedMesh.userData.childrenArray[i]!,
    );
  }
}

function hideInstanceChildren(
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
