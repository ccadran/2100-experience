<script lang="ts" setup>
import gsap from "gsap";

const configStore = useConfig();
const worldYears = ref<any[]>();
const currentYear = ref<number>();
const yearsStepsRefs = ref<HTMLElement[]>([]);
const timeline = ref<HTMLElement>();

const stepWidth = ref<number>();
const yearWidth = ref<number>();
const currentTimelineTransform = ref<number>(0);

let lastTarget: number | null = null;

watch(
  () => configStore.currentStep,
  (newValue: number) => {
    console.log(newValue);

    currentYear.value = worldYears.value![newValue];
    slideTimeline(newValue);
  }
);

watch(
  () => configStore.isFormValidated,
  async (newValue) => {
    if (newValue) {
      worldYears.value = configStore.worldStateSteps.map((step) => step.year);
      await nextTick(() => {
        stepWidth.value =
          yearsStepsRefs.value[configStore.currentStep]?.clientWidth;
        yearWidth.value =
          yearsStepsRefs.value[configStore.currentStep]?.querySelector(
            ".inner"
          )?.clientWidth;
        const offset = -yearWidth.value! / 2;
        console.log(timeline.value);

        timeline.value!.style.transform = `translate(${offset}px)`;
        currentTimelineTransform.value += offset;
        console.log(currentTimelineTransform.value);
      });
    }
  }
);

function slideTimeline(target: number) {
  const slideTl = gsap.timeline();

  if (lastTarget) {
    const lastStep = yearsStepsRefs.value![lastTarget] as HTMLElement;
    const lastStepDate = lastStep.querySelector(".inner");
    const lastStepDateText = lastStepDate!.querySelector("p");
    const lastStepIndicator = lastStep.querySelector(".indicator");

    slideTl.add(
      gsap
        .timeline()
        .to(lastStepDate, { scale: 0.84 })
        .to(lastStepDateText, { fontSize: "1.66vw", color: "var(--grey)" }, 0)
        .to(lastStepIndicator, { backgroundColor: "var(--grey)" }),
      0
    );
  }
  if (lastTarget) {
    if (target > lastTarget) {
      currentTimelineTransform.value -= stepWidth.value!;
    } else {
      currentTimelineTransform.value += stepWidth.value!;
    }
  } else {
    currentTimelineTransform.value -= stepWidth.value!;
  }

  const step = yearsStepsRefs.value![target] as HTMLElement;
  const stepDate = step.querySelector(".inner");
  const stepDateText = stepDate!.querySelector("p");
  const stepIndicator = step.querySelector(".indicator");
  slideTl
    .to(stepDate, { scale: 1 }, 0)
    .to(stepDateText, { fontSize: "1.75vw", color: "black" }, 0)
    .to(stepIndicator, { backgroundColor: "black" }, 0)
    .to(timeline.value!, { x: currentTimelineTransform.value }, 0);

  lastTarget = target;
}
</script>

<template>
  <div class="timeline-container">
    <div class="timeline" ref="timeline">
      <div
        class="step"
        v-for="(year, index) in worldYears"
        :ref="
          (el) => {
            if (el) yearsStepsRefs[index] = el as HTMLElement;
          }
        "
      >
        <div class="date-container">
          <div class="inner">
            <p>{{ year }}</p>
          </div>
          <div class="indicator"></div>
        </div>
        <div class="indicator"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.indicator {
  height: 14px;
  width: 4px;
  background-color: var(--grey);
  border-radius: 50%;
}
.timeline-container {
  z-index: 2;
  width: 100vw;
  position: absolute;
  bottom: 0;
  .timeline {
    margin-left: 50%;

    // right: 50%;
    // transform: translateX(-50%);

    display: flex;
    > .step {
      display: flex;
      align-items: end;
      > .date-container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        gap: 16px;

        > .inner {
          scale: 0.84;
          padding: 32px 48px;
          border-radius: 32px;
          display: flex;
          justify-content: center;
          align-items: center;
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
            -26px 82px 24px 0 rgba(0, 0, 0, 0),
            -17px 52px 22px 0 rgba(0, 0, 0, 0),
            -9px 29px 19px 0 rgba(0, 0, 0, 0.01),
            -4px 13px 14px 0 rgba(0, 0, 0, 0.01),
            -1px 3px 8px 0 rgba(0, 0, 0, 0.02);
          > p {
            font-size: 1.75vw;
            color: var(--grey);
          }
        }
      }
      > .indicator {
        margin: 0 30px;
      }
    }
  }
}
</style>
