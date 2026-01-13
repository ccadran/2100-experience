<script lang="ts" setup>
import questionsData from "~/assets/content/questions.json";
import resultsData from "~/assets/content/results.json";

const modals = ref<HTMLElement>();
const currentQuestion = ref<number>(0);
const userGlobalRanking = ref<number>(0);
const currentQuestionUserRanking = ref<number>(0); //change at each question
</script>

<template>
  <div class="modalResults explanation" ref="modal">
    <p class="title">Resultats</p>
    <div class="ranking">
      <div class="result-description">
        <div class="rank">
          <img :src="resultsData[userGlobalRanking]?.text" alt="" />
        </div>
        <p>
          {{ resultsData[userGlobalRanking]?.text }}
        </p>
      </div>
      <div class="mascot">
        <img src="/images/mascot.webp" alt="" />
      </div>
    </div>
    <div class="explanations">
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
        <div class="question" v-for="question in questionsData">
          <div class="icon"><img :src="question.icon" alt="" /></div>
          <div class="number">{{ question.number }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.modalResults {
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
  display: flex;
  align-items: center;
  justify-content: center;
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
    display: none;
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
      }
    }
  }
}
</style>
