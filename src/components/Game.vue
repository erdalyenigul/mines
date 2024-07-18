<template>
  <div class="game">
    <BetAction />
    <GameCard />
  </div>
</template>

<script setup lang="ts">
import BetAction from '../components/BetAction.vue';
import GameCard from '../components/GameCard.vue';
</script>

<style lang="scss" scoped>
@import '../assets/css/helpers';

.game {
  display: flex;
  max-width: 1120px;
  width: 100%;
  flex-wrap: wrap;
  justify-content: center;
  @include bp(desktop-s) {
    flex-direction: column;
    align-items: center;
    padding-top: 20px;
    padding-bottom: 20px;
  }
}
</style>
