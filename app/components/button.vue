<script lang="ts" setup>
const props = defineProps<{
  textContent?: string;
}>();
</script>

<template>
  <button class="button-color-flip w-inline-block">
    <span class="button-color-flip_inner">
      <span :data-text="textContent" class="button-color-flip_back"></span>
      <span class="button-color-flip_front">
        <span class="button-color-flip_bg"></span>
        <span class="button-color-flip_text">{{ textContent }}</span>
      </span>
    </span>
  </button>
</template>

<style lang="scss" scoped>
$yellow: #ffba1a;
$br-main: 32px;
$shadow-complex:
  0 -2px 4px 0 rgba(0, 0, 0, 0.25) inset,
  -26px 82px 24px 0 rgba(0, 0, 0, 0),
  -17px 52px 22px 0 rgba(0, 0, 0, 0),
  -9px 29px 19px 0 rgba(0, 0, 0, 0.01),
  -4px 13px 14px 0 rgba(0, 0, 0, 0.01),
  -1px 3px 8px 0 rgba(0, 0, 0, 0.02);

.button-color-flip {
  --elastic-out: linear(
    0,
    0.5737 7.6%,
    0.8382 11.87%,
    0.9463 14.19%,
    1.0292 16.54%,
    1.0886 18.97%,
    1.1258 21.53%,
    1.137 22.97%,
    1.1424 24.48%,
    1.1423 26.1%,
    1.1366 27.86%,
    1.1165 31.01%,
    1.0507 38.62%,
    1.0219 42.57%,
    0.9995 46.99%,
    0.9872 51.63%,
    0.9842 58.77%,
    1.0011 81.26%,
    1
  );
  --color-ease: cubic-bezier(0.216, 0.62, 0.356, 1);

  all: unset;
  display: inline-block;
  cursor: pointer;
  border-radius: $br-main;
  font-size: 1.4vw;
  transition: transform 0.65s var(--elastic-out);
  -webkit-tap-highlight-color: transparent;

  &:active {
    transform: scaleX(0.955) scaleY(0.954);
  }

  &_inner {
    display: grid;
    perspective: 500px;
    transform-style: preserve-3d;
    pointer-events: none;
  }

  &_front {
    grid-area: 1 / 1;
    display: grid;
    transform-style: preserve-3d; // fix: needed for children to live in the same 3D space
    transition:
      translate 1.05s var(--elastic-out),
      rotate 0.95s var(--elastic-out),
      opacity 0.35s ease-out;
  }

  &_bg {
    grid-area: 1 / 1;
    display: grid;
    background:
      linear-gradient(0deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)),
      linear-gradient(180deg, #fcfcfc 0%, #d1d1d1 100%);
    border-radius: $br-main;
    box-shadow: $shadow-complex;
    transition: background-color 0.2s var(--color-ease);
  }

  &_text {
    grid-area: 1 / 1;
    padding: 1.56vw 2.06vw;
    transition: translate 0.95s var(--elastic-out);
  }

  &_back {
    grid-area: 1 / 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: calc(100% - 0.125rem);
    height: calc(100% - 0.125rem);
    place-self: center;
    background-color: $yellow;
    border-radius: $br-main;
    box-shadow: $shadow-complex;

    opacity: 0;
    translate: 0 2rem -6rem;
    rotate: 1 0 0 -90deg;
    transition:
      translate 1.05s var(--elastic-out),
      rotate 0.95s var(--elastic-out),
      opacity 0.35s ease-out;

    &::before {
      content: attr(data-text);
      // display: contents retiré — empêche translate de fonctionner sur le pseudo-element
      translate: 0 0.75rem 0;
      transition: translate 0.95s var(--elastic-out);
    }
  }

  @media (hover: hover) and (pointer: fine) {
    &:is(:hover, :focus-visible) {
      .button-color-flip_front {
        translate: 0 -2rem -6rem;
        rotate: 1 0 0 85deg;
        opacity: 0;
      }

      .button-color-flip_text {
        translate: 0 -0.75rem 0;
      }

      .button-color-flip_back {
        opacity: 1;
        translate: 0 0 0;
        rotate: 1 0 0 0deg;
        transition:
          translate 1.05s var(--elastic-out),
          rotate 0.95s var(--elastic-out),
          opacity 0.15s ease-in;
        &::before {
          translate: 0 0 0;
        }
      }
    }
  }
}
</style>
