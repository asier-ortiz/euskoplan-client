<template>
  <div>
    <Hero />
    <div class="container">
      <ResultsMain v-if="collectionsStore.selectedCategory" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, nextTick, onBeforeMount } from 'vue';
import Hero from '@/components/Hero/HeroMain.vue';
import ResultsMain from '@/components/Result/ResultsMain.vue';
import { useCollectionsStore } from '@/stores/collections';
import { useScrollStore } from '@/stores/scroll';

const collectionsStore = useCollectionsStore();
const scrollStore = useScrollStore();

const restoreScrollPosition = () => {
  const savedScrollPosition = scrollStore.getScrollPosition();
  if (savedScrollPosition !== 0) {
    window.scrollTo({ top: savedScrollPosition });
  }
};

onBeforeMount(() => {
  restoreScrollPosition();
});

onMounted(async () => {
  // Restore scroll position after DOM updates
  await nextTick();
  restoreScrollPosition();
});
</script>
