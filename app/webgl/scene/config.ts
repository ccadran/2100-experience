import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import type { UserConfigType } from "~/types/config";
import Camera from "./Camera";
import { moveToStep } from "./experience";
import gsap from "gsap";

export function initScene(): Promise<void> {
  return new Promise((resolve, reject) => {
    const worldStore = useWorld();
    const container = document.querySelector(".webgl");
    if (!container) return;

    const globalScene = new THREE.Scene();
    globalScene.background = new THREE.Color(0xaaaaaa);
    worldStore.globalScene = globalScene;

    worldStore.camera = new Camera();

    const canvas = container.querySelector("canvas");
    if (!canvas) return;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 7.5);
    globalScene.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    globalScene.add(ambientLight);

    const loader = new GLTFLoader();
    loader.load(
      // "/3d/states.glb",
      // "/3d/2100-map__V1.glb",
      "/3d/Map-V3-group.glb",
      (gltf: any) => {
        gltf.scene.scale.set(0.1, 0.1, 0.1);
        globalScene.add(gltf.scene);

        const target = globalScene.getObjectByName("Scene");

        worldStore.scene3d = target as THREE.Group;

        const sceneChildrens = worldStore.scene3d?.children;

        sceneChildrens?.forEach((child) => {
          if (child.name.includes("group")) {
            worldStore.paramsParts.push(child);
          } else if (child.name.includes("impacts")) {
            if (child.name.includes("waterLevel")) {
              worldStore.impactsParts.waterLevel = child;
            } else if (child.name.includes("factory")) {
              worldStore.impactsParts.factory = child;
            } else if (child.name.includes("rocks")) {
              worldStore.impactsParts.rocks = child;
            }
          }
        });
        setupInstances();
        hideElements();

        resolve();
      },
      undefined,
      reject
    );

    function animate() {
      requestAnimationFrame(animate);

      renderer.render(globalScene, worldStore.camera!.instance);
    }
    animate();

    window.addEventListener("resize", () => {
      if (!container) return;
      worldStore.camera!.instance.aspect =
        container.clientWidth / container.clientHeight;
      worldStore.camera!.instance.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });
  });
}

function setupInstances() {
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
        mesheNumbers
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
      worldStore.sceneMeshes[taregtGroup] = targetGroups[taregtGroup];
      if (!worldStore.paramsParts.includes(targetGroups[taregtGroup])) {
        worldStore.paramsParts.push(targetGroups[taregtGroup]);
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
      const objectsToRemove = [] as any[];

      worldStore.scene3d?.traverse((o) => {
        if (o.name.includes(mesheNumbers.toString())) {
          objectsToRemove.push(o);
        }
      });
    });
  });

  //TODO remove
  // worldStore.sceneMeshes.trees_group?.children.forEach((c) => {
  //   c.visible = c.name === "worst";
  // });

  /*functions*/

  //stock mesh & create objects
  function stockMesh(
    type: "best" | "normal" | "bad" | "worst",
    object: THREE.Mesh
  ) {
    if (!allMeshes[object.parent!.parent!.name][type]) {
      allMeshes[object.parent!.parent!.name][type] = [];
    }
    allMeshes[object.parent!.parent!.name][type].push(object);
  }

  console.log(worldStore.paramsParts);
}

export function hideElements() {
  const worldStore = useWorld();
  worldStore.hiddenSceneParts = [];

  Object.values(worldStore.sceneMeshes).forEach((meshGroup) => {
    meshGroup.position.y = -10;

    meshGroup.visible = false;
    worldStore.hiddenSceneParts.push(meshGroup);
  });
}

export function revealElements() {
  const configStore = useConfig();
  const worldStore = useWorld();

  if (configStore.formParams.currentStep <= configStore.formParams.step) {
    if (worldStore.hiddenSceneParts.length < 1) return;
    const randIndex = Math.floor(
      Math.random() * worldStore.hiddenSceneParts.length
    );
    worldStore.hiddenSceneParts[randIndex].visible = true;
    gsap.to(worldStore.hiddenSceneParts[randIndex].position, {
      y: 0,
      duration: 1,
      ease: "power2.inOut",
    });
    configStore.formParams.currentStep += 1;
    worldStore.hiddenSceneParts.splice(randIndex, 1);
  }
}

