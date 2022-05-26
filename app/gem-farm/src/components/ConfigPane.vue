<template>
  <div class="flex justify-center mb-10">
  <p id="wallet" v-if="!isHidden">
  <label><input type="checkbox" name="wallets"  v-on:click="isHidden = true"  value="WalletName.Phantom" v-model="chosenWallet"><span>Connect Wallet</span></label>
  </p>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { WalletName } from '@solana/wallet-adapter-wallets';
import useCluster, { Cluster } from '@/composables/cluster';
import useWallet from '@/composables/wallet';
import { Wallet } from '@metaplex/js';



export default defineComponent({

  setup() {

    // cluster
    const { cluster, setCluster, getClusterURL } = useCluster();
    const chosenCluster = computed({
      get() {
        return cluster.value;
      },
      set(newVal: Cluster) {
        setCluster(newVal);
      },
    });

    // wallet
    const { getWalletName, setWallet } = useWallet();
    const chosenWallet = computed({
      get() {
        return getWalletName();
      },
      set(newval: WalletName | null) {
        setWallet(WalletName.Phantom, getClusterURL());
      },
    });


    return {
      isHidden : false,
      Cluster,
      chosenCluster,
      WalletName,
      chosenWallet,
    };
  },
});
</script>

<style>
#wallet input[type="checkbox"] {
  display: none;
}

#wallet span {
  font: italic small-caps bold 16px/2 cursive;
  display: inline-block;
  padding: 10px;
  text-transform: uppercase;
  border: 2px solid #f50606;
  border-radius: 3px;
  color: #ee0606;
  background-color: black;
}

#wallet input[type="checkbox"]:checked + span {
  background-color: #441BA4;
  color: white;
}
</style>
