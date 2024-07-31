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
import SearchInput from '@/components/Hero/SearchInput.vue';
import CategoryChips from '@/components/Hero/CategoryChips.vue';

const emit = defineEmits(['chipSelected', 'search']);
const overlayColor = ref('rgba(0, 0, 0, 0.4)'); // Initial overlay color

const onChipSelected = (category) => {
  emit('chipSelected', category);
};

const onSearch = (query) => {
  emit('search', query);
};

const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const opacity = Math.min(0.4 + scrollTop / 500, 0.7); // Increase overlay opacity with scroll
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
  width: 100%;
  height: 400px; /* Height can be adjusted */
  background: url('/images/gaztelugatxe.webp') no-repeat center center;
  background-size: cover;
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
  transition: background-color 0.3s; /* Smooth transition for background color */
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
  margin-top: 2rem; /* Increased margin for more space between input and chips */
}

/* Media queries for responsiveness */
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
