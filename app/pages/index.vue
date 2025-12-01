<script lang="ts" setup>
import {
  handleFormValidations,
  initScene,
  revealElements,
} from "~/webgl/scene/config";
import { handleCameraMovements, moveToStep } from "~/webgl/scene/experience";
import { useWorld } from "~/stores/world";

onMounted(() => {
  initScene();
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
  <div class="webgl">
    <canvas></canvas>
  </div>

  <h1 @click="revealElements">REVEAL</h1>
  <h2 @click="handleFormValidations(userData)">validate</h2>
  <h3 @click="moveToStep(2)">validate</h3>
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
h1 {
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
</style>
