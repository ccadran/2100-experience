<script lang="ts" setup>
import {
  handleFormValidations,
  initScene,
  revealElements,
} from "~/webgl/scene/config";
import { moveToStep } from "~/webgl/scene/experience";

onMounted(() => {
  initScene();
});

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
</template>

<style lang="scss">
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
