<template>
  <div class="result-card" @click="navigateToDetail">
    <div class="card-image" :style="{ backgroundImage: `url(${imageUrl})` }">
      <div v-if="!imageLoaded" class="skeleton-loader"></div> <!-- Skeleton loader -->
      <img
          :src="imageUrl"
          @load="handleImageLoad"
          @error="handleImageError"
          class="hidden-image"
          alt="Image of {{ name }}"
      />
      <!-- Event Date Overlay -->
      <div v-if="isEvent" class="event-date">{{ formattedDate }}</div>
    </div>
    <div class="card-content">
      <h3>{{ subtype }}</h3> <!-- Display subtype -->
      <h2>{{ name }}</h2>
      <p v-if="municipio" class="municipio-text">{{ municipio }}</p> <!-- Display municipio -->
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
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useImageHandler } from '@/utils/image';

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
  subtype: {
    type: String,
    required: true,
  },
  municipio: {
    type: String,
    required: true,
  },
  fechaInicio: {
    type: String,
    default: null,
  }
});

const router = useRouter();
const locationStore = useLocationStore();

const { imageUrl, imageLoaded, setInitialImage, handleImageLoad, handleImageError } = useImageHandler(props.collection, props.images);

watch(
    () => props.images,
    () => setInitialImage(),
    { immediate: true }
);

const distance = computed(() => {
  if (locationStore.userLocation && props.longitud && props.latitud) {
    return calculateDistance(
        locationStore.userLocation.latitude,
        locationStore.userLocation.longitude,
        Number(props.latitud),
        Number(props.longitud)
    );
  }
  return null;
});

const navigateToDetail = () => {
  router.push({ name: 'Detail', params: { id: Number(props.itemId), category: props.collection } });
};

const isEvent = computed(() => props.collection.toLowerCase() === 'event');

const formattedDate = computed(() => {
  if (!props.fechaInicio) return '';
  const date = new Date(props.fechaInicio);
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
});
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
  height: 60%;
  position: relative;
  border-bottom: 1px solid #ddd; /* Divider between image and content */
  background-size: cover;
  background-position: center;
  overflow: hidden;
}

.hidden-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover; /* Ensures image covers the entire container */
  transition: opacity 0.3s ease; /* Smooth transition for image */
  opacity: 0; /* Start invisible */
}

.hidden-image.loaded {
  opacity: 1; /* Fade in image once loaded */
}

.skeleton-loader {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  position: absolute;
  top: 0;
  left: 0;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
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
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-content h2 {
  margin: 0 0 0.5rem; /* Add margin-bottom for spacing */
  font-size: 1.4rem; /* Slightly reduced font size for better balance */
  color: #333333; /* Darker color for the name text */
  font-weight: bold;
  line-height: 1.2; /* Improved line spacing */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
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

.municipio-text {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
}

/* Style for the event date overlay */
.event-date {
  position: absolute;
  bottom: 5px;
  right: 5px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 5px;
  border-radius: 5px;
  font-size: 0.8rem;
}
</style>
