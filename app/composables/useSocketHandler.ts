import { handleFormValidations, revealElements } from "~/webgl/scene/config";
import {
  handleCameraMovements,
  handleCameraZoom,
  moveToStep,
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
      //FORWARD
      case "CAMERA_FORWARD":
        handleCameraMovements("forward", payload.data.strength);
        console.log("PAYLOAD SEND A CAMERA FORWARD TASK");
        break;
      //BACK
      case "CAMERA_BACK":
        handleCameraMovements("back", payload.data.strength);
        console.log("PAYLOAD SEND A CAMERA BACK TASK");
        break;
      //LEFT
      case "CAMERA_LEFT":
        handleCameraMovements("left", payload.data.strength);
        console.log("PAYLOAD SEND A CAMERA LEFT TASK");
        break;
      //RIGHT
      case "CAMERA_RIGHT":
        handleCameraMovements("right", payload.data.strength);
        console.log("PAYLOAD SEND A CAMERA RIGHT TASK");
        break;
      //UP
      case "CAMERA_ZOOM":
        handleCameraZoom("up", payload.data.value);
        console.log("PAYLOAD SEND A CAMERA UP PRESSED TASK");
        break;
      default:
        break;
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
