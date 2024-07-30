<template>
  <transition
    enter-active-class="slide-enter-active"
    leave-active-class="slide-leave-active"
    enter-class="slide-enter"
    leave-to-class="slide-leave-to"
  >
    <div class="drawer" v-if="visible">
      <button class="close-button" @click="$emit('close')">Close</button>
      <!-- Contenido del drawer -->
    </div>
  </transition>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
.drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100%;
  background: white;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
  padding: 1rem;
  z-index: 1000;
}

.slide-enter-active {
  transition: transform 0.7s ease; /* Más lenta al mostrarse */
}

.slide-leave-active {
  transition: transform 0.3s ease; /* Más rápida al ocultarse */
}

.slide-enter, .slide-leave-to {
  transform: translateX(100%);
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}
</style>
