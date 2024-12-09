<template>
  <div class="side">
    <div class="container">
      <div class="game-mode">
        <div class="game-box-info">
          <div class="text" v-if="!isBetActive">
            KORSANLAR GELMEDEN HAZİNEYİ TOPLA
            <img src="@/assets/images/bird-talk-arrow.svg" alt="" />
          </div>
          <div class="bird">
            <img src="@/assets/images/bird.svg" />
          </div>
          <div class="lighthouse">
            <img src="@/assets/images/lighthouse.svg" />
          </div>
        </div>
      </div>

      <div class="game-box">
        <div class="game-box-line">
          <div class="game-box-col">
            <button
              class="game-box--bet"
              :class="{
                'game-box--bet-cancel': currentRound == 0 && isBetActive,
              }"
              @click="action"
            >
              {{
                (isBetActive && currentRound > 1) || (isBetActive && currentRound == 1)
                  ? "TOPLA"
                  : !isBetActive
                  ? "OYNA"
                  : isBetActive
                  ? "OYNA"
                  : "OYNA"
              }}
            </button>
          </div>
          <div class="game-box-col">
            <div class="game-box--mines" v-if="gameBoxMinesVisible">
              <a
                v-for="(item, index) in 24"
                @click="selectedMines(item, index)"
                :key="index"
                class="selectMines"
                :class="{
                  'game-box--mines-selected': index + 1 === isSelectedMines,
                }"
                >{{ item }}</a
              >
              <a
                class="selectMines cancel"
                @click="gameBoxMinesVisible = !gameBoxMinesVisible"
                ><img src="@/assets/images/mines-cancel.svg" alt=""
              /></a>
            </div>
            <button
              class="game-box--mines-open"
              @click="gameBoxMinesVisible = !gameBoxMinesVisible"
              :disabled="isBetActive"
            >
              BOMBA <br />
              {{ isSelectedMines }}
            </button>
          </div>
        </div>
      </div>
     </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs, ref, onMounted } from "vue";
import { useMock } from "../stores/mock";

const { bombCount, betAmount } = toRefs(useMock());
const { setMultiplierList, setType, action } = useMock();
const {
  isBetActive,
  minBetAmount,
  maxBetAmount,
  currentRound,  
  selectedItemsForAutoMode,
} = useMock().getters;

const gameBoxMinesVisible = ref(false);
const isSelectedMines = ref(3);

function selectedMines(item: number, index: number) {
  selectedItemsForAutoMode.value = [];
  currentRound.value = 0;
  bombCount.value = item;
  isSelectedMines.value = index + 1;
  gameBoxMinesVisible.value = false;
  setMultiplierList();
}

function setBetAmount(type) {
  if (type == "min") {
    betAmount.value = minBetAmount.value;
  }
  if (type == "max") {
    betAmount.value = maxBetAmount.value;
  }
  if (type == "increase") {
    betAmount.value++;
  }
  if (type == "decrease") {
    betAmount.value--;
  }
}

function betAmountChange() {
  betAmount.value = Number(betAmount.value).toString();
}

onMounted(() => {
  setMultiplierList();
});
</script>

<style lang="scss" scoped>
@import "../assets/css/helpers";

.side {
  width: 100%;
  max-width: 460px;
  border-radius: 6px;
  margin-right: 100px;
  display: flex;
  align-items: center;
  z-index: 2;
  filter: drop-shadow(2px 2px 10px rgba(0, 0, 0, 0.8));

  @include bp(desktop-s) {
    margin-top: 30px;
    order: 2;
    max-width: 500px;
    margin-right: 0;
    justify-content: center;
  }

  @include bp(mobile) {
    max-width: 100%;
    z-index: 3;
  }
}

.container {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
}

.game-mode {
  display: flex;
  width: 100%;
  flex-direction: column;

  @include bp(desktop-s) {
    padding: 0 20px;
    margin-bottom: 10px;
  }
}

