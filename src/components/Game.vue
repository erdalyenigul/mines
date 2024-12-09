<template>
  <div class="gameInfo" v-if="gameInfoVisible">
    <div class="containerInfo">
      <div class="info-title">Ahoy Kaptan! 🏴‍☠️</div>
      <p>
        Denizlerin zenginlikleri seni bekliyor! Sandıkları aç, toplayabildiğin
        kadar altını topla ve korsanların elinden kaçmayı başar!
      </p>
      <p>
        Dikkat et, bombalı sandıklar seni yakalar ve korsanlar ganimetini çalar!
      </p>
      <div class="tasks">
        <ul>
          <li>💰 Altınları topla ve zengin ol</li>
          <li>💣 Korsanların bombalarından kaç</li>
          <li>⚓ Denizlerin en ünlü korsanı ol!</li>
        </ul>
      </div>
      <a @click="infoClose()" class="cta">OYNA!</a>
    </div>
  </div>
  <div class="game">
    <BetAction />
    <GameCard />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BetAction from "../components/BetAction.vue";
import GameCard from "../components/GameCard.vue";
import { useMock } from '../stores/mock';
const { action } = useMock();

const gameInfoVisible = ref(true)
function infoClose() {
  gameInfoVisible.value = false
  action()
}
</script>

<style lang="scss" scoped>
@import "../assets/css/helpers";

.gameInfo {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  right: 0;
  background-color: #000;
  padding: 20px;
  width: 100%;
  height: 100%;
  z-index: 99;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

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

.containerInfo {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 3px solid #f4e04d;
  border-radius: 10px;
  background: linear-gradient(135deg, #1b263b, #141d2f);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.7);
  text-align: center;
}

.containerInfo .info-title {
  font-size: 2.5em;
  margin-bottom: 20px;
  color: #ffdd57;
}

.containerInfo p {
  font-size: 1.2em;
  line-height: 1.6;
  margin-bottom: 20px;
}

.containerInfo .tasks {
  text-align: left;
  padding: 10px 20px;
  background: #141d2f;
  border-radius: 15px;
}

.containerInfo .tasks ul { 
  margin: 0;
  padding: 5px;
  list-style-type: none;
}

.containerInfo .tasks li {
  font-size: 1.1em;
  padding: 5px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.containerInfo .cta {
  width: 100%;
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 1.2em;
  color: #0a0f27;
  background-color: #f4e04d;
  text-transform: uppercase;
  text-decoration: none;
  border-radius: 5px;
  display: inline-block;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.containerInfo .cta:hover {
  background-color: #ffcc00;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.5);
  transform: translateY(-2px);
  transition: all 0.2s;
}
</style>
