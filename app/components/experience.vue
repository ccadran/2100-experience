<script lang="ts" setup>
const configStore = useConfig();
const { muteSound, unmuteSound, isMuted } = useAudio();

function soundToggle() {
  console.log("btn clicked");

  if (isMuted.value) {
    unmuteSound();
  } else {
    muteSound();
  }
}
</script>

<template>
  <div class="experience">
    <Scene />
  </div>
</template>

<style lang="scss">
.experience {
  height: 100vh;
  width: 100vw;
  position: fixed;
}
</style>
