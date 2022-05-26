<template>
  <ConfigPane />
  <div v-if="!wallet" class="text-center"></div>
  <div v-else>
    <!--farm address-->
   
    <div class="containi">
    <div v-if="farmerAcc">
      <FarmerDisplay
        :key="farmerAcc"
        :farm="farm"
        :farmAcc="farmAcc"
        :farmer="farmer"
        :farmerAcc="farmerAcc"
        class="mb-10"
        @refresh-farmer="handleRefreshFarmer"
      />
      
      <Vault
        :key="farmerAcc"
        class="mb-10"
        :vault="farmerAcc.vault.toBase58()"
        @selected-wallet-nft="handleNewSelectedNFT"
      >
        
        <button
          v-if="farmerState === 'unstaked'"
          class="nes-btn is-success mr-5"
          @click="beginStaking"
        >
          Begin staking
        </button>
        <button
          v-if="farmerState === 'staked'"
          class="nes-btn is-error mr-5"
          @click="endStaking"
        >
          End staking
        </button>
        
        <button class="nes-btn is-warning" @click="claim">
          Claim {{ availableA }} $HUMN
        </button>
      </Vault>
    </div>
    <div v-else>
      <div class="w-full text-center mb-5">
        Welcome Human, seems like you found your way to the meditation room.
        There's a lot waiting for you inside as well as another surprise to reward you for the time you spend meditating.
        Become more $HUMN and get your ticket to Earth. 
      </div>
      <div class="w-ful text-center">
        <button class="nes-btn is-primary" @click="initFarmer">
          I'm ready
        </button>
      </div>
    </div>
  </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, ref, watch } from 'vue';
import useWallet from '@/composables/wallet';
import useCluster from '@/composables/cluster';
import { initGemFarm } from '@/common/gem-farm';
import { PublicKey } from '@solana/web3.js';
import ConfigPane from '@/components/ConfigPane.vue';
import FarmerDisplay from '@/components/gem-farm/FarmerDisplay.vue';
import Vault from '@/components/gem-bank/Vault.vue';
import { INFT } from '@/common/web3/NFTget';
import { findFarmerPDA, stringifyPKsAndBNs } from '@gemworks/gem-farm-ts';

