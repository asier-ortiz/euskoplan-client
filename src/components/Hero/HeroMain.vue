<template>
  <div class="hero-container">
    <div class="hero-overlay" :style="{ backgroundColor: overlayColor }">
      <div class="hero-content">
        <h1>Encuentra tu próxima aventura</h1>
        <SearchInput @search="onSearch" />
        <div class="chips-and-filter">
          <CategoryChips @chipSelected="onChipSelected" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { defineEmits } from 'vue';
import SearchInput from '@/components/Hero/HeroSearchInput.vue';
import CategoryChips from '@/components/Hero/HeroCategoryChips.vue';

const emit = defineEmits(['chipSelected', 'search']);
const overlayColor = ref('rgba(0, 0, 0, 0.4)');

const onChipSelected = (category) => {
  emit('chipSelected', category);
};

const onSearch = (query) => {
  emit('search', query);
};

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
  width: 100vw; /* Ensure full viewport width */
  left: 50%; /* Center hero with respect to the viewport */
  right: 50%;
  margin-left: -50vw; /* Adjust position to avoid overflow */
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
