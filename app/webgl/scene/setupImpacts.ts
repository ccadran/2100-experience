import type { impactType } from "~/types/config";
import { updateImpactNumber } from "./experience";

export function setupAllImpacts() {
  const worldStore = useWorld();
  console.log(worldStore.impactsParts);

  console.log(Object.entries(worldStore.impactsParts));

  Object.entries(worldStore.impactsParts).forEach(([key, value]) => {
    if (!value) return;

    if (value.name.includes("pool")) {
      const matchingKey = Object.keys(worldStore.impactsParts).find((k) =>
        value.name.includes(k),
      );

      updateImpactNumber({
        name: matchingKey as impactType["name"],
        value: 20,
      });
    } else {
      value.children.forEach((child: any) => {
        if (!child.name.includes("mid")) {
          child.visible = false;
        }
      });
      worldStore.sceneMeshes[value.name] = markRaw(value);
    }
  });
}

// export function setupAllImpacts() {
//   const worldStore = useWorld();

//   const allMeshes: Record<string, Record<string, THmoniteREE.Mesh[]>> = {};

//   const impactNamesMap: Record<string, string> = {};
//   const keysToRemove: string[] = [];

//   // =========================================================
//   // ÉTAPE 1 : COLLECTE DES "STATES" (Inchangé)
//   // =========================================================
//   Object.entries(worldStore.impactsParts).forEach(([key, value]) => {
//     if (!value) return;

//     if (value.name.includes("states-instances")) {
//       keysToRemove.push(key);
//       const impactName = key;
//       impactNamesMap[value.name] = impactName;
//       if (!allMeshes[value.name]) allMeshes[value.name] = {};

//       value.children.forEach((child: any) => {
//         child.children.forEach((c: any) => {
//           if (c instanceof THREE.Mesh) {
//             c.visible = false;
//             if (c.name.includes("high")) stockMesh(value.name, "high", c);
//             else if (c.name.includes("mid")) stockMesh(value.name, "mid", c);
//             else if (c.name.includes("low")) stockMesh(value.name, "low", c);
//           }
//         });
//       });
//     } else if (value.name.includes("states-raw")) {
//       const impactName = key;
//       impactNamesMap[value.name] = impactName;

//       value.children.forEach((child: any) => {
//         // if (child instanceof THREE.Mesh) {
//         if (child.name.includes("high") || child.name.includes("low")) {
//           child.visible = false;
//         } else if (child.name.includes("mid")) {
//           child.visible = true;
//         }
//         // }
//       });
//       worldStore.sceneMeshes[value.name] = markRaw(value);
//     }
//   });

//   // =========================================================
//   // ÉTAPE 2 : COLLECTE DES "POOLS" (Inchangé)
//   // =========================================================
//   worldStore.globalScene?.traverse((child) => {
//     if (child.name.includes("IMPACTS")) {
//       child.children.forEach((group) => {
//         if (group.name.includes("pool")) {
//           if (!allMeshes[group.name]) allMeshes[group.name] = {};

//           const matchingKey = Object.keys(worldStore.impactsParts).find((k) =>
//             group.name.includes(k),
//           );

//           if (matchingKey) impactNamesMap[group.name] = matchingKey;

//           group.children.forEach((mesh) => {
//             if (mesh instanceof THREE.Mesh) {
//               stockMesh(group.name, "default", mesh);
//             }
//           });

//           //  updateImpactNumber ({
//           //     name: matchingKey as impactType["name"],
//           //     value: 0.2,
//           //   });
//         }
//       });
//     }
//   });

//   // =========================================================
//   // ÉTAPE 3 : NETTOYAGE DU STORE (Inchangé)
//   // =========================================================
//   keysToRemove.forEach((key) => delete worldStore.impactsParts[key]);

//   // =========================================================
//   // ÉTAPE 4 : GÉNÉRATION INTELLIGENTE (Group VS InstancedMesh)
//   // =========================================================

//   if (worldStore.scene3d) worldStore.scene3d.updateMatrixWorld(true);
//   const parentMatrix = worldStore.scene3d!.matrixWorld;
//   const parentInverse = new THREE.Matrix4().copy(parentMatrix).invert();
//   const tempMatrix = new THREE.Matrix4();

//   Object.entries(allMeshes).forEach(([groupName, meshesByType]) => {
//     const logicalName = impactNamesMap[groupName] || groupName;
//     const meshTypes = Object.keys(meshesByType);

