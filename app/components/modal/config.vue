<script lang="ts" setup></script>

<template>
  <div class="modalConfig">
    <div class="modals-container">
      <div class="modal modal-1">
        <p>
          %name attend que tu configures son monde. Fait le sur ton tel, il est
          impatient !
        </p>
      </div>
      <div class="modal modal-2">
        <p>
          %name observe chacun de tes choix… continue sur ton téléphone, il a
          hâte de découvrir le résultat !
        </p>
      </div>
      <div class="modal modal-3">
        <p>
          Pendant que tu configures son univers sur mobile, %name retient son
          souffle… surprends-le !"
        </p>
      </div>
    </div>
    <div class="mascot">
      <img src="/images/mascot.webp" alt="" />
    </div>
  </div>
</template>

<style lang="scss">
.modalConfig {
  position: absolute;
  bottom: 5vh;
  right: 60px;
  z-index: 2;
  > .modals-container {
    position: relative;
    width: 100%;
    height: 100%;
    width: 31vw;
    display: grid;

    > .modal {
      // position: absolute;
      grid-area: 1/1;
      border-radius: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 60px;
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
        -9px 29px 19px 0 rgba(0, 0, 0, 0.01),
        -4px 13px 14px 0 rgba(0, 0, 0, 0.01), -1px 3px 8px 0 rgba(0, 0, 0, 0.02);
      > p {
        text-align: center;
      }
    }
  }
  > .mascot {
    position: absolute;
    top: -150%;
    width: auto;
    height: 28vh;
    aspect-ratio: 459/334;
    z-index: -1;
    > img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
}
</style>
