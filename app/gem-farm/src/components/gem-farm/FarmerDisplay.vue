<template>
<div>

</div>
<div class="reward">
  <div class="nes-container with-title">
    <div class="mb-2">Humans meditating: {{ farmerAcc.gemsStaked }} </div>
    <div class="mb-2">% of Humans meditating:  {{ (farmAcc.gemsStaked *100)/2}} % </div>
    <FarmerRewardDisplay
      :key="farmerAcc.rewardB"
      :farmReward="farmAcc.rewardB"
      :reward="farmerAcc.rewardB"
      title="Reward B"
    />
    <div>
    <button class="nes-btn is-primary mb-5" @click="refreshFarmer">
      Refresh account
    </button>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch } from 'vue';
import FarmerRewardDisplay from '@/components/gem-farm/FarmerRewardDisplay.vue';
import useWallet from '@/composables/wallet';
import useCluster from '@/composables/cluster';
import { initGemFarm } from '@/common/gem-farm';
import { PublicKey } from '@solana/web3.js';
import { parseDate } from '@/common/util';

export default defineComponent({
  components: { FarmerRewardDisplay },
  props: {
    farm: String,
    farmAcc: Object,
    farmer: String,
    farmerAcc: Object,
  },
  emits: ['refresh-farmer'],
  setup(props, ctx) {
    const { wallet, getWallet } = useWallet();
    const { cluster, getConnection } = useCluster();

    let gf: any;
    watch([wallet, cluster], async () => {
      gf = await initGemFarm(getConnection(), getWallet()!);
    });

    //need an onmounted hook because this component isn't yet mounted when wallet/cluster are set
    onMounted(async () => {
      if (getWallet() && getConnection()) {
        gf = await initGemFarm(getConnection(), getWallet()!);
      }
    });

    // --------------------------------------- display farmer
    // todo ideally should be using one from client, but n/a during render
    const parseFarmerState = (farmer: any): string => {
      return Object.keys(farmer.state)[0];
    };

    const refreshFarmer = async () => {
      await gf.refreshFarmerWallet(
        new PublicKey(props.farm!),
        new PublicKey(props.farmer!)
      );
      ctx.emit('refresh-farmer');
    };

    return {
      refreshFarmer,
      parseFarmerState,
      parseDate,
    };
  },
});
</script>

<style>
.fit-picture {
  
    width: 200px;
    position: relative;
  top: 5px;
  left: 40%;
}
  .reward{
    font: italic small-caps bold 16px/2 cursive;
    padding: -3px;
    text-transform: uppercase;
    border: 7px outset #ff6105;
    border-radius: 3px;
    color: #ee0606;
    background-color: black;
    text-align: center;
    font-size: 24px;
    padding: 2rem 1rem;
    min-height: 3em;
    width: 60%;
    margin: auto;
    min-width: 300px;
    width: 400px;

  }
  .nes-container with-title{
    width: 100%;
    margin: 0 auto;
  }
  .mb-2{
    height: 30px;
    color : white;
  }
  div{
   font-size: 20px;
  }
</style>
