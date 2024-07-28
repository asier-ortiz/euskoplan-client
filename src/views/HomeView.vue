<template>
  <div>
    <Hero />
    <div v-if="randomCollectionsLoaded">
      <h2>Random Accommodations</h2>
      <ul>
        <li v-for="item in randomAccommodations" :key="item.id">{{ item.nombre }}</li>
      </ul>
      <h2>Random Caves</h2>
      <ul>
        <li v-for="item in randomCaves" :key="item.id">{{ item.nombre }}</li>
      </ul>
      <h2>Random Culturals</h2>
      <ul>
        <li v-for="item in randomCulturals" :key="item.id">{{ item.nombre }}</li>
      </ul>
      <h2>Random Events</h2>
      <ul>
        <li v-for="item in randomEvents" :key="item.id">{{ item.nombre }}</li>
      </ul>
      <h2>Random Fairs</h2>
      <ul>
        <li v-for="item in randomFairs" :key="item.id">{{ item.nombre }}</li>
      </ul>
      <h2>Random Museums</h2>
      <ul>
        <li v-for="item in randomMuseums" :key="item.id">{{ item.nombre }}</li>
      </ul>
      <h2>Random Naturals</h2>
      <ul>
        <li v-for="item in randomNaturals" :key="item.id">{{ item.nombre }}</li>
      </ul>
      <h2>Random Restaurants</h2>
      <ul>
        <li v-for="item in randomRestaurants" :key="item.id">{{ item.nombre }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useCollectionsStore } from '@/stores/collections';
import Hero from '@/components/Hero/Hero.vue';

const collectionsStore = useCollectionsStore();

const randomCollectionsLoaded = ref(false);

const loadRandomCollections = async () => {
  await collectionsStore.loadRandomCollections();
  randomCollectionsLoaded.value = true;
};

onMounted(() => {
  loadRandomCollections();
});

const { randomAccommodations, randomCaves, randomCulturals, randomEvents, randomFairs, randomMuseums, randomNaturals, randomRestaurants } = collectionsStore;
</script>
