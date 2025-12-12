<script lang="ts" setup>
const configStore = useConfig();
const worldYears = ref<any[]>();
const currentYear = ref<number>();

watch(
  () => configStore.currentStep,
  (newValue: number) => {
    console.log(newValue);

    currentYear.value = worldYears.value![newValue];
    console.log(currentYear.value);
  }
);

watch(
  () => configStore.isFormValidated,
  (newValue) => {
    if (newValue) {
      worldYears.value = configStore.worldStateSteps.map((step) => step.year);
      console.log(worldYears.value);
    }
  }
);
</script>

<template>
  <div class="timeline-container">
    <div class="timeline">
      <div class="step" v-for="year in worldYears">
        <div
          class="date-container"
          :class="{ '-active': year === currentYear }"
        >
          <div class="inner">
            <p>{{ year }}</p>
          </div>
          <div class="separator"></div>
        </div>
        <div class="separator"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.separator {
  height: 14px;
  width: 4px;
  background-color: black;
  border-radius: 50%;
}
.timeline-container {
  z-index: 2;
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
          }
        }
      }
      > .separator {
        margin: 0 30px;
      }
    }
  }
}
</style>