.game-box {
  width: 455px;
  height: 120px;
  padding: 30px 26px;
  border-radius: 20px;
  background-color: #00000042;

  &--helper {
    background-image: url("@/assets/images/bet-helper-btn.svg");
    width: 62px;
    height: 26px;
    font-size: 14px;
    text-shadow: -1px 1px 0 #fff, 1px 1px 0 #fff, 1px -1px 0 #fff,
      -1px -1px 0 #fff;

    &:nth-child(1) {
      margin-bottom: 10px;
    }

    &:disabled {
      text-shadow: 0 0 0 #000, 0 0 10px #fff;
      cursor: not-allowed;
      opacity: 0.7;
    }

    @include bp(desktop-s) {
      margin-bottom: 0 !important;
      margin: 0 3px;
      height: 40px;
    }
  }

  &--round {
    display: flex;
    width: 46px;
    flex-wrap: wrap;
    position: absolute;
    bottom: 58px;
    left: 15px;

    .selectRound {
      background-image: url("@/assets/images/number-btn-bg.svg");
      width: 46px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 2px;
      cursor: pointer;

      &:hover {
        background-image: url("@/assets/images/number-btn-hover-bg.svg");
      }

      &.infinity {
        img {
          width: 26px;
        }
      }
    }

    &-open {
      background-image: url("@/assets/images/bet-helper2-btn.svg");
      width: 77px;
      height: 56px;
      font-size: 17px;
      line-height: 14px;

      &:hover {
        background-image: url("@/assets/images/bet-helper2-btn-hover.svg");
      }

      &:disabled {
        background-image: url("@/assets/images/bet-helper2-btn-disabled.svg");
        color: rgba(255, 255, 255, 0.7);
        cursor: not-allowed;
      }
    }

    &-selected {
      background-image: url("@/assets/images/number-btn-hover-bg.svg") !important;
    }
  }

  &--msg {
    background-image: url("@/assets/images/msg-bg.svg");
    position: absolute;
    top: -5px;
    left: 0;
    width: 100%;
    color: #fff;
    font-size: 18px;
    line-height: 22px;
    box-shadow: 1px 1px 5px #000;
    border-radius: 6px;
    padding: 10px;
    text-align: center;

    .text {
      position: absolute;
      right: -15px;
      top: -10px;
      font-size: 18px;
      background-image: url(/src/assets/images/number-btn-bg.svg);
      background-position: center;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 5px;
      border-radius: 50%;
      cursor: pointer;

      img {
        width: 20px;
      }
    }
  }

  &--bet {
    background-image: url("@/assets/images/bet-btn.svg");
    width: 210px;
    height: 60px;
    color: #082a02;
    text-align: center;
    text-shadow: 0px 1.377px 0px rgba(0, 0, 0, 0.25);
    font-size: 33.041px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;

    &-cancel {
      background-image: url("@/assets/images/bet-cancel-btn.svg");
    }

    &:hover {
      text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff, 0 0 20px #49ff18,
        0 0 30px #49ff18, 0 0 40px #49ff18, 0 0 55px #49ff18, 0 0 75px #49ff18;
    }

    @include bp(desktop-s) {
      zoom: 80%;
    }
  }

  &--mines {
    display: flex;
    width: 238px;
    flex-wrap: wrap;
    position: absolute;
    bottom: 58px;
    right: 15px;

    .selectMines {
      background-image: url("@/assets/images/number-btn-bg.svg");
      width: 46px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 2px;
      cursor: pointer;

      &:hover {
        background-image: url("@/assets/images/number-btn-hover-bg.svg");
      }

      &.cancel {
        img {
          width: 26px;
        }
      }
    }

    &-open {
      background-image: url("@/assets/images/bet-helper2-btn.svg");
      width: 77px;
      height: 56px;
      font-size: 17px;
      line-height: 14px;

      &:hover {
        background-image: url("@/assets/images/bet-helper2-btn-hover.svg");
      }

      &:disabled {
        background-image: url("@/assets/images/bet-helper2-btn-disabled.svg");
        color: rgba(255, 255, 255, 0.7);
        cursor: not-allowed;
      }
    }

    &-selected {
      background-image: url("@/assets/images/number-btn-hover-bg.svg") !important;
    }
  }

  &--amount {
    background-image: url("/src/assets/images/bet-amount-bg.svg");
    background-repeat: no-repeat;
    width: 246px;
    height: 63px;
    background-size: cover;
    display: flex;
    align-items: center;
    justify-content: center;

    .input {
      width: 200px;
      background: transparent;
      border: none;
      text-align: center;
      font-size: 35px;
      outline: none;
      text-shadow: -1px 1px 0 #fff, 1px 1px 0 #fff, 1px -1px 0 #fff,
        -1px -1px 0 #fff;
    }

    @include bp(desktop-s) {
      width: 110px;
      background-image: url("/src/assets/images/bet-amount-mobile-bg.svg");

      .input {
        width: 100px;
      }
    }
  }

  @include bp(desktop-s) {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;
    background-size: 105%;
    background-position: center;
    padding: 5px;
    height: 120px;
  }

  @include bp(mobile-small) {
    height: 100px;
  }
}

