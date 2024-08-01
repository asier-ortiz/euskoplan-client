<template>
  <div class="spinner-overlay" v-if="visible">
    <div class="spinner"></div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.spinner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(240, 240, 240, 0.8); /* Match the main background color */
  z-index: 10; /* Ensure it is above the content but below navigation */
}

.spinner {
  border: 8px solid rgba(0, 0, 0, 0.1);
  border-left-color: #000;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
