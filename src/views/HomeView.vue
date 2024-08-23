<template>
  <div>
    <Hero />
    <div class="container">
      <ResultsMain v-if="!collectionsStore.apiError && collectionsStore.selectedCategory" />
      <ApiError v-else-if="collectionsStore.apiError" @retry="fetchData" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, nextTick, onBeforeMount } from 'vue';
import Hero from '@/components/Hero/HeroMain.vue';
import ResultsMain from '@/components/Result/ResultsMain.vue';
import ApiError from '@/components/Misc/ApiError.vue';
import { useCollectionsStore } from '@/stores/collections';
import { useFilterStore } from '@/stores/filter'
import { useScrollStore } from '@/stores/scroll';

const collectionsStore = useCollectionsStore();
const filterStore = useFilterStore()
const scrollStore = useScrollStore();

const restoreScrollPosition = () => {
  const savedScrollPosition = scrollStore.getScrollPosition();
  if (savedScrollPosition !== 0) {
    window.scrollTo({ top: savedScrollPosition });
  }
};

const fetchData = async () => {
  await collectionsStore.fetchResults(collectionsStore.selectedCategory, collectionsStore.searchQuery, filterStore.getFilters());
};

onBeforeMount(() => {
  restoreScrollPosition();
});

onMounted(async () => {
  await nextTick();
  restoreScrollPosition();
  fetchData(); // Fetch data when the component mounts
});
</script>