export default defineComponent({
  components: { Vault, FarmerDisplay, ConfigPane },
  setup() {
    const { wallet, getWallet } = useWallet();
    const { cluster, getConnection } = useCluster();

    let gf: any;
    watch([wallet, cluster], async () => {
      await freshStart();
    });

    //needed in case we switch in from another window
    onMounted(async () => {
      await freshStart();
    });

    // --------------------------------------- farmer details
    const farm = 'YCKtYSYSNxs6JZxX7jWGd2BXaeMYyQZKzcuTLGFKZU8';
    const farmAcc = ref<any>();

    const farmerIdentity = ref<string>();
    const farmerAcc = ref<any>();
    const farmerState = ref<string>();

    const availableA = ref<string>();
    const availableB = ref<string>();

    

    const updateAvailableRewards = async () => {
      availableA.value = farmerAcc.value.rewardA.accruedReward
        .sub(farmerAcc.value.rewardA.paidOutReward)
        .toString();
      availableB.value = farmerAcc.value.rewardB.accruedReward
        .sub(farmerAcc.value.rewardB.paidOutReward)
        .toString();
    };

    const fetchFarn = async () => {
      farmAcc.value = await gf.fetchFarmAcc(new PublicKey(farm));
      console.log(
        `farm found at ${farm}:`,
        stringifyPKsAndBNs(farmAcc.value)
      );
    };

    const fetchFarmer = async () => {
      const [farmerPDA] = await findFarmerPDA(
        new PublicKey(farm),
        getWallet()!.publicKey!
      );
      farmerIdentity.value = getWallet()!.publicKey?.toBase58();
      farmerAcc.value = await gf.fetchFarmerAcc(farmerPDA);
      farmerState.value = gf.parseFarmerState(farmerAcc.value);
      await updateAvailableRewards();
      console.log(
        `farmer found at ${farmerIdentity.value}:`,
        stringifyPKsAndBNs(farmerAcc.value)
      );
    };

    const freshStart = async () => {
      if (getWallet() && getConnection()) {
        gf = await initGemFarm(getConnection(), getWallet()!);
        farmerIdentity.value = getWallet()!.publicKey?.toBase58();

        //reset stuff
        farmAcc.value = undefined;
        farmerAcc.value = undefined;
        farmerState.value = undefined;
        availableA.value = undefined;
        availableB.value = undefined;

        try {
          await fetchFarn();
          await fetchFarmer();
        } catch (e) {
          console.log(`farm with PK ${farm} not found :(`);
        }
      }
    };

    const initFarmer = async () => {
      await gf.initFarmerWallet(new PublicKey(farm));
      await fetchFarmer();
    };

    // --------------------------------------- staking
    const beginStaking = async () => {
      await gf.stakeWallet(new PublicKey(farm));
      await fetchFarmer();
      selectedNFTs.value = [];
    };

    const endStaking = async () => {
      await gf.unstakeWallet(new PublicKey(farm));
      await fetchFarmer();
      selectedNFTs.value = [];
      await gf.unstakeWallet(new PublicKey(farm));
      await fetchFarmer();
      selectedNFTs.value = [];
    };

    const claim = async () => {
      await gf.claimWallet(
        new PublicKey(farm),
        new PublicKey(farmAcc.value.rewardA.rewardMint!),
        new PublicKey(farmAcc.value.rewardB.rewardMint!)
      );
      await fetchFarmer();
    };

    const handleRefreshFarmer = async () => {
      await fetchFarmer();
    };

    // --------------------------------------- adding extra gem
    const selectedNFTs = ref<INFT[]>([]);

    const handleNewSelectedNFT = (newSelectedNFTs: INFT[]) => {
      console.log(`selected ${newSelectedNFTs.length} NFTs`);
      selectedNFTs.value = newSelectedNFTs;
    };

    const addSingleGem = async (
      gemMint: PublicKey,
      gemSource: PublicKey,
      creator: PublicKey
    ) => {
      await gf.flashDepositWallet(
        new PublicKey(farm),
        '1',
        gemMint,
        gemSource,
        creator
      );
      await fetchFarmer();
    };

    const addGems = async () => {
      await Promise.all(
        selectedNFTs.value.map((nft) => {
          const creator = new PublicKey(
            //todo currently simply taking the 1st creator
            (nft.onchainMetadata as any).data.creators[0].address
          );
          console.log('creator is', creator.toBase58());

          addSingleGem(nft.mint, nft.pubkey!, creator);
        })
      );
      console.log(
        `added another ${selectedNFTs.value.length} gems into staking vault`
      );
    };

    return {
      wallet,
      farm,
      farmAcc,
      farmer: farmerIdentity,
      farmerAcc,
      farmerState,
      availableA,
      availableB,
      initFarmer,
      beginStaking,
      endStaking,
      claim,
      handleRefreshFarmer,
      selectedNFTs,
      handleNewSelectedNFT,
      addGems,
    };
  },
});
</script>

<style>
.w-full{
  font: italic small-caps bold 16px/2 cursive;
    padding: -3px;
    text-transform: uppercase;
    border: 7px outset #ff6105;
    border-radius: 3px;
    color: #ee0606;
    background-color: black;
    text-align: center;
    font-size: 22px;
}
.nes-btn{
  margin : 20px;
  font: italic small-caps bold 21px/2 cursive;
  padding: 5px;
  text-transform: uppercase;
  border: 2px solid #f50606;
  border-radius: 3px;
  color: #ee0606;
  background-color: black;
  width: 250px;
}

.animated-button::before {
  content: '';
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: #8592ad;
  opacity: 0;
  -webkit-transition: .2s opacity ease-in-out;
  transition: .2s opacity ease-in-out;
}

.animated-button:hover::before {
  opacity: 0.2;
}

  
</style>
