<template>
  <div>
    <Hero />
    <Spinner :visible="!randomCollectionsLoaded" />
    <div v-if="randomCollectionsLoaded">
      <h2>Random Accommodations</h2>
      <div class="card-container">
        <ResultCard
          v-for="item in randomAccommodations"
          :key="item.id"
          collection="Accommodation"
          :name="item.nombre || 'No name available'"
          :images="item.imagenes || []"
        />
      </div>
      <h2>Random Caves</h2>
      <div class="card-container">
        <ResultCard
          v-for="item in randomCaves"
          :key="item.id"
          collection="Cave"
          :name="item.nombre || 'No name available'"
          :images="item.imagenes || []"
        />
      </div>
      <h2>Random Culturals</h2>
      <div class="card-container">
        <ResultCard
          v-for="item in randomCulturals"
          :key="item.id"
          collection="Cultural"
          :name="item.nombre || 'No name available'"
          :images="item.imagenes || []"
        />
      </div>
      <h2>Random Events</h2>
      <div class="card-container">
        <ResultCard
          v-for="item in randomEvents"
          :key="item.id"
          collection="Event"
          :name="item.nombre || 'No name available'"
          :images="item.imagenes || []"
        />
      </div>
      <h2>Random Fairs</h2>
      <div class="card-container">
        <ResultCard
          v-for="item in randomFairs"
          :key="item.id"
          collection="Fair"
          :name="item.nombre || 'No name available'"
          :images="item.imagenes || []"
        />
      </div>
      <h2>Random Museums</h2>
      <div class="card-container">
        <ResultCard
          v-for="item in randomMuseums"
          :key="item.id"
          collection="Museum"
          :name="item.nombre || 'No name available'"
          :images="item.imagenes || []"
        />
      </div>
      <h2>Random Naturals</h2>
      <div class="card-container">
        <ResultCard
          v-for="item in randomNaturals"
          :key="item.id"
          collection="Natural"
          :name="item.nombre || 'No name available'"
          :images="item.imagenes || []"
        />
      </div>
      <h2>Random Restaurants</h2>
      <div class="card-container">
        <ResultCard
          v-for="item in randomRestaurants"
          :key="item.id"
          collection="Restaurant"
          :name="item.nombre || 'No name available'"
          :images="item.imagenes || []"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useCollectionsStore } from '@/stores/collections';
import Hero from '@/components/Hero/Hero.vue';
import ResultCard from '@/components/Result/ResultCard.vue';
import Spinner from '@/components/Spinner.vue';

const collectionsStore = useCollectionsStore();

const randomCollectionsLoaded = ref(false);

const loadRandomCollections = async () => {
  await collectionsStore.loadRandomCollections();
  randomCollectionsLoaded.value = true;
  console.log('Random Accommodations:', collectionsStore.randomAccommodations);
  console.log('Random Caves:', collectionsStore.randomCaves);
  console.log('Random Culturals:', collectionsStore.randomCulturals);
  console.log('Random Events:', collectionsStore.randomEvents);
  console.log('Random Fairs:', collectionsStore.randomFairs);
  console.log('Random Museums:', collectionsStore.randomMuseums);
  console.log('Random Naturals:', collectionsStore.randomNaturals);
  console.log('Random Restaurants:', collectionsStore.randomRestaurants);
};

onMounted(() => {
  loadRandomCollections();
});

const { randomAccommodations, randomCaves, randomCulturals, randomEvents, randomFairs, randomMuseums, randomNaturals, randomRestaurants } = collectionsStore;
</script>

<style scoped>
.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
</style>
