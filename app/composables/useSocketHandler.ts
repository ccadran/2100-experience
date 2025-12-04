import { handleFormValidations, revealElements } from "~/webgl/scene/config";
import { handleCameraMovements, moveToStep } from "~/webgl/scene/experience";

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
      case "CAMERA_FORWARD_PRESSED":
        handleCameraMovements("forward", true);
        console.log("PAYLOAD SEND A CAMERA FORWARD PRESSED TASK");
        break;
      case "CAMERA_FORWARD_RELEASED":
        handleCameraMovements("forward", false);
        console.log("PAYLOAD SEND A CAMERA FORWARD PRESSED TASK");
        break;
      //BACK
      case "CAMERA_BACK_PRESSED":
        handleCameraMovements("back", true);
        console.log("PAYLOAD SEND A CAMERA BACK PRESSED TASK");
        break;
      case "CAMERA_BACK_RELEASED":
        handleCameraMovements("back", false);
        console.log("PAYLOAD SEND A CAMERA BACK PRESSED TASK");
        break;
      //LEFT
      case "CAMERA_LEFT_PRESSED":
        handleCameraMovements("left", true);
        console.log("PAYLOAD SEND A CAMERA LEFT PRESSED TASK");
        break;
      case "CAMERA_LEFT_RELEASED":
        console.log("PAYLOAD SEND A CAMERA LEFT PRESSED TASK");
        handleCameraMovements("left", false);
        break;
      //RIGHT
      case "CAMERA_RIGHT_PRESSED":
        handleCameraMovements("right", true);
        console.log("PAYLOAD SEND A CAMERA RIGHT PRESSED TASK");
        break;
      case "CAMERA_RIGHT_RELEASED":
        console.log("PAYLOAD SEND A CAMERA RIGHT PRESSED TASK");
        handleCameraMovements("right", false);
        break;
      //UP
      case "CAMERA_UP_PRESSED":
        console.log("PAYLOAD SEND A CAMERA UP PRESSED TASK");
        break;
      case "CAMERA_UP_RELEASED":
        console.log("PAYLOAD SEND A CAMERA UP PRESSED TASK");
        break;
      //DOWN
      case "CAMERA_DOWN_PRESSED":
        console.log("PAYLOAD SEND A CAMERA DOWN PRESSED TASK");
        break;
      case "CAMERA_DOWN_RELEASED":
        console.log("PAYLOAD SEND A CAMERA DOWN PRESSED TASK");
        break;

      default:
        break;
    }
  }

  const listenForUpdates = () => {
    on("update-client", handleIncomingPayload);
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
