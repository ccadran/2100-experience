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
  sceneTransition,
} from "~/webgl/scene/experience";
import { useSocket } from "~/composables/useSocket";
import { useSocketHandler } from "~/composables/useSocketHandler";
import QRCode from "qrcode";

const { connect, joinRoom, sendAction, on } = useSocket();
const { listenForUpdates } = useSocketHandler();

const isDebug = ref<boolean>(true);

const id = Math.random().toString(36).substring(2, 10);
const roomId = id;

onMounted(async () => {
  await initScene();

  setTimeout(() => {
    sceneTransition();
  }, 500);

  uiStore.isLoaded = true;
  listenForUpdates();
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
});
const worldStore = useWorld();
const webSocketStore = useWebSocket();
const uiStore = useUi();

const userData = {
  plane: 42,
  transport: 85,
  meat: 70,
  promptIA: 55,
  products: 30,
  phone: 10,
  energy: 68,
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
  <div class="webgl">
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
    <div class="clouds-transition">
      <img class="cloud" src="/assets/cloud.webp" alt="" />
      <img class="cloud" src="/assets/cloud.webp" alt="" />
      <img class="cloud" src="/assets/cloud.webp" alt="" />
      <img class="cloud" src="/assets/cloud.webp" alt="" />
    </div>
  </section>
  <section v-else>
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
.clouds-transition {
  height: 100vh;
  width: 100vw;
  position: fixed;
  z-index: 100;
  top: 0;
  display: none;

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

button {
  width: fit-content;
  padding: 12px 16px;
  background-color: white;
  border: 1px solid black;
}
.loader,
.intro,
.form,
.experience {
  top: 0;
  height: 100vh;
  width: 100vw;
  position: fixed;
  z-index: 2;
}
.loader,
.intro {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
}
.intro {
  flex-direction: column;
  gap: 42px;
}
.form {
  display: flex;
  flex-direction: column;
  margin-top: 72px;
  align-items: center;
  > .buttons {
    display: flex;
    gap: 24px;
  }
}
.experience {
  > .controls {
    display: flex;
    flex-direction: column;
    align-items: end;
    right: 60px;
    > .step {
      display: flex;
      gap: 24px;
      margin-bottom: 92px;
    }
    > .camera {
      > .direction {
        width: 140px;
        height: 140px;
        position: relative;
        > button {
          position: absolute;
          &:nth-of-type(1) {
            top: 0;
            left: 50%;
            transform: translateX(-50%);
          }
          &:nth-of-type(2) {
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
          }
          &:nth-of-type(3) {
            left: 0;
            top: 50%;
            transform: translateY(-50%);
          }
          &:nth-of-type(4) {
            right: 0;
            top: 50%;
            transform: translateY(-50%);
          }
        }
      }
      > .zoom {
        margin-top: 42px;
        display: flex;
        gap: 24px;
      }
    }
  }
}
.controls {
  position: fixed;
  left: 50%;
  top: 200px;
  z-index: 1;
}
.webgl {
  width: 100vw;
  height: 100vh;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
