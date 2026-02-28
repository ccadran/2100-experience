<script lang="ts" setup>
import gsap from "gsap";
import { storeToRefs } from "pinia";
import { delay } from "~/webgl/utils";

const webSocketStore = useWebSocket();
const { userName } = storeToRefs(webSocketStore);

const modals = ref<HTMLElement>();
const modal1 = ref<HTMLElement>();
const modal2 = ref<HTMLElement>();
const modal3 = ref<HTMLElement>();
const mascot = ref<HTMLElement>();

const isModal2revealed = ref<boolean>(false);
const isModal3revealed = ref<boolean>(false);

const configStore = useConfig();

function revealModal1() {
  return gsap
    .timeline({ defaults: { ease: "cubic-bezier(0.25, 0.95, 0, 1)" } })
    .fromTo(
      modal1.value!,
      { x: "150%" },
      { x: "0%", duration: 0.75, ease: "elastic.out(0.8,0.7)" },
      0,
    )
    .fromTo(
      mascot.value!,
      { rotation: 30, opacity: 0, x: "100%" },
      { rotation: 0, opacity: 1, x: "0%" },
      0,
    );
}

function revealModal2() {
  return gsap.fromTo(
    modal2.value!,
    { x: "150%", rotation: 0 },
    {
      x: "0%",
      rotation: -4,
      duration: 0.75,
      ease: "elastic.out(0.8,0.7)",
      onComplete() {
        isModal2revealed.value = true;
      },
    },
  );
}

function revealModal3() {
  return gsap.fromTo(
    modal3.value!,
    { x: "150%", rotation: 0 },
    {
      x: "0%",
      rotation: 4,
      duration: 0.75,
      ease: "elastic.out(0.8,0.7)",
      onComplete() {
        isModal3revealed.value = true;
      },
    },
  );
}

function hideModals() {
  const hideTl = gsap.timeline({
    defaults: { ease: "power3.inOut" },
    overwrite: true,
  });

  if (isModal3revealed.value) {
    hideTl.add(gsap.to(modal3.value!, { x: "150%" }), 0);
  }
  if (isModal2revealed.value) {
    hideTl.add(gsap.to(modal2.value!, { x: "150%" }), 0.05);
  }
  hideTl
    .to(modals.value!, { x: "150%" }, 0.085)
    .to(mascot.value!, { rotation: 30, opacity: 0 }, 0.125);
}

onMounted(() => {
  animConfigModals();
});

async function animConfigModals() {
  if (configStore?.isFormValidated) return;
  await delay(8000);

  gsap.set(modals.value!, { display: "flex", x: "0%" });
  await revealModal1();
  await delay(8000);

  if (configStore?.isFormValidated) return;
  await revealModal2();
  await delay(8000);

  if (configStore?.isFormValidated) return;
  await revealModal3();
}

defineExpose({ animConfigModals, hideModals });
</script>

<template>
  <div class="modalConfig" ref="modals">
    <div class="modals-container">
      <div class="modal modal-1" ref="modal1">
        <p>
          {{ userName ?? "Il" }} attend que tu configures son monde. Fait le sur
          ton tel, il est impatient !
        </p>
      </div>
      <div class="modal modal-2" ref="modal2">
        <p>
          {{ userName ?? "Il" }} observe chacun de tes choix… continue sur ton
          téléphone, il a hâte de découvrir le résultat !
        </p>
      </div>
      <div class="modal modal-3" ref="modal3">
        <p>
          Pendant que tu configures son univers sur mobile,
          {{ userName ?? "Il" }} retient son souffle… surprends-le !
        </p>
      </div>
    </div>
    <div class="mascot" ref="mascot">
      <video src="/videos/2-dance.webm" autoplay loop muted></video>
    </div>
  </div>
</template>

<style lang="scss">
.modalConfig {
  display: none;
  position: absolute;
  bottom: 5vh;
  right: 60px;
  z-index: 2;
  z-index: 200;
  > .modals-container {
    position: relative;
    width: 100%;
    height: 100%;
    width: 31vw;
    display: grid;

    > .modal {
      // position: absolute;
      transform: translateX(150%);
      grid-area: 1/1;
      border-radius: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 3.125vw;
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
        font-size: 1.56vw;
        text-align: center;
      }
    }
  }
  > .mascot {
    position: absolute;
    top: -18vw;
    width: 28vw;
    height: auto;
    aspect-ratio: 459/334;
    // left: 50%;
    transform: translateX(-50%);
    z-index: -1;
    > video {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
}
</style>
