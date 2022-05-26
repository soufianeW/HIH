<template>
<body>
 
</body>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { GEM_FARM_PROG_ID } from '@gemworks/gem-farm-ts';
export default defineComponent({
  setup() {
    return {
      GEM_FARM_PROG_ID,
    };
  },
});
</script>
<style>
  body{
    background-image: url('../assets/backk.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
</style>
