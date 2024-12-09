import { computed, ref, watch } from 'vue';
import { defineStore } from 'pinia';

export const useMock = defineStore('mock', () => {

  const RTP = ref(0.99);
  const bombCount = ref(3);
  const diamondCount = ref(22);
  const multipliersList: any = ref([]);
  const minBetAmount = ref(10);
  const maxBetAmount = ref(1000);
  const isValidBetAmount = ref(false);
  const betAmount = ref<any>(10);
  const isBetActive = ref(false);
  const isFinished = ref(false);
  const currentRound = ref(0);
  const currentMultiplier = ref(1);
  const typeManual = ref(true);
  const typeAuto = ref(false);
  const selectedItemsForAutoMode: any = ref([]);
  const opened: any = ref({});
  const balance = ref(1000);
  const revealedResults: any = ref({});
  const currentTable: any = ref([]);
  const modalInfo = ref({
    isCashout: false,
    profit: 0,
    currentMultiplier: 0,
    isLoss: false
  });

  const profit = computed(() => {
    return betAmount.value * currentMultiplier.value - betAmount.value;
  });

  watch(bombCount, (newVal) => {
    diamondCount.value = 25 - newVal;
  });

  function win() {
    if (currentRound.value === 25 || diamondCount.value === 0) {
      isBetActive.value = false;
      currentRound.value = 0;
      currentMultiplier.value = 1;
      diamondCount.value = 25 - bombCount.value;
      return;
    }

    setFinalMultiplier(
      currentMultiplier.value,
      bombCount.value,
      diamondCount.value
    );
    diamondCount.value -= 1;

    currentRound.value += 1;
    isBetActive.value = true;
  }

  function loss() {
    modalInfo.value.isLoss = true;
    isBetActive.value = false;
    isFinished.value = true;
    currentMultiplier.value = 1;
    diamondCount.value = 25 - bombCount.value;
  }

  function findMultiplier(countOfMines: number, countOfDiamond: number) {
    const multiplier = (countOfMines + countOfDiamond) / countOfDiamond;
    return multiplier;
  }

  function setMultiplierList() {
    let countOfDiamond = 25 - bombCount.value;
    let startDiamondCount = 25 - bombCount.value;
    let multipliersRaw = [1];
    for (let openedDiamond = 1; openedDiamond <= startDiamondCount; openedDiamond++) {
      multipliersRaw.push(multipliersRaw[openedDiamond - 1] * findMultiplier(bombCount.value, countOfDiamond))
      countOfDiamond--
    }

    let multiplier = []
    for (let i = 0; i < multipliersRaw.length; i++) {
      let total = (RTP.value * multipliersRaw[i])
      multiplier.push({
        multiple: total.toFixed(2)
      })
    }
    multipliersList.value = multiplier.slice(1)
  }

  function setFinalMultiplier(
    multiplier: number,
    countOfMines: number,
    countOfDiamond: number
  ) {
    multiplier = multiplier * findMultiplier(countOfMines, countOfDiamond);
    currentMultiplier.value = multiplier;
  }

  function generateRandomTable(bombCount: number) {
    const array = Array(25).fill('-');

    Array(bombCount)
      .fill('x')
      .forEach(() => {
        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * 25);
        } while (array[randomIndex] === 'x');
        array[randomIndex] = 'x';
      });
    currentTable.value = array;
  }

  async function bet(bombCount: number): Promise<any> {
    currentRound.value = 1;
    generateRandomTable(bombCount);
    return new Promise((resolve) =>
      setTimeout(() => {
        balance.value -= betAmount.value;

        return resolve({
          data: 'success',
        });
      }, 10)
    );
  }

  function cashout() {
    modalInfo.value = {
      isCashout: true,
      profit: currentRound.value != 0 ? (multipliersList.value[currentRound.value - 1].multiple * betAmount.value) : 0,
      currentMultiplier: currentRound.value != 0 ? multipliersList.value[currentRound.value - 1].multiple : 0,
      isLoss: false,
    }
    balance.value += profit.value + betAmount.value;
    isBetActive.value = false;
    isFinished.value = true;
    currentMultiplier.value = 1;
    diamondCount.value = 25 - bombCount.value;
    showTable();
  }

  async function revealResult(index: number): Promise<any> {
    return new Promise((resolve) =>
      setTimeout(() => {
        if (currentTable.value[index] === 'x') {
          return resolve({
            data: 'gameover',
            table: currentTable.value,
          });
        } else {
          return resolve({
            data: 'safe',
          });
        }
      }, 10)
    );
  }

  function showTable() {
    currentTable.value.forEach((card: string, index: number) => {
      revealedResults.value[index + 1] = card === 'x' ? 'bomb' : 'safe';
    });
  }

  async function reveal(i: number) {
    if (revealedResults.value[i]) return;

    await revealResult(i - 1).then((res) => {
      if (res.data === 'safe') {
        revealedResults.value[i] = 'safe';
        win();
      } else {
        showTable();
        loss();
      }
    });
  }

  async function setBet(count: number) {
    modalInfo.value = {
      isCashout: false,
      profit: 0,
      currentMultiplier: 0,
      isLoss: false,
    }
    revealedResults.value = {};
    await bet(count);
    isBetActive.value = true;
    isFinished.value = false;
  }

  function setType(type: string) {
    modalInfo.value = {
      isCashout: false,
      profit: 0,
      currentMultiplier: 0,
      isLoss: false,
    }
    
    currentRound.value = 0;
    revealedResults.value = {};
    isBetActive.value = false;
    isFinished.value = false;
    selectedItemsForAutoMode.value = [];
    document.getElementById('multiplierList').scrollTo(0,0)

    if (type == 'manual') {
      typeAuto.value = false;
      typeManual.value = true;
    }
    if (type == 'auto') {
      typeAuto.value = true;
      typeManual.value = false;
    }
  }

  function action() {
    if(typeManual.value && !typeAuto.value) {
      if(
        betAmount.value >= minBetAmount.value &&
        betAmount.value <= maxBetAmount.value
      ) {
        isValidBetAmount.value = false
        if (isBetActive.value) {
          cashout();
        } else {
          document.getElementById('multiplierList').scrollTo(0,0)
          setBet(bombCount.value)
        }
      } else {
        isValidBetAmount.value = true
      }
    }
    if((!typeManual.value && typeAuto.value) && !isBetActive.value) {
      isBetActive.value = true;
    } else {
      isBetActive.value = false;
      selectedItemsForAutoMode.value = [];
    }
  }

  const revealCard = (i: number) => {
    typeManual.value ? manualModeBet(i) : autoModeBet(i);
  };
  
  function autoModeBet(i: number) {
    const selectionLimit = (25 - bombCount.value)
    if(selectedItemsForAutoMode.value.indexOf(i) === -1) {
      if(selectedItemsForAutoMode.value.length == selectionLimit) return
      selectedItemsForAutoMode.value.push(i)
      currentRound.value += 1
    } else {
      selectedItemsForAutoMode.value.splice(selectedItemsForAutoMode.value.findIndex((e: number) => e === i),1)
      currentRound.value -= 1
    }
    autoScrollMultiplierList();
  }
  
  function manualModeBet(i: number) {
    opened.value[i] = true;
    reveal(i);
    autoScrollMultiplierList();
  }

  function autoScrollMultiplierList() {
    let multiplierList = document.getElementById('multiplierList');
    if(multiplierList.scrollLeft > ((currentRound.value * 110) - 220 ) || multiplierList.scrollLeft < ((currentRound.value * 110) - 220 )) {
      multiplierList.scrollLeft = (currentRound.value * 110) - 150
    } else if(currentRound.value + 1 > 3) {
      multiplierList.scrollLeft += 110
    }
  }

  const getters = computed(() => {
    return {
      diamondCount,
      isBetActive,
      isFinished,
      modalInfo,
      currentRound,
      currentMultiplier,
      profit,
      typeManual,
      typeAuto,
      balance,
      revealedResults,
      currentTable,
      multipliersList,
      minBetAmount,
      maxBetAmount,
      isValidBetAmount,
      selectedItemsForAutoMode,
      opened
    };
  });

  return {
    getters,
    bombCount,
    betAmount,
    win,
    bet,
    cashout,
    setBet,
    reveal,
    revealResult,
    setMultiplierList,
    setType,
    action,
    manualModeBet,
    autoModeBet,
    revealCard
  };
});
