<script lang="ts" setup>
import { initScene, revealElements } from "~/webgl/scene/config";

onMounted(() => {
  initScene();
});
</script>

i
<template>
  <div class="webgl">
    <canvas></canvas>
  </div>

  <h1 @click="revealElements">REVEAL</h1>
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
</style>
