<template>
  <div v-show="isZoomMessageVisible" class="zoom-message">
    Mantén presionada la tecla Ctrl (Cmd en Mac) para hacer zoom
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps<{
  mapInstance: mapboxgl.Map | undefined;
}>();

const isZoomMessageVisible = ref(false);
let zoomMessageTimeout: number | null = null;

const handleWheelZoom = (event: WheelEvent) => {
  if (event.ctrlKey || event.metaKey) {
    props.mapInstance?.scrollZoom.enable();
    event.preventDefault();
  } else {
    props.mapInstance?.scrollZoom.disable();
    isZoomMessageVisible.value = true;
    if (zoomMessageTimeout) {
      clearTimeout(zoomMessageTimeout);
    }
    zoomMessageTimeout = setTimeout(() => {
      isZoomMessageVisible.value = false;
    }, 2000);
  }
};

onMounted(() => {
  window.addEventListener('wheel', handleWheelZoom);
});

onUnmounted(() => {
  window.removeEventListener('wheel', handleWheelZoom);
});
</script>

<style scoped>
.zoom-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  z-index: 3;
  text-align: center;
  font-size: 1rem;
}
</style>