export function handleFormValidations(userData: UserConfigType) {
  const uiStore = useUi();
  const configStore = useConfig();
  const finalUserData: any = {};

  configStore.isFormValidated = true;
  const worldStore = useWorld();
  worldStore.camera?.entryAnim();

  Object.entries(userData).forEach(([key, value]) => {
    switch (key) {
      case "plane":
        finalUserData.plane = {
          weight: configStore.worldParams[key].globalWeight,
          percentage: value,
        };
        break;
      case "transport":
        finalUserData.transport = {
          weight: configStore.worldParams[key].globalWeight,
          percentage: value,
        };
        break;
      case "meat":
        finalUserData.meat = {
          weight: configStore.worldParams[key].globalWeight,
          percentage: value,
        };
        break;
      case "promptIA":
        finalUserData.promptIA = {
          weight: configStore.worldParams[key].globalWeight,
          percentage: value,
        };
        break;
      case "products":
        finalUserData.products = {
          weight: configStore.worldParams[key].globalWeight,
          percentage: value,
        };
        break;
      case "phone":
        finalUserData.phone = {
          weight: configStore.worldParams[key].globalWeight,
          percentage: value,
        };
        break;
      case "energy":
        finalUserData.energy = {
          weight: configStore.worldParams[key].globalWeight,
          percentage: value,
        };
        break;
      case "clothes":
        finalUserData.clothes = {
          weight: configStore.worldParams[key].globalWeight,
          percentage: value,
        };
        break;
      default:
        console.log("unknow param");
        break;
    }
  });

  configStore.userConfig = finalUserData;

  calculateExperienceSteps();
  setupObjectsData();
  moveToStep(0);
}

function calculateExperienceSteps() {
  const configStore = useConfig();
  const currentYear = configStore.configParams.currentYear;
  const targetYear = configStore.configParams.targetYear;
  const yearsPerStep = configStore.configParams.yearsStep;

  const stepYears: number[] = [currentYear];

  let nextYear = currentYear + yearsPerStep;
  while (nextYear < targetYear - yearsPerStep) {
    stepYears.push(nextYear);
    nextYear += yearsPerStep;
  }

  if (stepYears[stepYears.length - 1] !== targetYear) {
    stepYears.push(targetYear);
  }

  const totalSteps = stepYears.length - 1;

  const worldStateSteps = [];

  const targetTemperature = calculateMaxTemperature();

  for (let i = 0; i <= totalSteps; i++) {
    const progress = i / totalSteps;

    const worldState: any = {
      params: {},
      impacts: {},
    };
    worldState.year = stepYears[i];
    Object.entries(configStore.userConfig).forEach(([key, value]) => {
      worldState.params[key] = value.percentage * progress;
    });
    worldState.temperature =
      configStore.configParams.currentTemperature +
      progress *
        (targetTemperature - configStore.configParams.currentTemperature);

    const currentWorldImpacts = {} as any;
    Object.keys(configStore.worldImpacts).forEach((impactKey) => {
      currentWorldImpacts[impactKey] = {
        value: 0,
      };
    });

    Object.values(configStore.worldParams).forEach((param: any) => {
      const paramValue = worldState.params[param.name];

      if (paramValue !== undefined) {
        param.impacts.forEach((impact: any) => {
          if (currentWorldImpacts[impact.type]) {
            currentWorldImpacts[impact.type].value +=
              paramValue * impact.weight;
          }
        });
      }
    });
    worldState.impacts = currentWorldImpacts;
    worldStateSteps.push(worldState);
  }
  configStore.worldStateSteps = worldStateSteps;
  console.log(worldStateSteps);
}

function calculateMaxTemperature() {
  const configStore = useConfig();

  const globalPercentage = Object.entries(
    configStore.userConfig
  ).reduce<number>((acc, [key, value]) => {
    const weight = value.weight;
    return acc + value.percentage * weight;
  }, 0);

  configStore.globalPercentage = globalPercentage;
  let targetTemp: number;
  if (configStore.configParams.pivotScore >= globalPercentage) {
    console.log("POLLUE PAS");
    const improvementRatio =
      (configStore.configParams.pivotScore - globalPercentage) /
      configStore.configParams.pivotScore;
    console.log(improvementRatio);

    console.log(
      configStore.configParams.currentTemperature -
        improvementRatio *
          (configStore.configParams.currentTemperature -
            configStore.configParams.minTemperature)
    );

    targetTemp =
      configStore.configParams.currentTemperature -
      improvementRatio *
        (configStore.configParams.currentTemperature -
          configStore.configParams.minTemperature);
  } else {
    const degradationRatio =
      (globalPercentage - configStore.configParams.pivotScore) /
      (100 - configStore.configParams.pivotScore);

    targetTemp =
      configStore.configParams.currentTemperature +
      degradationRatio *
        (configStore.configParams.maxTemperature -
          configStore.configParams.currentTemperature);
  }

  return targetTemp;
}

function setupObjectsData() {
  const worldStore = useWorld();
  const configStore = useConfig();

  const objectDataMap: Record<string, any> = {
    trees: configStore.objectsData.trees,
    bushes: configStore.objectsData.bushes,
    flowers: configStore.objectsData.flowers,
    water: configStore.objectsData.water,
  };

  worldStore.paramsParts.forEach((paramPart) => {
    const objectType = Object.keys(objectDataMap).find((key) =>
      paramPart.name.includes(key)
    );

    if (objectType) {
      paramPart.children.forEach((child) => {
        child.userData = objectDataMap[objectType];
      });
    }
  });
}
