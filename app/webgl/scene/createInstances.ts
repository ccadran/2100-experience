import * as THREE from "three";
import gsap from "gsap";
import { updateImpactNumber } from "./experience";

export function setupInstances() {
  const worldStore = useWorld();
  const sourceInstances = <THREE.Object3D[]>[];

  worldStore.scene3d?.traverse((o) => {
    if (o.name.includes("instances")) {
      sourceInstances.push(o);
    }
  });
  sourceInstances.forEach((sourceInstance) => {
    if (sourceInstance.name.includes("group")) {
      const splitName = sourceInstance.name.split("-");
      const groupName = splitName[0]!;
      const sortedStates: Record<string, THREE.Mesh[]> = {
        best: [],
        bad: [],
        normal: [],
        worst: [],
      };
      const newGroup = new THREE.Group();
      newGroup.name = groupName;
      worldStore.scene3d?.add(newGroup);
      sourceInstance.children.forEach((child) => {
        child.children.forEach((c) => {
          if (c.name.includes("best")) {
            sortedStates.best?.push(c as THREE.Mesh);
          } else if (c.name.includes("normal")) {
            sortedStates.normal?.push(c as THREE.Mesh);
          } else if (c.name.includes("bad")) {
            sortedStates.bad?.push(c as THREE.Mesh);
          } else if (c.name.includes("worst")) {
            sortedStates.worst?.push(c as THREE.Mesh);
          }
        });
      });

      // console.log(sortedStates);
      Object.entries(sortedStates).forEach((state) => {
        const instance = createInstances(state[1], state[0], state[1].length);
        newGroup.add(instance);
      });
      worldStore.sceneMeshes[groupName] = markRaw(newGroup);

      worldStore.paramsParts.push(markRaw(newGroup));
    } else if (sourceInstance.name.includes("states")) {
      const splitName = sourceInstance.name.split("-");
      const groupName = splitName[0]!;
      const sortedStates: Record<string, THREE.Mesh[]> = {
        high: [],
        mid: [],
        low: [],
      };
      const newGroup = new THREE.Group();
      newGroup.name = groupName;

      sourceInstance.parent?.add(newGroup);
      sourceInstance.children.forEach((child) => {
        child.children.forEach((c) => {
          if (c.name.includes("high")) {
            sortedStates.high?.push(c as THREE.Mesh);
          } else if (c.name.includes("low")) {
            sortedStates.low?.push(c as THREE.Mesh);
          } else if (c.name.includes("mid")) {
            sortedStates.mid?.push(c as THREE.Mesh);
          }
        });
      });

      Object.entries(sortedStates).forEach((state) => {
        const instance = createInstances(state[1], state[0], state[1].length);
        newGroup.add(instance);
      });

      worldStore.sceneMeshes[groupName] = markRaw(newGroup);
    } else if (sourceInstance.name.includes("pool")) {
      const splitName = sourceInstance.name.split("-");
      const instanceName = splitName[0]!;

      const instance = createInstances(
        sourceInstance.children as THREE.Mesh[],
        instanceName,
        sourceInstance.children.length,
      );

      //placer dans impactsParts avec la bonne clé
      // console.log(worldStore.impactsParts);
      const matchingKey = Object.keys(worldStore.impactsParts).find((k) =>
        instanceName.includes(k),
      );
      console.log(worldStore.impactsParts);

      console.log(worldStore.impactsParts[matchingKey]);

      // worldStore.impactsParts[matchingKey!] = markRaw(instance);

      worldStore.sceneMeshes[instanceName] = markRaw(instance);
    } else {
      const splitName = sourceInstance.name.split("-");
      const instanceName = splitName[0]!;

      const instance = createInstances(
        sourceInstance.children as THREE.Mesh[],
        instanceName,
        sourceInstance.children.length,
      );
      worldStore.scene3d?.add(instance);
    }
  });
}

function createInstances(
  meshes: THREE.Mesh[],
  name: string,
  meshNumbers: number,
) {
  const worldStore = useWorld();

  const instancedMesh = new THREE.InstancedMesh(
    meshes[0]?.geometry,
    meshes[0]?.material,
    meshNumbers,
  );
  instancedMesh.name = name;

  if (worldStore.scene3d) worldStore.scene3d.updateMatrixWorld(true);

  const parentMatrix = worldStore.scene3d!.matrixWorld;
  const parentInverse = new THREE.Matrix4().copy(parentMatrix).invert();

  const tempMatrix = new THREE.Matrix4();

  for (let i = 0; i < meshNumbers; i++) {
    const ogObject = meshes[i];
    if (!ogObject) continue;

    ogObject.updateMatrixWorld();

    tempMatrix.copy(ogObject.matrixWorld);
    tempMatrix.premultiply(parentInverse);

    instancedMesh.setMatrixAt(i, tempMatrix);
  }

  instancedMesh.instanceMatrix.needsUpdate = true;
  instancedMesh.frustumCulled = false;
  instancedMesh.castShadow = true;
  instancedMesh.userData.originalMatrix = instancedMesh.instanceMatrix.clone();
  // console.log("___________", instancedMesh.userData);

  //delete old meshes
  meshes.forEach((mesh) => {
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

  return instancedMesh;
}

export function setupParamsInstances() {
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
      const targetGroup = meshGroup[0]?.parent?.parent?.name;
      const targetType = meshGroup[0].name;

      if (!targetGroup) return;

      if (!targetGroups[targetGroup]) {
        const newGroup = new THREE.Group();
        newGroup.name = targetGroup;
        targetGroups[targetGroup] = newGroup;
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
      instancedMesh.castShadow = true;
      instancedMesh.userData.originalMatrix =
        instancedMesh.instanceMatrix.clone();
      // console.log("___________", instancedMesh.userData);

      targetGroups[targetGroup].add(instancedMesh);

      //stock mesh in store object
      worldStore.sceneMeshes[targetGroup] = markRaw(targetGroups[targetGroup]);
      if (!worldStore.paramsParts.includes(targetGroups[targetGroup])) {
        worldStore.paramsParts.push(markRaw(targetGroups[targetGroup]));
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

  worldStore.globalScene?.traverse((child) => {
    if (child.name.includes("DECORS")) {
      child.children.forEach((c) => {
        if (c.name.includes("instance")) {
          instancesGroup.push(markRaw(c));
        }
      });
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
    instancedMesh.castShadow = true;

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
