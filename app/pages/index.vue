<script lang="ts" setup>
import {
  handleFormValidations,
  initScene,
  revealElements,
} from "~/webgl/scene/config";
import { moveToStep, goToCameraSpot } from "~/webgl/scene/experience";
import { useSocket } from "~/composables/useSocket";
import { useSocketHandler } from "~/composables/useSocketHandler";
import QRCode from "qrcode";
import CloudsTransition from "~/webgl/scene/Clouds";
import gsap from "gsap";
import { delay } from "~/webgl/utils";

const modalResults = ref();
const { connect, joinRoom, sendAction, on } = useSocket();
const { listenForUpdates } = useSocketHandler(modalResults);

const uiStore = useUi();
const configStore = useConfig();

const loaderProgress = ref<HTMLElement>();
const loaderContainer = ref<HTMLElement>();
const appLogo = ref<HTMLElement>();
const qrCode = ref<HTMLElement>();
const qrCodeText = ref<HTMLElement>();
const modalPhone = ref();
const modalConfig = ref();

const webglContainer = ref<HTMLElement>();

const isSceneLoaded = ref<boolean>(false);

const webSocketStore = useWebSocket();
async function loaderAnim() {
  return gsap
    .timeline({
      defaults: { ease: "power1.inOut" },
    })
    .to(loaderProgress.value!, { width: "19%" })
    .to(
      loaderProgress.value!,
      { width: "42%", backgroundColor: "var(--pink)" },
      ">0.3"
    )
    .to(
      loaderProgress.value!,
      {
        width: "84%",
        backgroundColor: "var(--yellow)",
      },
      ">0.3"
    );
}

async function completeLoader() {
  return gsap.timeline().to(loaderProgress.value!, {
    width: "100%",
    backgroundColor: "var(--green)",
    onComplete: () => {
      uiStore.isLoaded = true;
    },
  });
}

async function revealQr() {
  return gsap
    .timeline({ defaults: { duration: 0.5 } })
    .fromTo(
      webglContainer.value!,
      { opacity: 0 },
      { opacity: 1, duration: 1 },
      0
    )
    .to(
      appLogo.value!,
      { top: "100px", width: "24vw", ease: "power1.inOut" },
      0
    )
    .to(loaderContainer.value!, { opacity: 0 }, 0)
    .fromTo(
      qrCode.value!,
      {
        scale: 0.3,
        opacity: 0,
        rotation: -90,
        transform: "translate(-50%, -50%)  scale(0.3)",
      },
      {
        opacity: 1,
        rotation: 0,
        transform: "translate(-50%, -50%)  scale(1.0)",
      },
      0.15
    )
    .to(qrCodeText.value!, { opacity: 1 }, 0);
}

async function revealMap() {
  return gsap
    .timeline({
      defaults: { ease: "cubic-bezier(0.25, 0.95, 0, 1)", duration: 0.75 },
      onStart() {
        uiStore.cloudsTransition?.hideClouds();
      },
    })
    .to(qrCode.value!, {
      scale: 0.6,
      opacity: 0,
      rotation: -90,
    })
    .to(qrCodeText.value!, { opacity: 0 }, 0)
    .to(appLogo.value!, { top: 0, width: "18vw" }, 0);
}

watch(
  () => webSocketStore.isRoomFull,
  async (newValue) => {
    console.log("isRoomFull", newValue);
    if (newValue) {
      await delay(1000);
      revealMap();

      await delay(1400);
      animConfigModals();
    }
  }
);

async function animConfigModals() {
  await modalPhone.value.revealModal();
  await delay(600);
  await modalPhone.value.hideModal();
  await delay(1000);
  await modalConfig.value.revealContainer();
  await delay(5000);
  if (configStore?.isFormValidated) return;
  await modalConfig.value.revealModal2();
  await delay(5000);
  if (configStore?.isFormValidated) return;
  await modalConfig.value.revealModal3();
}

watch(
  () => configStore?.isFormValidated,
  async (newValue) => {
    if (newValue) {
      modalConfig?.value?.hideModals();
    }
  }
);

onMounted(async () => {
  connectToWsServer();

  const tl = loaderAnim();

  isSceneLoaded.value = true;

  await Promise.all([initScene(), tl.then()]);

  uiStore.cloudsTransition = new CloudsTransition();

  await completeLoader();

  await revealQr();
});

function connectToWsServer() {
  nextTick(() => {
    const id = Math.random().toString(36).substring(2, 10);
    // const roomId = id;
    const roomId = "ROOM_1";
    connect();
    on("connect", () => {
      console.log("Client Socket.io connectéeeeeee");

      listenForUpdates();

      joinRoom(roomId);
      const canvasQr = document.querySelector(
        ".qrcode .inner"
      ) as HTMLCanvasElement;
      if (canvasQr) {
        QRCode.toCanvas(canvasQr, roomId, function (error: any) {
          if (error) console.error(error);
        });
      } else {
        console.error("Canvas .qrcode introuvable");
      }
    });
  });
}

