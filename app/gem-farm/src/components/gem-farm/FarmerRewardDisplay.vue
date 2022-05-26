<template>
  <div class="nes-container with-title">
    
    <div class="mb-2">Total staked: {{ reward.accruedReward }}</div>
    <div v-if="parseRewardType(farmReward) === 'variable'">
      <div class="mb-2 w-full bg-black text-white">Variable reward:</div>
      <div class="mb-2">
        Last recorded accrued reward per gem:
        {{
          numeral(
            reward.variableRate.lastRecordedAccruedRewardPerRarityPoint.n / 10 ** 15
          ).format('0,0.0')
        }}
      </div>
    </div>
    <div v-else>
      <div class="mb-2">
        Staking begins: {{ parseDate(reward.fixedRate.beginStakingTs) }}
      </div>
      
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import FixedScheduleDisplay from '@/components/gem-farm/FixedScheduleDisplay.vue';
import { parseDate } from '@/common/util';
import numeral from 'numeral';

export default defineComponent({
  components: { FixedScheduleDisplay },
  props: {
    reward: Object,
    farmReward: Object,
    title: String,
  },
  setup() {
    const parseRewardType = (reward: any): string => {
      //returns "variable" or "fixed"
      return Object.keys(reward.rewardType)[0];
    };

    return {
      parseRewardType,
      parseDate,
      numeral,
    };
  },
});
</script>

<style>
  
</style>
