<template>
  <button :disabled="disabled">
    <img
      src="../assets/pls.png"
      alt="right"
      :width="120"
      :height="160"
      :class="{ left: left, disabled: disabled }"
      
    />
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  props: {
    left: Boolean,
    disabled: Boolean,
  },
  setup() {
    return {};
  },
});
</script>

<style scoped>
button,
img {
  outline: none !important;
  height: 70px;
}

.left {
  transform: scaleX(-1);
}
.disabled {
  opacity: 0;
}
</style>
