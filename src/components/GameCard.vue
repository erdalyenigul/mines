<template>
  <div class="game-card">
    <div class="modal" v-if="modalInfo.isCashout">
      <div class="modal__content modal__content--win">
        <span class="text">KAZANILAN ALTIN: {{ currentRound }}</span>
      </div>
    </div>
    <div class="modal" v-if="!isBetActive && !isFinished && (typeManual && !typeAuto)">
      <div class="modal__content modal__content--start">
        <button class="modal__content-button button" @click="action()">
          OYNA!
        </button>
      </div>
    </div>
    <div class="modal" v-if="modalInfo.isLoss">
      <div class="modal__content modal__content--loss">
        <span class="text">KORSANLARA YAKALANDIN!</span>
        <span class="text">KAYBEDILEN ALTIN: {{ currentRound }}</span>
      </div>
    </div>

    <div class="head-container" id="multiplierList">
      <div class="head">
        <div 
          v-for="(item, index) in multipliersList"
          class="head-multiple"
          :class="{
            'head-multiple-won': index < currentRound,
            'head-multiple-active': currentRound == index + 1
          }"
        >
          <span class="first-multiple">ALTIN {{ index + 1 }} </span>
          
        </div>
      </div>
    </div>
    <div class="box">
      <div
        v-for="i in 25"
        :key="i"
        @click="revealCard(i)"
        class="box__card"
        :class="{
          'box__card-shot': !!revealedResults[i],
          'box__card-shot--diamond': !opened[i],
          'box__card-shot--bomb': !opened[i],
          'box__card-shot--bombEffect':
            opened[i] && revealedResults[i] === 'bomb' && !isBetActive,
          'box__card-open': revealedResults[i],
          'box__card-autoModeSelected' : selectedItemsForAutoMode.includes(i),
        }">
        <div v-if="opened[i] || isFinished">
          <img
            v-if="revealedResults[i] === 'safe'"
            src="../assets/images/diamond.png"
            alt="" />
          <template v-if="revealedResults[i] === 'bomb'">
            <img src="../assets/images/bomb.svg" alt="" />
            <img
              v-if="opened[i]"
              class="effect"
              src="../assets/images/bombEffect.webp"
              alt="" />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { toRefs } from 'vue';
import { useMock } from '../stores/mock';

const { betAmount } = toRefs(useMock());
const { action, revealCard } = useMock();
const { 
  isBetActive,
  isFinished,
  revealedResults,
  modalInfo,
  multipliersList,
  currentRound,
  typeManual,
  typeAuto,
  selectedItemsForAutoMode,
  opened
} = useMock().getters;

watch(isFinished, (newVal) => {
  if (!newVal) {
    opened.value = {};
  }
});
</script>

<style lang="scss" scoped>
@import '../assets/css/helpers';

.game-card {
  display: flex;
  width: calc(100% - 560px);
  max-width: 580px;
  flex-direction: column;
  position: relative;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 40px;
  @include bp(desktop-s) {
    width: 100%;
    padding: 0 20px;
  }
}

.head-container {
  display: flex;
  width:100%;
  overflow-y: hidden;
  overflow-x: scroll;
  margin-bottom: 5px;
  height: 74px;
  scroll-behavior: smooth;
  .head {
    display: flex;
    width: 2500px;
    margin-bottom: 10px;
    gap: 2px;
    .head-multiple {
      background-size: cover;
      font-size: 20px;
      color: #fff;
      width: 110px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      line-height: 20px;
      height:65px;
      background-image: url('@/assets/images/multiple-bg.svg');
      .first-multiple {
        &:nth-child(1) {
          margin-top: -5px;
        }
      }
      &-won {
        background-image: url('@/assets/images/multiple-bg-3.svg');
      }
      &-active {
        background-image: url('@/assets/images/multiple-bg-2.svg');
      }
    }
  }
}

.box {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;

  &__card {
    cursor: pointer;
    position: relative;
    height: 110px;
    max-width: 110px;
    background-image: url(../assets/images/boxDefault.png);
    background-size: cover;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease-in-out;
    &:hover {
      transition: background-color 0.2s ease;
    }
    &-shot {
      img {
        width: 110px;
      }
      &--diamond {
        img {
          width: 110px;
          opacity: 0.5;
        }
      }
      &--bomb {
        img {
          width: 110px;
          opacity: 0.5;
        }
      }
      &--bombEffect {
        position: relative;
        img {
          width: 110px;
          &.effect {
            width: 100%;
            transform: scale(1.5);
            opacity: 0.5;
            position: absolute;
            top: 0;
            left: 0;
          }
        }
      }
    }
    &-open {
      animation-name: openingAnimation;
      animation-duration: 1s;
      background: transparent;
    }
    &-autoModeSelected {
      filter: grayscale(100%);
    }
  }

  @keyframes openingAnimation {
    0% {
      transform: scale(1);
    }
    25% {
      transform: scale(1.1);
    }
    50% {
      transform: scale(1);
    }
    75% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }

  @include bp(desktop-s) {
    width: 100%;
    order: 1;
    margin-left: 0;
    padding-left: 0;
  }
  @include bp(mobile) {
    zoom: 60%;
  }
}

.modal {
  position: absolute;
  top: 76px;
  left: 8px;
  width: calc(100% - 25px);
  height: calc(100% - 76px);
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  &__content {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    width: 280px;
    font-size: 16px;
    color: #fff;
    background-color: #1a2c38;
    border-width: 3px;
    border-style: solid;
    padding: 15px;
    border-radius: 10px;

    &--loss {
      border-color: #ff1855;

      .text,
      .button {
        color: #ff1855;
      }
    }

    &--win {
      border-color: #00e700;

      .text {
        color: #00e700;
      }
    }

    &--start {
      border-color: #fff;

      .button {
        color: #fff;
      }
    }

    .text {
      width: 100%;
      text-align: center;
      font-weight: 900;
      font-size: 22px;

      &:nth-child(1) {
        position: relative;
        margin-bottom: 10px;
        &:after {
          content: '';
          position: absolute;
          width: 20px;
          height: 2px;
          background-color: #2f4553;
          bottom: -4px;
          left: calc(50% - 10px);
        }
      }
    }
    &-button {
      cursor: pointer;
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      font-size: 20px;
      font-weight: 600;
      color: #00e701;
      &:hover {
        background-color: #273643;
      }
    }
  }
  @include bp(desktop-s) {
    width: 100%;
    left: 0;
  }
}
</style>
