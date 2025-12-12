<script lang="ts" setup></script>

<template>
  <div class="modalsPhone">
    <p>
      Ton téléphone a <br />
      rejoint la partie
    </p>
  </div>
</template>

<style lang="scss">
.modalsPhone {
  z-index: 2;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 60px;
  border-radius: 32px;
  min-width: 28vw;

  background: var(
    --white-gradient,
    linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.5) 0%,
      rgba(255, 255, 255, 0.5) 100%
    ),
    linear-gradient(180deg, #fcfcfc 0%, #d1d1d1 100%)
  );
  box-shadow: 0 -2px 4px 0 rgba(0, 0, 0, 0.25) inset,
    -26px 82px 24px 0 rgba(0, 0, 0, 0), -17px 52px 22px 0 rgba(0, 0, 0, 0),
    -9px 29px 19px 0 rgba(0, 0, 0, 0.01), -4px 13px 14px 0 rgba(0, 0, 0, 0.01),
    -1px 3px 8px 0 rgba(0, 0, 0, 0.02);
  display: flex;
  justify-content: center;
  > p {
    font-size: 1.6vw;
    text-align: center;
  }
  &:before {
    content: "";
    background-image: url("/icons/check.webp");
    background-position: center;
    background-repeat: no-repeat;
    width: 160px;
    height: 160px;
    object-fit: contain;
    position: absolute;
    top: -50%;
    transform: scale(0.8);
  }
}
</style>
