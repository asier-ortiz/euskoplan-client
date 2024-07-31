<template>
  <div class="result-card" @click="navigateToDetail">
    <div class="card-image" :style="{ backgroundImage: `url(${imageUrl})` }">
      <img :src="imageUrl" @error="handleImageError" class="hidden-image" alt="Image of {{ name }}" />
    </div>
    <div class="card-content">
      <h3>{{ collection }}</h3>
      <h2>{{ name }}</h2>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, watch } from 'vue';
import { useRouter } from 'vue-router';

// Define props with TypeScript types
const props = defineProps({
  itemId: Number, // Ensure `itemId` is a number
  collection: String,
  name: String,
  images: {
    type: Array,
    default: () => [],
  },
});

// Use Vue Router for navigation
const router = useRouter();

// Navigate to detail page on card click
const navigateToDetail = () => {
  router.push({ name: 'Detail', params: { id: props.itemId, category: props.collection } });
};

// Define a ref to store the current image URL
const imageUrl = ref('');

// Default images by collection type
const getDefaultImageUrl = (collection) => {
  const defaultImages = {
    accommodation: '/images/default/default-accommodation.jpg',
    cave: '/images/default/default-cave.jpg',
    cultural: '/images/default/default-cultural.jpg',
    event: '/images/default/default-event.jpg',
    fair: '/images/default/default-fair.jpg',
    museum: '/images/default/default-museum.jpg',
    natural: '/images/default/default-natural.jpg',
    restaurant: '/images/default/default-restaurant.jpg',
    default: '/images/default/default-image.jpg',
  };

  return defaultImages[collection.toLowerCase()] || defaultImages.default;
};

// Set initial image URL or default if none is available
watch(
    () => props.images,
    (newImages) => {
      if (newImages.length > 0 && newImages[0].fuente) {
        imageUrl.value = newImages[0].fuente;
      } else {
        imageUrl.value = getDefaultImageUrl(props.collection);
      }
    },
    { immediate: true }
);

// Handle image loading errors by setting the default image URL
const handleImageError = () => {
  imageUrl.value = getDefaultImageUrl(props.collection);
};
</script>

<style scoped>
.result-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 300px; /* Increased height for more visual appeal */
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s; /* Added transition effects */
  cursor: pointer;
  background-color: white; /* Background color for the card */
}

.result-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.card-image {
  flex: 2;
  background-size: cover;
  background-position: center;
  height: 60%;
  position: relative;
  border-bottom: 1px solid #ddd; /* Divider between image and content */
}

.hidden-image {
  display: none;
}

.card-content {
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #ffffff; /* White background for card content */
  text-align: center; /* Center align content */
}

.card-content h3 {
  margin: 0;
  font-size: 0.9rem; /* Smaller font size for collection text */
  color: #888888; /* Gray color for the collection text */
  text-transform: uppercase;
  font-weight: normal;
  letter-spacing: 1px; /* Add letter spacing for a cleaner look */
}

.card-content h2 {
  margin: 0;
  font-size: 1.4rem; /* Slightly reduced font size for better balance */
  color: #333333; /* Darker color for the name text */
  font-weight: bold;
  line-height: 1.2; /* Improved line spacing */
}

.card-content h3,
.card-content h2 {
  transition: color 0.3s; /* Smooth color transition */
}

.result-card:hover .card-content h2 {
  color: #007bff; /* Highlight title on hover */
}
</style>
