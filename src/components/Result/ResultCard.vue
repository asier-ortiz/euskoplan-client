<template>
  <div class="result-card" @click="navigateToDetail">
    <div class="card-image" :style="{ backgroundImage: `url(${imageUrl})` }">
      <div v-if="!imageLoaded" class="skeleton-loader"></div>
      <img
        :src="imageUrl"
        @load="handleImageLoad"
        @error="handleImageError"
        class="hidden-image"
        alt="Image of {{ name }}"
      />
      <!-- Event Date Overlay -->
      <div v-if="isEvent" class="event-date">{{ formattedDate }}</div>
      <!-- Population and Area Overlay for Locality -->
      <div v-if="isLocality" class="overlay population">{{ formattedPopulation }} hab.</div>
      <div v-if="isLocality" class="overlay area">{{ formattedArea }}</div>
    </div>
    <div class="card-content">
      <h3>{{ subtype }}</h3>
      <h2>{{ name }}</h2>
      <p v-if="municipality" class="location-text">{{ municipality }}</p>
      <p v-if="distance !== null">
        <font-awesome-icon icon="location-dot" class="location-icon" />
        {{ distance.toFixed(2) }} km
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useLocationStore } from '@/stores/location';
import { calculateDistance } from '@/utils/distance';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useImageHandler } from '@/utils/image';

const props = defineProps({
  itemId: {
    type: [Number, String],
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
  longitude: {
    type: [Number, String],
    required: true,
  },
  latitude: {
    type: [Number, String],
    required: true,
  },
  subtype: {
    type: String,
    required: true,
  },
  municipality: {
    type: String,
    required: true,
  },
  startDate: {
    type: String,
    default: null,
  },
  area: {
    type: [Number, String],
    default: null,
  },
  population: {
    type: [Number, String],
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
  if (locationStore.userLocation && props.longitude && props.latitude) {
    return calculateDistance(
      locationStore.userLocation.latitude,
      locationStore.userLocation.longitude,
      Number(props.latitude),
      Number(props.longitude)
    );
  }
  return null;
});

const navigateToDetail = () => {
  router.push({ name: 'Detail', params: { id: Number(props.itemId), category: props.collection } });
};

// Determine if the current collection is an event
const isEvent = computed(() => props.collection.toLowerCase() === 'event');

// Determine if the current collection is a locality
const isLocality = computed(() => props.collection.toLowerCase() === 'locality');

// Format the start date for events
const formattedDate = computed(() => {
  if (!props.startDate) return '';
  const date = new Date(props.startDate);
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
});

// TODO Move to a global utility function

// Format population with commas for readability
const formattedPopulation = computed(() => {
  return props.population ? parseInt(props.population, 10).toLocaleString() : '';
});

// Format area with two decimal places
const formattedArea = computed(() => {
  return props.area ? parseFloat(props.area).toFixed(2) + ' km²' : '';
});
</script>

<style scoped>
.result-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 320px;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  background-color: white;
}

.result-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.card-image {
  flex: 2;
  height: 60%;
  position: relative;
  border-bottom: 1px solid #ddd;
  background-size: cover;
  background-position: center;
  overflow: hidden;
}

.hidden-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;
  opacity: 0;
}

.hidden-image.loaded {
  opacity: 1;
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
  background-color: #ffffff;
  text-align: center;
}

.card-content h3 {
  margin: 0 0 0.25rem;
  font-size: 0.8rem;
  color: #666666;
  text-transform: uppercase;
  font-weight: normal;
  letter-spacing: 0.5px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-content h2 {
  margin: 0 0 0.5rem;
  font-size: 1.4rem;
  color: #333333;
  font-weight: bold;
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-content p {
  margin: 0.25rem 0;
  font-size: 1rem;
  color: #555555;
}

.card-content .location-icon {
  margin-right: 0.5rem;
  color: #007bff;
}

.location-text {
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

/* Style for population and area overlays */
.overlay {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 5px;
  border-radius: 5px;
  font-size: 0.8rem;
}

.overlay.population {
  bottom: 5px;
  left: 5px;
}

.overlay.area {
  bottom: 5px;
  right: 5px;
}
</style>
