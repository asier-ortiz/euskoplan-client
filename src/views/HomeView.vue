<template>
  <div>
    <Hero />
    <div class="container">
      <ResultsMain v-if="collectionsStore.selectedCategory" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, nextTick, watch } from 'vue';
import Hero from '@/components/Hero/HeroMain.vue';
import ResultsMain from '@/components/Result/ResultsMain.vue';
import { useCollectionsStore } from '@/stores/collections';
import { useFilterStore } from '@/stores/filter';
import { useScrollStore } from '@/stores/scroll'; // Import the scroll store

const collectionsStore = useCollectionsStore();
const filterStore = useFilterStore();
const scrollStore = useScrollStore(); // Use the scroll store

const performSearchAndFilter = async (skipIfNoChange = false) => {
  const { selectedCategory, searchQuery } = collectionsStore;
  const filters = filterStore.getFilters();

  if (skipIfNoChange && !selectedCategory && !searchQuery) {
    return; // Avoid unnecessary fetches if there is no change
  }

  console.log('Performing search with category, query, and filters:', selectedCategory, searchQuery, filters);
  await collectionsStore.fetchResults(selectedCategory, searchQuery, filters);
};

onMounted(async () => {
  const savedScrollPosition = scrollStore.getScrollPosition();

  // Restore scroll position immediately to minimize delay
  if (savedScrollPosition !== 0) {
    window.scrollTo({ top: savedScrollPosition });
  }

  await performSearchAndFilter(true); // Only perform search if necessary

  // After the main content is loaded, adjust the scroll position if necessary
  await nextTick();

  if (savedScrollPosition !== 0) {
    window.scrollTo({ top: savedScrollPosition });
  }
});

watch(
    () => [collectionsStore.searchQuery, collectionsStore.selectedCategory],
    async ([newQuery, newCategory], [oldQuery, oldCategory]) => {
      if (newQuery !== oldQuery || newCategory !== oldCategory) {
        await performSearchAndFilter();
      }
    }
);
</script>