const userData = {
  plane: 100,
  transport: 100,
  meat: 70,
  promptIA: 55,
  products: 30,
  phone: 10,
  energy: 100,
  clothes: 90,
};

function showResult() {
  modalResults.value.revealResultsModal();
}
function showExplanations() {
  modalResults.value.showExplanations();
}
function closeExplanations() {
  modalResults.value.closeExplanations();
}
function changeQuestion() {
  modalResults.value.changeQuestion(3);
}

function simulateWsCo() {
  webSocketStore.isRoomFull = true;
}
</script>

<template>
  <div class="controls-debug" v-if="webSocketStore.isRoomFull">
    <div class="form-controls" v-if="!configStore.isFormValidated">
      <h2>FORM</h2>
      <button @click="revealElements">simulate one form step validate</button>
      <button @click="handleFormValidations(userData)">
        Validate the form
      </button>
    </div>
    <div
      class="world-controls"
      v-if="
        configStore.isFormValidated &&
        configStore.currentStep !== configStore.worldStateSteps.length - 1
      "
    >
      <h2>YEARS</h2>
      <div
        class="years-controls"
        style="display: flex; flex-direction: column; gap: 24px"
      >
        <button @click="moveToStep(0)">2025</button>
        <button @click="moveToStep(1)">2050</button>
        <button @click="moveToStep(2)">2075</button>
        <button @click="moveToStep(3)">2100</button>
      </div>
      <h2>CAMERA SPOT</h2>
      <div
        class="camera-controls"
        style="display: flex; flex-direction: column; gap: 24px"
      >
        <button @click="goToCameraSpot(0)">spot 1</button>
        <button @click="goToCameraSpot(1)">spot 2</button>
        <button @click="goToCameraSpot(2)">spot 3</button>
      </div>
    </div>

    <div
      class="experienceEnds-control"
      v-if="configStore.currentStep === configStore.worldStateSteps.length - 1"
    >
      <h2>RESULTS</h2>
      <button @click="showResult()">Finish experience</button>
      <button @click="showExplanations()">Show explanations</button>
      <button @click="changeQuestion()">changeQuestions</button>
    </div>
  </div>
  <!-- <div style="position: fixed; top: 70px; display: flex; gap: 5px; z-index: 2">
  </div> -->

  <main>
    <div class="intro">
      <div class="logo" ref="appLogo">
        <img src="/images/logo.webp" alt="" />
      </div>
      <div class="loader-progress" ref="loaderContainer">
        <div class="inner" ref="loaderProgress"></div>
      </div>

      <div class="qrcode" ref="qrCode">
        <canvas class="inner"></canvas>
      </div>
      <p class="qr-text" ref="qrCodeText">
        Scan le code QR <br />
        pour te connecter
      </p>
      <button @click="simulateWsCo" v-if="!webSocketStore.isRoomFull">
        simulate co
      </button>
    </div>
    <ModalPhone ref="modalPhone" />
    <ModalConfig ref="modalConfig" />
    <Timeline />
    <ModalResults ref="modalResults" />

    <!-- <section class="loader"></section> -->
    <div class="webgl" ref="webglContainer">
      <canvas></canvas>
    </div>
    <div class="clouds-transition" key="clouds">
      <div class="cloud">
        <img src="/images/cloud.webp" alt="" />
      </div>
      <div class="cloud">
        <img src="/images/cloud.webp" alt="" />
      </div>
      <div class="cloud">
        <img src="/images/cloud.webp" alt="" />
      </div>
      <div class="cloud">
        <img src="/images/cloud.webp" alt="" />
      </div>
    </div>
  </main>
</template>

