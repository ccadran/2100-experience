<script lang="ts" setup>
import gsap from "gsap";
const configStore = useConfig();
const { muteSound, unmuteSound, isMuted } = useAudio();
const socketStore = useWebSocket();
const uiStore = useUi();

function soundToggle() {
  console.log("btn clicked");

  if (isMuted.value) {
    unmuteSound();
  } else {
    muteSound();
  }
}

watch(
  () => uiStore.isLoaded,
  (newValue) => {
    if (newValue) {
      revealEnterBtns();
    }
  },
);
let enterTl: gsap.core.Timeline;
async function enterExperience(muted?: boolean) {
  if (muted) muteSound();
  await enterTl.reverse().then();
  uiStore.isEntered = true;
}

function revealEnterBtns() {
  const enterBtn = document.querySelector(".enter-btn");
  const enterBtnMute = document.querySelector(".enter-btn-mute");

  enterTl = gsap.timeline();
  enterTl.set(".enter-container", { visibility: "visible " }).fromTo(
    [enterBtn, enterBtnMute],
    { opacity: 0, yPercent: 100 },
    {
      opacity: 1,
      yPercent: 0,
      stagger: 0.15,
      duration: 0.75,
      ease: "elastic.out(0.9,0.6)",
    },
  );
}
</script>

<template>
  <div class="main-ui">
    <div class="enter-container">
      <button class="enter-btn" @click="enterExperience()">Commencer</button>
      <button class="enter-btn-mute" @click="enterExperience(true)">
        Commencer sans le son
      </button>
    </div>
    <div class="temperature-indicator" v-if="configStore.isFormValidated">
      <p>
        {{
          (
            configStore.worldStateSteps[configStore.currentStep].temperature +
            27
          ).toFixed(1)
        }}°C
      </p>
    </div>
    <div
      class="sound-control"
      @click="soundToggle"
      :class="{ '-muted': isMuted }"
      v-if="socketStore.isRoomFull"
    >
      <img src="/icons/sound-on.svg" class="sound-on" alt="" />
      <img src="/icons/sound-off.svg" class="sound-off" alt="" />
    </div>
  </div>
</template>

<style lang="scss">
.main-ui {
  height: 100%;
  width: 100%;
  position: static;

  pointer-events: none;
  > .enter-container {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 70%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 4;
    pointer-events: all;
    text-align: center;
    gap: 8px;
    visibility: hidden;
    > .enter-btn {
      pointer-events: all;
      box-shadow:
        0 -2px 4px 0 rgba(0, 0, 0, 0.25) inset,
        -26px 82px 24px 0 rgba(0, 0, 0, 0),
        -17px 52px 22px 0 rgba(0, 0, 0, 0),
        -9px 29px 19px 0 rgba(0, 0, 0, 0.01),
        -4px 13px 14px 0 rgba(0, 0, 0, 0.01),
        -1px 3px 8px 0 rgba(0, 0, 0, 0.02);
      background: var(
        --white-gradient,
        linear-gradient(
          0deg,
          rgba(255, 255, 255, 0.5) 0%,
          rgba(255, 255, 255, 0.5) 100%
        ),
        linear-gradient(180deg, #fcfcfc 0%, #d1d1d1 100%)
      );
      border-radius: 32px;
      padding: 1.56vw 2.06vw;
      cursor: pointer;

      font-size: 2vw;
    }
    > .enter-btn-mute {
      cursor: pointer;

      pointer-events: all;
      font-size: 16px;
      font-family: OpenRunde;
      text-decoration: underline;
    }
  }
  > .temperature-indicator {
    position: absolute;
    right: 0;
    top: 0;
    right: 60px;
    top: 60px;
    padding: 1.56vw 2.06vw;
    box-shadow:
      0 -2px 4px 0 rgba(0, 0, 0, 0.25) inset,
      -26px 82px 24px 0 rgba(0, 0, 0, 0),
      -17px 52px 22px 0 rgba(0, 0, 0, 0),
      -9px 29px 19px 0 rgba(0, 0, 0, 0.01),
      -4px 13px 14px 0 rgba(0, 0, 0, 0.01),
      -1px 3px 8px 0 rgba(0, 0, 0, 0.02);
    background: var(
      --white-gradient,
      linear-gradient(
        0deg,
        rgba(255, 255, 255, 0.5) 0%,
        rgba(255, 255, 255, 0.5) 100%
      ),
      linear-gradient(180deg, #fcfcfc 0%, #d1d1d1 100%)
    );
    border-radius: 32px;
    > p {
      font-size: 1.66vw;
      line-height: 125%;
    }
  }
  > .sound-control {
    z-index: 1000;
    position: absolute;
    left: 60px;
    top: 60px;
    width: 3.75vw;
    height: 3.75vw;
    pointer-events: all;
    box-shadow:
      0 -2px 4px 0 rgba(0, 0, 0, 0.25) inset,
      -26px 82px 24px 0 rgba(0, 0, 0, 0),
      -17px 52px 22px 0 rgba(0, 0, 0, 0),
      -9px 29px 19px 0 rgba(0, 0, 0, 0.01),
      -4px 13px 14px 0 rgba(0, 0, 0, 0.01),
      -1px 3px 8px 0 rgba(0, 0, 0, 0.02);
    background: var(
      --white-gradient,
      linear-gradient(
        0deg,
        rgba(255, 255, 255, 0.5) 0%,
        rgba(255, 255, 255, 0.5) 100%
      ),
      linear-gradient(180deg, #fcfcfc 0%, #d1d1d1 100%)
    );
    border-radius: 50%;
    > img {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      transition: opacity 0.3s;
    }
    .sound-on {
      opacity: 1;
    }
    .sound-off {
      opacity: 0;
    }
    &.-muted {
      .sound-on {
        opacity: 0;
      }
      .sound-off {
        opacity: 1;
      }
    }
  }
}
</style>
