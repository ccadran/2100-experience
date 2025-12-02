<script lang="ts" setup>
import {
  handleFormValidations,
  initScene,
  revealElements,
} from "~/webgl/scene/config";
import { handleCameraMovements, moveToStep } from "~/webgl/scene/experience";
import { useWorld } from "~/stores/world";

const isLoading = ref<boolean>(true);
const isConnected = ref<boolean>(false);
const isFormValidate = ref<boolean>(false);

onMounted(async () => {
  await initScene();
  isLoading.value = false;
});
const worldStore = useWorld();

const userData = {
  plane: 100,
  dailyTransport: 70,
  food: 30,
  energy: 80,
  consumption: 44,
};

function validateForm() {
  handleFormValidations(userData);
  isFormValidate.value = true;
}
</script>

<template>
  <div class="webgl">
    <canvas></canvas>
  </div>
  <transition>
    <div class="loader" v-if="isLoading">
      <h1>2100 currently loading...</h1>
    </div>
  </transition>
  <transition>
    <div class="intro" v-if="!isConnected && !isLoading">
      <h1>SCAN LE QR CODE POUR COMMENCER L'EXPERIENCE</h1>
      <button @click="isConnected = true">simulate co</button>
    </div>
  </transition>
  <transition>
    <div class="form" v-if="isConnected && !isFormValidate">
      <h2>REMPLISSER LE FORM SUR VORE PHONE</h2>
      <div class="buttons">
        <button @click="revealElements">formstep validate</button>
        <button @click="validateForm">VALIDATE FORM</button>
      </div>
    </div>
  </transition>
  <transition>
    <div class="experience" v-if="isFormValidate">
      <div class="controls">
        <div class="step">
          <button @click="moveToStep('previous')">previous</button>
          <button @click="moveToStep('next')">next</button>
        </div>
        <div class="camera">
          <div class="direction">
            <button
              @mousedown="handleCameraMovements('forward', true)"
              @mouseup="handleCameraMovements('forward', false)"
            >
              forward
            </button>
            <button
              @mousedown="handleCameraMovements('back', true)"
              @mouseup="handleCameraMovements('back', false)"
            >
              back
            </button>
            <button
              @mousedown="handleCameraMovements('left', true)"
              @mouseup="handleCameraMovements('left', false)"
            >
              left
            </button>
            <button
              @mousedown="handleCameraMovements('right', true)"
              @mouseup="handleCameraMovements('right', false)"
            >
              right
            </button>
          </div>
          <div class="zoom">
            <button
              @mousedown="handleCameraMovements('down', true)"
              @mouseup="handleCameraMovements('down', false)"
            >
              down
            </button>
            <button
              @mousedown="handleCameraMovements('up', true)"
              @mouseup="handleCameraMovements('up', false)"
            >
              up
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style lang="scss">
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
