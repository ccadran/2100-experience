<script lang="ts" setup>
import {
  handleFormValidations,
  initScene,
  revealElements,
} from "~/webgl/scene/config";
import { handleCameraMovements, moveToStep } from "~/webgl/scene/experience";
import { useWorld } from "~/stores/world";

const isLoading = ref<boolean>(true);

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
</script>

<template>
  <transition>
    <div class="loader" v-if="isLoading">
      <h1>2100 currently loading...</h1>
    </div>
  </transition>
  <div class="webgl">
    <canvas></canvas>
  </div>

  <h1 class="reveal" @click="revealElements">REVEAL</h1>
  <h2 @click="handleFormValidations(userData)">validate</h2>
  <h3 @click="moveToStep('next')">next</h3>
  <h4 @click="moveToStep('previous')">previous</h4>
  <div class="controls">
    <p
      @mousedown="handleCameraMovements('forward', true)"
      @mouseup="handleCameraMovements('forward', false)"
    >
      forward
    </p>
    <p
      @mousedown="handleCameraMovements('back', true)"
      @mouseup="handleCameraMovements('back', false)"
    >
      back
    </p>
    <p
      @mousedown="handleCameraMovements('left', true)"
      @mouseup="handleCameraMovements('left', false)"
    >
      left
    </p>
    <p
      @mousedown="handleCameraMovements('right', true)"
      @mouseup="handleCameraMovements('right', false)"
    >
      right
    </p>
    <p
      @mousedown="handleCameraMovements('down', true)"
      @mouseup="handleCameraMovements('down', false)"
    >
      down
    </p>
    <p
      @mousedown="handleCameraMovements('up', true)"
      @mouseup="handleCameraMovements('up', false)"
    >
      up
    </p>
  </div>
</template>

<style lang="scss">
.loader {
  height: 100vh;
  width: 100vw;
  position: fixed;
  z-index: 5;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
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
.reveal {
  position: fixed;
  z-index: 1;
  top: 0;
}
h2 {
  position: fixed;
  z-index: 1;
  top: 80px;
}
h3 {
  position: fixed;
  z-index: 1;
  top: 180px;
}
h4 {
  position: fixed;
  z-index: 1;
  top: 220px;
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
