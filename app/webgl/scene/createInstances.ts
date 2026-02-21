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

      const matchingKey = Object.keys(worldStore.impactsParts).find((k) =>
        instanceName.includes(k),
      );

      worldStore.impactsParts[
        matchingKey as keyof typeof worldStore.impactsParts
      ] = markRaw(instance);

      worldStore.sceneMeshes[instanceName] = markRaw(instance);
    } else {
      const splitName = sourceInstance.name.split("-");
      const instanceName = splitName[0]!;

      const instance = createInstances(
        sourceInstance.children as THREE.Mesh[],
        instanceName,
        sourceInstance.children.length,
        true,
      );

      sourceInstance.parent?.add(instance);

      // worldStore.scene3d?.add(instance);
    }
  });

  //delete sources
  // sourceInstances.forEach((source) => {
  //   source.removeFromParent();
  // });
  //delete base mesh (scene center)
  deleteBaseMeshes();
}

function createInstances(
  meshes: THREE.Mesh[],
  name: string,
  meshNumbers: number,
  log?: boolean,
) {
  const worldStore = useWorld();

  const instancedMesh = new THREE.InstancedMesh(
    meshes[0]?.geometry,
    meshes[0]?.material,
    meshNumbers,
  );
  if (log) {
    console.log(instancedMesh);
  }

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
  instancedMesh.frustumCulled = true;
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

  return instancedMesh;
}

function deleteBaseMeshes() {
  const worldStore = useWorld();
  worldStore.globalScene?.traverse((o) => {
    if (
      o.name.includes("normal") ||
      o.name.includes("bad") ||
      o.name.includes("worst") ||
      o.name.includes("best")
    ) {
      o.visible = false;
    }
  });
}
