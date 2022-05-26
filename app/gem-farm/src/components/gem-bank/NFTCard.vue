<template>
  <div
    class="m-1 card flex justify-center"
    :class="{ 'card-selected': selected }"
    
  >
   <p class="NFTname"> <img
      :src="nft.externalMetadata.image"
      :alt="nft.onchainMetadata.data.name"

    />{{nft.onchainMetadata.data.name}}<br><button class="butt" @click="toggleSelect">Select</button> </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { findRarityPDA } from '../../../../../src/gem-bank/gem-bank.pda';
export default defineComponent({
  props: {
    nft: { type: Object, required: true },
  },
  emits: ['selected'],
  setup(props, ctx) {
    const selected = ref<boolean>(false);

    const toggleSelect = () => {
      selected.value = !selected.value;
      console.log('selected', props.nft.mint.toBase58());
      ctx.emit('selected', {
        nft: props.nft,
        selected: selected.value,
      });
    };

    return {
      selected,
      toggleSelect,
    };
  },
});
</script>

<style scoped>
.butt{
  font: italic small-caps bold 14px/2 cursive;
  padding: -2px;
  text-transform: uppercase;
  border: 2px solid #f50606;
  border-radius: 3px;
  color: #ee0606;
  background-color: black;
  width: 160px;
  height: 30px;

}
.back{
  
  height: 50px;
  background-color: red; /* Green */
  border: solid;
  color: black;
  position: relative;
  right : -50px;
  top: 30px;
  padding: 1px 10px;
}
.stake{
  background-color: white;
  color : black;
  width :180px;
}
.NFTname{
  text-align: center;
  color : white;
}

img {
  max-width: 100%;
  max-height: 100%;
  height: 190px;
  width: 190px;
  position: relative;
  left: -1px;
}

.card {
  width: 200px;
  height: 320px;
}


.card-selected {
  @apply border-4 border-solid;
  border-color: red !important;
  
}
</style>
