<script lang="ts" setup></script>

<template>
  <div class="block-mobile">
    <div class="modal">
      <p>Sorry ! L'éxpérience est disponible sur desktop uniquement</p>
    </div>
  </div>
</template>

<style lang="scss">
.block-mobile {
  width: 100vw;
  height: 100vh;
  z-index: 10000;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url("/images/mobile-bg.webp") no-repeat center center / cover;
  > .modal {
    padding: 32px;
    border-radius: 16px;
    width: 80vw;
    background: var(
      --white-gradient,
      linear-gradient(
        0deg,
        rgba(255, 255, 255, 0.5) 0%,
        rgba(255, 255, 255, 0.5) 100%
      ),
      linear-gradient(180deg, #fcfcfc 0%, #d1d1d1 100%)
    );
    box-shadow:
      0 -2px 4px 0 rgba(0, 0, 0, 0.25) inset,
      -26px 82px 24px 0 rgba(0, 0, 0, 0),
      -17px 52px 22px 0 rgba(0, 0, 0, 0),
      -9px 29px 19px 0 rgba(0, 0, 0, 0.01),
      -4px 13px 14px 0 rgba(0, 0, 0, 0.01),
      -1px 3px 8px 0 rgba(0, 0, 0, 0.02);
    > p {
      text-align: center;
      font-size: 16px;
    }
  }
  @media screen and (min-width: 991px) {
    display: none;
  }
}
</style>