.game-box-line {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
  z-index: 2;

  @include bp(desktop-s) {
    margin-bottom: 0;
  }
}

.game-box-col {
  display: flex;
  flex-direction: column;
  position: relative;

  &:nth-last-child(1) {
    .game-box--helper {
      font-size: 24px;
    }
  }

  button {
    background-repeat: no-repeat;
    background-color: transparent;
    background-size: cover;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  @include bp(desktop-s) {
    flex-direction: row;
  }

  @include bp(mobile-small) {
    flex-direction: column;
  }
}

.game-box-type {
  background-image: url("@/assets/images/bet-type-bg.svg");
  background-size: cover;
  width: 402px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px;
  border-radius: 7px;
  height: 48px;
  overflow: hidden;

  &--manual {
    background-image: url("@/assets/images/bet-type-manual.svg");
  }

  &--auto {
    background-image: url("@/assets/images/bet-type-auto.svg");
  }

  @include bp(desktop-s) {
    width: 100%;
  }
}

.game-box-type-button {
  background-repeat: no-repeat;
  background-color: transparent;
  background-size: cover;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 200px;
  height: 44px;
  border-radius: 7px;
  font-size: 28px;

  &:disabled {
    cursor: not-allowed;
  }

  @include bp(desktop-s) {
    width: 50%;
  }
}

.game-box-info {
  display: flex;
  width: 402px;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  .bird {
    position: absolute;
    left: 0;
    bottom: 0;
  }

  .lighthouse {
    position: absolute;
    left: 50%;
    bottom: -20px;
  }

  .text {
    width: 205px;
    background-color: #d9d9d9;
    border-radius: 7px;
    padding: 10px;
    font-size: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin-bottom: 80px;
    line-height: 32px;
    margin-left: 20px;
    position: absolute;
    top: -160px;
    left: 0;

    img {
      position: absolute;
      bottom: -44px;
      left: 20px;
    }
  }

  @include bp(desktop-s) {
    display: none;
  }
}

.bet-rules {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  background-color: #704732;
  border-radius: 6px;
  margin-top: 20px;
  color: #fff;

  &__rule {
    display: flex;
    width: 50%;
    padding: 10px;
    align-items: center;

    .text {
      font-size: 18px;
      margin-right: 10px;
    }

    .input {
      width: 80%;
      border: 0;
      padding: 5px;
      outline: none;

      &:disabled {
        cursor: not-allowed;
      }
    }
  }
}

.type-auto-bg-animation {
  animation-name: type-auto-bg-animation;
  animation-duration: 0.5s;
}

.type-manual-bg-animation {
  animation-name: type-manual-bg-animation;
  animation-duration: 0.5s;
}

@keyframes type-auto-bg-animation {
  0% {
    background-position-x: 200px;
  }

  100% {
    background-position-x: 0;
  }
}

@keyframes type-manual-bg-animation {
  0% {
    background-position-x: -200px;
  }

  100% {
    background-position-x: 0;
  }
}
</style>
