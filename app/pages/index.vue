<script lang="ts" setup>
import {
  handleFormValidations,
  initScene,
  revealElements,
} from "~/webgl/scene/config";
import {
  handleCameraMovements,
  handleCameraZoom,
  moveToStep,
} from "~/webgl/scene/experience";
import { useSocket } from "~/composables/useSocket";
import { useSocketHandler } from "~/composables/useSocketHandler";
import QRCode from "qrcode";
import CloudsTransition from "~/webgl/scene/Clouds";

const { connect, joinRoom, sendAction, on } = useSocket();
const { listenForUpdates } = useSocketHandler();

const uiStore = useUi();

const isDebug = ref<boolean>(true);

const id = Math.random().toString(36).substring(2, 10);
const roomId = id;

onMounted(async () => {
  await initScene();
  uiStore.cloudsTransition = new CloudsTransition();

  // setTimeout(() => {
  //   uiStore.cloudsTransition?.showClouds();
  //   //   sceneTransition();
  // }, 500);

  uiStore.isLoaded = true;
  listenForUpdates();
  if (!isDebug) {
    connect();
    on("connect", () => {
      joinRoom(roomId);

      nextTick(() => {
        const canvasQr = document.querySelector(".qrcode") as HTMLCanvasElement;
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
});
const worldStore = useWorld();
const webSocketStore = useWebSocket();

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

// const userData = {
//   plane: 0,
//   transport: 0,
//   meat: 100,
//   promptIA: 0,
//   products: 0,
//   phone: 0,
//   energy: 0,
//   clothes: 0,
// };
// const userData = {
//   plane: 100,
//   transport: 100,
//   meat: 100,
//   promptIA: 100,
//   products: 100,
//   phone: 100,
//   energy: 100,
//   clothes: 100,
// };

// const roomId = "ROOM_1";

function handleWsCo() {
  connect();
  on("connect", () => {
    joinRoom(roomId);
    console.log("test");
  });
  console.log(webSocketStore.isConnected);
}

const zoomState = ref<number>(0);

function zoom(direction: string) {
  if (direction === "up") {
    zoomState.value += 1;
  } else {
    zoomState.value -= 1;
  }
  zoomState.value = Math.max(zoomState.value, -10);
  zoomState.value = Math.min(zoomState.value, 10);

  handleCameraZoom(zoomState.value);
}
</script>

<template>
  <main>
    <div class="loader">
      <div class="logo">
        <img src="/assets/logo.webp" alt="" />
      </div>
      <div class="loader-progress">
        <div class="inner"></div>
      </div>
    </div>
    <div class="clouds-transition">
      <img class="cloud" src="/assets/cloud.webp" alt="" />
      <img class="cloud" src="/assets/cloud.webp" alt="" />
      <img class="cloud" src="/assets/cloud.webp" alt="" />
      <img class="cloud" src="/assets/cloud.webp" alt="" />
    </div>
    <!-- <section class="loader"></section> -->
  </main>
  <!-- <div class="webgl">
    <canvas></canvas>
  </div>
  <section v-if="isDebug">
    <transition>
      <div class="loader" v-if="!uiStore.isLoaded">
        <h1>2100 currently loading...</h1>
      </div>
    </transition>
    <transition>
      <div class="intro" v-if="!webSocketStore.isConnected && uiStore.isLoaded">
        <button @click="handleWsCo">Co to server</button>
      </div>
    </transition>
    <transition>
      <div
        class="form"
        v-if="webSocketStore.isConnected && !uiStore.isFormValidated"
      >
        <div class="buttons">
          <button @click="revealElements">formstep validate</button>
          <button @click="handleFormValidations(userData)">
            VALIDATE FORM
          </button>
        </div>
      </div>
    </transition>
    <transition>
      <div class="experience" v-if="uiStore.isFormValidated">
        <div class="controls">
          <div class="step">
            <button @click="moveToStep('previous')">previous</button>
            <button @click="moveToStep('next')">next</button>
          </div>
          <div class="camera">
            <div class="direction">
              <button
                @mousedown="handleCameraMovements('forward', 5)"
                @mouseup="handleCameraMovements('forward', 0)"
              >
                forward
              </button>
              <button
                @mousedown="handleCameraMovements('back', 5)"
                @mouseup="handleCameraMovements('back', 0)"
              >
                back
              </button>
              <button
                @mousedown="handleCameraMovements('left', 5)"
                @mouseup="handleCameraMovements('left', 0)"
              >
                left
              </button>
              <button
                @mousedown="handleCameraMovements('right', 5)"
                @mouseup="handleCameraMovements('right', 0)"
              >
                right
              </button>
            </div>
            <div class="zoom">
              <button @mousedown="zoom('down')">down</button>
              <button @mousedown="zoom('up')">up</button>
            </div>
          </div>
        </div>
      </div>
    </transition>
    
  </section> -->
  <section v-if="!isDebug">
    <transition>
      <div class="loader" v-if="!uiStore.isLoaded">
        <h1>2100 currently loading...</h1>
      </div>
    </transition>
    <transition>
      <div class="intro" v-if="!webSocketStore.isRoomFull && uiStore.isLoaded">
        <h1>SCAN LE QR CODE POUR COMMENCER L'EXPERIENCE</h1>
        <canvas class="qrcode" style="width: 500px; height: 500px"></canvas>
      </div>
    </transition>
    <transition>
      <div
        class="form"
        v-if="webSocketStore.isRoomFull && !uiStore.isFormValidated"
      >
        <h2>REMPLISSER LE FORM SUR VORE PHONE</h2>
        <div class="buttons">
          <button @click="revealElements">formstep validate</button>
          <button @click="handleFormValidations(userData)">
            VALIDATE FORM
          </button>
        </div>
      </div>
    </transition>
    <transition>
      <div class="experience" v-if="uiStore.isFormValidated">
        <div class="controls">
          <div class="step">
            <button @click="moveToStep('previous')">previous</button>
            <button @click="moveToStep('next')">next</button>
          </div>
          <div class="camera">
            <div class="direction">
              <button
                @mousedown="handleCameraMovements('forward', 5)"
                @mouseup="handleCameraMovements('forward', 0)"
              >
                forward
              </button>
              <button
                @mousedown="handleCameraMovements('back', 5)"
                @mouseup="handleCameraMovements('back', 0)"
              >
                back
              </button>
              <button
                @mousedown="handleCameraMovements('left', 5)"
                @mouseup="handleCameraMovements('left', 0)"
              >
                left
              </button>
              <button
                @mousedown="handleCameraMovements('right', 5)"
                @mouseup="handleCameraMovements('right', 0)"
              >
                right
              </button>
            </div>
            <div class="zoom">
              <button @mousedown="zoom('down')">down</button>
              <button @mousedown="zoom('up')">up</button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </section>
</template>

<style lang="scss">
main {
  height: 100vh;
  width: 100vw;
  position: fixed;
  > .loader {
    z-index: 1;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    gap: 140px;
    align-items: center;
    flex-direction: column;
    > .logo {
      transform: rotate(-5.65deg);
      width: 30vw;
      > img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
    > .loader-progress {
      width: 25vw;

      height: 52px;
      padding: 10px;
      border-radius: 24px;
      border: 2px solid transparent;
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
        width: 20%;
        height: 100%;
        background-color: var(--blue);
        box-shadow: 0 -2px 4px 0 rgba(0, 0, 0, 0.25) inset,
          -26px 82px 24px 0 rgba(0, 0, 0, 0), -17px 52px 22px 0 rgba(0, 0, 0, 0),
          -9px 29px 19px 0 rgba(0, 0, 0, 0.01),
          -4px 13px 14px 0 rgba(0, 0, 0, 0.01),
          -1px 3px 8px 0 rgba(0, 0, 0, 0.02);
      }
    }
  }
}
.clouds-transition {
  height: 100vh;
  width: 100vw;
  position: fixed;
  z-index: 0;
  top: 0;
  pointer-events: none;
  > .cloud {
    position: absolute;
    width: 130vw;
    &:nth-of-type(1) {
      left: -16%;
    }
    &:nth-of-type(2) {
      right: -17%;
      top: -37%;
      transform: rotate(180deg);
    }
    &:nth-of-type(3) {
      left: -50%;
      bottom: -50%;
    }
    &:nth-of-type(4) {
      left: 30%;
      bottom: -20%;
    }
  }
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
