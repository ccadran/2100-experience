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

      /*__________STEP CONTROL_________*/
      case "NEXT_STEP":
        moveToStep("next");
        console.log("PAYLOAD SEND A NEXT STEP TASK");
        break;
      case "PREVIOUS_STEP":
        moveToStep("previous");
        console.log("PAYLOAD SEND A PREVIOUS STEP TASK");
        break;
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
