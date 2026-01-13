import { handleFormValidations, revealElements } from "~/webgl/scene/config";
import {
  moveToStep,
  goToCameraSpot
} from "~/webgl/scene/experience";

interface IncomingPayload {
  type: string;
  data: any;
  [key: string]: any;
}

export function useSocketHandler() {
  const webSocketStore = useWebSocket();
  console.log(webSocketStore.isConnected);

  const { on, off } = useSocket();


  // 2s d'attente avant de changer d'annee
  let pendingYear: number | null = null;
  let yearValidationTimeout: ReturnType<typeof setTimeout> | null = null;
  const YEAR_VALIDATION_DELAY = 2000;

  function handleIncomingPayload(payload: IncomingPayload) {
    console.log(payload);

    switch (payload.type) {
      /*_______FORMS_____*/
      case "REVEAL":
        console.log("PAYLOAD SEND A REVEAL TASK");

        revealElements();
        break;
      case "VALIDATE_FORM":
        console.log("data", payload.data);

        handleFormValidations(payload.data);
        console.log("PAYLOAD SEND A COMPLETE FORM");
        break;

        
      /*__________YEAR CONTROL_________*/
      case "YEARS": {
        const uiStore = useUi();
        const configStore = useConfig();

        const year = payload.data.strength;
        pendingYear = year;
        uiStore.previewYear = year;

        if (yearValidationTimeout) {
          clearTimeout(yearValidationTimeout);
        }

        yearValidationTimeout = setTimeout(() => {
          const stepIndex = configStore.worldStateSteps.findIndex(
            (step) => step.year === pendingYear
          );

          if (stepIndex === -1) return;

          if (
            configStore.worldStateSteps[configStore.currentStep]?.year ===
            pendingYear
          ) {
            uiStore.previewYear = null;
            pendingYear = null;
            return;
          }

          moveToStep(stepIndex);

          uiStore.previewYear = null;
          pendingYear = null;
          yearValidationTimeout = null;
        }, YEAR_VALIDATION_DELAY);
        break;
      }


      //to mobile
      case "WORLD_STEPS":
        console.log("PAYLOAD SEND THE WORLD STATES");
        break;

      /*__________CAMERA CONTOLS_______*/
      case "CAMERA_SPOT": {
        const index = payload.data.strength - 1;
        goToCameraSpot(index);
        console.log("CAMERA_SPOT → go to spot", index);
        break;
      }

      //UP
      // case "CAMERA_ZOOM":
      //   handleCameraZoom(payload.data.value);
      //   console.log("PAYLOAD SEND A CAMERA UP PRESSED TASK");
      //   break;
      // default:
      //   break;
    }
  }

  function handleRoomCo(payload: IncomingPayload) {
    console.log(payload);

    if (payload.type === "ROOM_COUNT") {
      if (payload.count > 1) {
        webSocketStore.isRoomFull = true;
      }
    }
  }

  const listenForUpdates = () => {
    on("update-client", handleIncomingPayload);
    on("room-count", handleRoomCo);
    console.log("Écouteur 'update-client' activé.");
  };

  const stopListening = () => {
    off("update-client", handleIncomingPayload);
    console.log("Écouteur 'update-client' désactivé.");
  };

  return {
    listenForUpdates,
    stopListening,
  };
}
