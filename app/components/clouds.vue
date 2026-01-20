<script lang="ts" setup></script>

<template>
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
</template>

<style lang="scss">
.clouds-transition {
  height: 100vh;
  width: 100vw;
  position: fixed;
  z-index: 2;
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
</style>
