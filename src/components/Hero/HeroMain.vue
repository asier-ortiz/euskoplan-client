<template>
  <div class="hero-container">
    <div class="hero-overlay" :style="{ backgroundColor: overlayColor }">
      <div class="hero-content">
        <h1>Encuentra tu próxima aventura</h1>
        <!-- CategoryChips placed above SearchInput -->
        <div class="chips-and-filter">
          <CategoryChips />
        </div>
        <!-- SearchInput managed purely by CSS for visibility -->
        <div class="search-input-wrapper" :class="{ hidden: !isCategorySelected }">
          <SearchInput />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useCollectionsStore } from '@/stores/collections';
import SearchInput from '@/components/Hero/HeroSearchInput.vue';
import CategoryChips from '@/components/Hero/HeroCategoryChips.vue';

const overlayColor = ref('rgba(0, 0, 0, 0.4)');

// Access the collections store
const collectionsStore = useCollectionsStore();

// Reactive reference to the selected category
const selectedCategory = computed(() => collectionsStore.selectedCategory);

// Computed property to determine if a category is selected
const isCategorySelected = computed(() => selectedCategory.value !== '');

// Handle scroll for overlay effect
const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const opacity = Math.min(0.4 + scrollTop / 500, 0.7);
  overlayColor.value = `rgba(0, 0, 0, ${opacity})`;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.hero-container {
  position: relative;
  width: 100vw;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  height: 400px;
  background: url('/images/gaztelugatxe.webp') no-repeat center center;
  background-size: cover;
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s;
}

.hero-content {
  text-align: center;
  color: white;
  padding: 2rem;
  max-width: 800px;
  width: 100%;
}

.hero-content h1 {
  margin: 0 0 1rem;
  font-size: 2.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
}

.chips-and-filter {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
  width: 100%; /* Full width for uniform appearance */
  max-width: 800px; /* Same max-width as hero-content */
  padding: 0 2rem; /* Padding to center the chips */
}

.search-input-wrapper {
  margin-top: 1rem; /* Margin for spacing */
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%; /* Full width to match chips-and-filter */
  max-width: 800px; /* Same max-width for consistency */
  padding: 0 2rem; /* Padding to center the input */
  min-height: 60px; /* Minimum height to reserve space */
  opacity: 1;
  transition: opacity 0.5s, visibility 0.5s;
}

.search-input-wrapper.hidden {
  opacity: 0;
  visibility: hidden;
}

/* Make the SearchInput full width */
.search-input-wrapper input {
  width: 100%;
  max-width: 100%;
  padding: 0.5rem 1rem;
  border: 2px solid #007bff;
  border-radius: 25px 0 0 25px;
  outline: none;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2rem;
  }

  .chips-and-filter {
    gap: 0.3rem;
  }
}

@media (max-width: 480px) {
  .hero-content h1 {
    font-size: 1.5rem;
  }

  .chips-and-filter {
    flex-direction: column;
    gap: 0.3rem;
  }
}
</style>