<style lang="scss">
.controls-debug {
  position: fixed;
  top: 24px;
  right: 24px;
  background-color: rgba(154, 154, 154, 0.4);
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  z-index: 2;
  padding: 24px;
  > div {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  button {
    padding: 12px 24px;
    background-color: white;
    border: 1px solid black;
    border-radius: 24px;
  }
}

main {
  height: 100vh;
  width: 100vw;
  position: fixed;
  > .intro {
    z-index: 2;
    position: fixed;
    height: 100vh;
    width: 100vw;
    > .logo {
      transform: rotate(-5.65deg);
      width: 28vw;
      position: absolute;
      top: 28vh;
      left: 50%;
      transform: translateX(-50%);
      > img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
    > .loader-progress {
      position: absolute;
      bottom: 28vh;
      left: 50%;
      transform: translateX(-50%);
      width: 25vw;

      height: 52px;
      padding: 10px;
      border-radius: 24px;
      box-shadow: 0 -2px 4px 0 rgba(0, 0, 0, 0.25) inset,
        -26px 82px 24px 0 rgba(0, 0, 0, 0), -17px 52px 22px 0 rgba(0, 0, 0, 0),
        -9px 29px 19px 0 rgba(0, 0, 0, 0.01),
        -4px 13px 14px 0 rgba(0, 0, 0, 0.01), -1px 3px 8px 0 rgba(0, 0, 0, 0.02);
      background: var(
        --white-gradient,
        linear-gradient(
          0deg,
          rgba(255, 255, 255, 0.5) 0%,
          rgba(255, 255, 255, 0.5) 100%
        ),
        linear-gradient(180deg, #fcfcfc 0%, #d1d1d1 100%)
      );
      > .inner {
        border-radius: 16px;
        width: 0%;
        height: 100%;
        background-color: var(--blue);
        box-shadow: 0 -2px 4px 0 rgba(0, 0, 0, 0.25) inset,
          -26px 82px 24px 0 rgba(0, 0, 0, 0), -17px 52px 22px 0 rgba(0, 0, 0, 0),
          -9px 29px 19px 0 rgba(0, 0, 0, 0.01),
          -4px 13px 14px 0 rgba(0, 0, 0, 0.01),
          -1px 3px 8px 0 rgba(0, 0, 0, 0.02);
      }
    }

    > .qrcode {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      opacity: 0;
      width: 15vw;
      height: auto;
      aspect-ratio: 1/1;
      box-shadow: 0 1.8px 7.2px 0 rgba(0, 0, 0, 0.25);
      border-radius: 32px;
      background-color: #fff;
      > canvas {
        border-radius: 32px;
        width: 100% !important;
        height: 100% !important;
      }
    }
    > .qr-text {
      font-size: 2.5vw;
      letter-spacing: 0.96px;
      left: 50%;
      position: absolute;
      bottom: 100px;
      transform: translateX(-50%);
      text-align: center;
      opacity: 0;
    }
  }
}

.webgl {
  height: 100vh;
  width: 100vw;
  position: fixed;
  z-index: 0;
  pointer-events: none;
  opacity: 0;
  padding: 30px 30px 10vh;
  box-sizing: border-box;

  > canvas {
    width: 100% !important;
    height: 100% !important;
    border-radius: 44px;
    object-fit: cover;
  }
}
.clouds-transition {
  height: 100vh;
  width: 100vw;
  position: fixed;
  z-index: 1;
  top: 0;
  pointer-events: none;

  > .cloud {
    position: absolute;
    width: 150vw;
    height: 100%;
    &:nth-of-type(1) {
      left: -40%;
      top: -22%;
    }
    &:nth-of-type(2) {
      right: -46%;
      top: -37%;
      transform: rotate(180deg);
    }
    &:nth-of-type(3) {
      left: -39%;
      bottom: -31%;
    }
    &:nth-of-type(4) {
      left: 30%;
      bottom: -20%;
    }
    > img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
}

.year-indicator {
  position: fixed;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;
  font-size: 32px;
  font-weight: bold;
  display: flex;
  gap: 12px;
  align-items: center;

  .current {
    color: black;
  }

  .preview {
    color: #999;
    font-size: 24px;
  }
}

.direction {
  position: fixed;
  top: 30px;
  z-index: 2;
}

// button {
//   width: fit-content;
//   padding: 12px 16px;
//   background-color: white;
//   border: 1px solid black;
// }
// .loader,
// .intro,
// .form,
// .experience {
//   top: 0;
//   height: 100vh;
//   width: 100vw;
//   position: fixed;
//   z-index: 2;
// }
// .loader,
// .intro {
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   background-color: white;
// }
// .intro {
//   flex-direction: column;
//   gap: 42px;
// }
// .form {
//   display: flex;
//   flex-direction: column;
//   margin-top: 72px;
//   align-items: center;
//   > .buttons {
//     display: flex;
//     gap: 24px;
//   }
// }
// .experience {
//   > .controls {
//     display: flex;
//     flex-direction: column;
//     align-items: end;
//     right: 60px;
//     > .step {
//       display: flex;
//       gap: 24px;
//       margin-bottom: 92px;
//     }
//     > .camera {
//       > .direction {
//         width: 140px;
//         height: 140px;
//         position: relative;
//         > button {
//           position: absolute;
//           &:nth-of-type(1) {
//             top: 0;
//             left: 50%;
//             transform: translateX(-50%);
//           }
//           &:nth-of-type(2) {
//             bottom: 0;
//             left: 50%;
//             transform: translateX(-50%);
//           }
//           &:nth-of-type(3) {
//             left: 0;
//             top: 50%;
//             transform: translateY(-50%);
//           }
//           &:nth-of-type(4) {
//             right: 0;
//             top: 50%;
//             transform: translateY(-50%);
//           }
//         }
//       }
//       > .zoom {
//         margin-top: 42px;
//         display: flex;
//         gap: 24px;
//       }
//     }
//   }
// }
// .controls {
//   position: fixed;
//   left: 50%;
//   top: 200px;
//   z-index: 1;
// }
// .webgl {
//   width: 100vw;
//   height: 100vh;
// }

// .v-enter-active,
// .v-leave-active {
//   transition: opacity 0.5s;
// }

// .v-enter-from,
// .v-leave-to {
//   opacity: 0;
// }
</style>
