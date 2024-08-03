<template>
  <div class="result-card" @click="navigateToDetail">
    <div class="card-image" :style="{ backgroundImage: `url(${imageUrl})` }">
      <img :src="imageUrl" @error="handleImageError" class="hidden-image" alt="Image of {{ name }}" />
    </div>
    <div class="card-content">
      <h3>{{ subtype }}</h3> <!-- Display subtype -->
      <h2>{{ name }}</h2>
      <p v-if="municipio">{{ municipio }}</p> <!-- Display municipio -->
      <p v-if="distance !== null">
        <font-awesome-icon icon="location-dot" class="location-icon" /> <!-- Add location icon -->
        {{ distance.toFixed(2) }} km
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useLocationStore } from '@/stores/location';
import { calculateDistance } from '@/utils/distance';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'; // Import FontAwesomeIcon

// Define props with TypeScript types
const props = defineProps({
  itemId: {
    type: [Number, String], // Accept both Number and String
    required: true,
  },
  collection: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  images: {
    type: Array,
    default: () => [],
  },
  longitud: {
    type: [Number, String], // Accept both Number and String
    required: true,
  },
  latitud: {
    type: [Number, String], // Accept both Number and String
    required: true,
  },
  subtype: { // Add subtype prop
    type: String,
    required: true,
  },
  municipio: { // Add municipio prop
    type: String,
    required: true,
  },
});

// Use Vue Router for navigation
const router = useRouter();

// Use Location Store
const locationStore = useLocationStore();

// Define a ref to store the current image URL
const imageUrl = ref('');

// Distance calculation
const distance = computed(() => {
  if (locationStore.userLocation && props.longitud && props.latitud) {
    return calculateDistance(
      locationStore.userLocation.latitude,
      locationStore.userLocation.longitude,
      Number(props.latitud), // Convert to number
      Number(props.longitud)  // Convert to number
    );
  }
  return null;
});

// Default images by collection type
const getDefaultImageUrl = (collection: string) => {
  const defaultImages: Record<string, string> = {
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

// Navigate to detail page on card click
const navigateToDetail = () => {
  router.push({ name: 'Detail', params: { id: Number(props.itemId), category: props.collection } }); // Convert itemId to number
};
</script>

<style scoped>
.result-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 320px; /* Increased height for more visual appeal */
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
  margin: 0 0 0.25rem; /* Add margin-bottom for spacing */
  font-size: 0.8rem; /* Smaller font size for subtype text */
  color: #666666; /* Gray color for the subtype text */
  text-transform: uppercase;
  font-weight: normal;
  letter-spacing: 0.5px; /* Add letter spacing for a cleaner look */
}

.card-content h2 {
  margin: 0 0 0.5rem; /* Add margin-bottom for spacing */
  font-size: 1.4rem; /* Slightly reduced font size for better balance */
  color: #333333; /* Darker color for the name text */
  font-weight: bold;
  line-height: 1.2; /* Improved line spacing */
}

.card-content p {
  margin: 0.25rem 0; /* Ensure some margin for the municipio text */
  font-size: 1rem; /* Adjust font size for municipio and distance text */
  color: #555555; /* Slightly lighter color for text */
}

.card-content .location-icon {
  margin-right: 0.5rem; /* Space between icon and text */
  color: #007bff; /* Color for the location icon */
}

.card-content h3,
.card-content h2 {
  transition: color 0.3s; /* Smooth color transition */
}

.result-card:hover .card-content h2 {
  color: #007bff; /* Highlight title on hover */
}
</style>
