<script lang="ts" setup>
import gsap from "gsap";

import questionsData from "~/assets/content/questions.json";
import resultsData from "~/assets/content/results.json";

const configStore = useConfig();

const modal = ref<HTMLElement>();
const currentQuestion = ref<number>(0);
const userGlobalRanking = ref<number>(0);
const currentQuestionUserRanking = ref<number>(0); //change at each question
const questionsList = ref<HTMLElement[]>([]);

const isExplanationsShown = ref<boolean>(false);

onMounted(() => {});

function revealModal() {
  userGlobalRanking.value = Math.round(
    (configStore.globalPercentage / 100) * (resultsData.length - 1)
  );

  gsap
    .timeline({})
    .set(modal.value!, { display: "block" })
    .fromTo(".title", { opacity: 0 }, { opacity: 1 }, 0.35)
    .fromTo(".result-description p", { opacity: 0 }, { opacity: 1 }, "<+0.2")
    .fromTo(
      ".result-description .rank",
      { opacity: 0, transform: "translateX(-50%) scale(2)" },
      { opacity: 1, transform: "translateX(-50%) scale(1)" },
      "<+0.2"
    )
    .fromTo(".ranking .mascot", { opacity: 0 }, { opacity: 1 }, "<+0.2");
}

async function showExplanations() {
  await gsap.fromTo(".ranking", { opacity: 1 }, { opacity: 0 }).then();
  isExplanationsShown.value = true;
  console.log(isExplanationsShown.value);
  await nextTick();

  gsap
    .timeline()
    .set(modal.value!, { display: "flex" })
    .fromTo(".explanations", { opacity: 0 }, { opacity: 1 });
}

async function changeQuestion() {
  let questionListBg =
    questionsList.value[currentQuestion.value]!.querySelector(".background");
  await gsap
    .timeline()
    .to(".explanations-content", { opacity: 0 })
    .to(questionListBg, { opacity: 0 })
    .then();

  currentQuestion.value += 1;

  questionListBg =
    questionsList.value[currentQuestion.value]!.querySelector(".background");

  gsap
    .timeline()
    .to(questionListBg, { opacity: 1 })
    .to(".explanations-content", { opacity: 1 });
}

defineExpose({ revealModal, showExplanations, changeQuestion });
</script>

<template>
  <div
    class="modalResults"
    :class="{ explanation: isExplanationsShown }"
    ref="modal"
  >
    <p class="title">Resultats</p>
    <div class="ranking" v-if="!isExplanationsShown">
      <div class="result-description">
        <div class="rank">
          <img :src="resultsData[userGlobalRanking]?.rank" alt="" />
        </div>
        <p>
          {{ resultsData[userGlobalRanking]?.text }}
        </p>
      </div>
      <div class="mascot">
        <img src="/images/mascot.webp" alt="" />
      </div>
    </div>
    <div class="explanations" v-else>
      <div class="explanations-content">
        <div class="question-icon">
          <img :src="questionsData[currentQuestion]?.icon" alt="" />
        </div>
        <div class="explanation-text">
          <p class="number">{{ questionsData[currentQuestion]?.number }}</p>
          <p class="explanation">
            {{
              questionsData[currentQuestion]?.explanations[
                currentQuestionUserRanking
              ]?.text
            }}
          </p>
          <div class="official-data">
            <p>{{ questionsData[currentQuestion]?.officialData.text }}</p>
            <p class="source">
              Source :
              <a :href="questionsData[currentQuestion]?.officialData.link">{{
                questionsData[currentQuestion]?.officialData.linkText
              }}</a>
            </p>
          </div>
        </div>
        <div class="explanation-illu">
          <img
            :src="
              questionsData[currentQuestion]?.explanations[
                currentQuestionUserRanking
              ]?.illustration
            "
            alt=""
          />
        </div>
      </div>
      <div class="questions-list">
        <div
          class="question"
          v-for="(question, index) in questionsData"
          :ref="
          (el) => {
            if (el) questionsList[index] = el as HTMLElement;
          }
        "
        >
          <div class="icon">
            <div class="background"></div>
            <img :src="question.icon" alt="" />
          </div>
          <div class="number">{{ question.number }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.modalResults {
  display: none;
  height: 90vh;
  width: 81.25vw;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  border-radius: 60px;
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
  &.explanation {
    align-items: end;
  }
  > .title {
    position: absolute;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
    font-family: milling;
    font-size: 1.56vw;
  }
  .ranking {
    // opacity: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    > .result-description {
      position: relative;
      > .rank {
        width: 120px;
        position: absolute;
        top: -70px;
        left: 50%;
        transform: translateX(-50%);
      }
      > p {
        font-size: 4vw;
        width: 54vw;
        text-align: center;
      }
    }
    > .mascot {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 0;
      width: 33%;
    }
  }
  .explanations {
    padding: 0 60px;
    display: flex;
    flex-direction: column;
    gap: 80px;
    margin-bottom: 80px;
    opacity: 0;
    .explanations-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      > .question-icon {
        position: absolute;
        width: 200px;
        top: -15%;
        left: 50%;
        transform: translateX(-50%);
      }
      .explanation-text {
        display: flex;
        flex-direction: column;
        text-align: center;
        width: 44%;

        .number {
          font-family: OpenRunde;
          font-weight: 600;
          font-size: 14px;
          margin-bottom: 30px;
        }
        .explanation {
          font-family: milling;
          font-size: 1.875vw;
        }
        .official-data {
          margin-top: 60px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          > p {
            font-family: OpenRunde;
            font-weight: 500;
            font-size: 18px;
          }
          > .source,
          a {
            font-family: OpenRunde;
            font-weight: 600;
            font-size: 14px;
            letter-spacing: -2%;
            color: var(--grey);

            > a {
              text-decoration: underline;
            }
          }
        }
      }
      > .explanation-illu {
        border-radius: 48px;
        width: 48%;
        overflow: hidden;
        > img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
    .questions-list {
      display: flex;
      justify-content: space-between;
      padding: 0 56px;
      > .question {
        display: flex;
        align-items: center;
        flex-direction: column;
        gap: 24px;
        width: 7%;
        font-family: OpenRunde;
        font-weight: 600;
        font-size: 14px;
        letter-spacing: -2%;
        > .icon {
          position: relative;
          width: 96px;
          height: 96px;
          display: flex;
          justify-content: center;
          align-items: center;
          > .background {
            opacity: 0;
            width: 100%;
            height: 100%;
            transform: rotate(3deg);
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
            border-radius: 16px;
          }
          > img {
            width: 85%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }
      }
    }
  }
}
</style>