//     // DÉCISION : Est-ce un Pool (Direct) ou un State (Group) ?
//     // Si on a un seul type et que c'est "default", on considère que c'est un Pool simple.
//     const isSimplePool = meshTypes.length === 1 && meshTypes[0] === "default";

//     let finalObject: THREE.Object3D;

//     if (isSimplePool) {
//       // --- CAS A : POOL (Direct InstancedMesh) ---
//       const meshList = meshesByType["default"];

//       const instancedMesh = createInstancedMeshFromList(
//         meshList,
//         groupName,
//         "default",
//       );

//       // On nomme l'instance directement avec le nom logique (ex: "forest")
//       instancedMesh.name = logicalName;
//       instancedMesh.castShadow = true;

//       worldStore.scene3d?.add(instancedMesh);
//       finalObject = instancedMesh;
//     } else {
//       // --- CAS B : STATES (Group Container avec LODs) ---
//       const group = new THREE.Group();
//       group.name = logicalName;

//       Object.entries(meshesByType).forEach(([type, meshList]) => {
//         const instancedMesh = createInstancedMeshFromList(
//           meshList,
//           groupName,
//           type,
//         );
//         group.add(instancedMesh);
//         instancedMesh.castShadow = true;
//       });

//       worldStore.scene3d?.add(group);
//       finalObject = group;
//     }

//     // =========================================================
//     // ÉTAPE 5 : STOCKAGE FINAL
//     // =========================================================

//     // 1. Stockage technique
//     worldStore.sceneMeshes[groupName] = markRaw(finalObject);

//     // 2. Stockage logique (Store)
//     const storeKey = impactNamesMap[groupName];

//     if (storeKey) {
//       if (!worldStore.impactsParts[storeKey]) {
//         worldStore.impactsParts[storeKey] = markRaw(finalObject);
//       }
//     } else {
//       if (!worldStore.impactsParts[groupName]) {
//         worldStore.impactsParts[groupName] = markRaw(finalObject);
//       }
//     }
//     if (isSimplePool && storeKey) {
//       updateImpactNumber({
//         name: storeKey as impactType["name"],
//         value: 20,
//       });
//     }
//   });

//   cleanupSceneArtifacts(worldStore);

//   /* --- HELPER FUNCTION POUR EVITER LA DUPLICATION DE CODE --- */
//   function createInstancedMeshFromList(
//     meshList: THREE.Mesh[],
//     groupName: string,
//     type: string,
//   ) {
//     if (!meshList || meshList.length === 0)
//       return new THREE.InstancedMesh(undefined, undefined, 0);

//     const count = meshList.length;
//     const geometry = meshList[0].geometry;
//     const material = meshList[0].material;

//     const instancedMesh = new THREE.InstancedMesh(geometry, material, count);
//     // Si c'est un pool simple, le nom sera écrasé par logicalName plus haut, sinon ça garde ce format
//     instancedMesh.name = `${groupName}_${type}`;

//     for (let i = 0; i < count; i++) {
//       const original = meshList[i];
//       original.updateMatrixWorld();

//       tempMatrix.copy(original.matrixWorld);
//       tempMatrix.premultiply(parentInverse);
//       instancedMesh.setMatrixAt(i, tempMatrix);
//     }

//     instancedMesh.instanceMatrix.needsUpdate = true;
//     instancedMesh.frustumCulled = true;

//     // Nettoyage des originaux
//     meshList.forEach((mesh) => {
//       const parent = mesh.parent;
//       mesh.removeFromParent();
//       if (parent && parent.children.length === 0) parent.removeFromParent();
//     });

//     return instancedMesh;
//   }

//   /* --- UTILITAIRES --- */
//   function stockMesh(groupName: string, type: string, mesh: THREE.Mesh) {
//     if (!allMeshes[groupName][type]) allMeshes[groupName][type] = [];
//     allMeshes[groupName][type].push(mesh);
//   }

//   function cleanupSceneArtifacts(store: any) {
//     store.globalScene?.traverse((o: any) => {
//       if (o instanceof THREE.Mesh) {
//         if (
//           ["normal", "bad", "worst", "best", "high", "mid", "low"].some((tag) =>
//             o.name.includes(tag),
//           )
//         ) {
//           o.visible = false;
//         }
//       }
//     });
//   }
// }
