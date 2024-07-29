<template>
  <div>
    <Hero />
    <Spinner :visible="!randomCollectionsLoaded" />
    <div v-if="randomCollectionsLoaded">

      <div class="card-container">
        <ResultCard
          v-for="item in collectionsStore.randomAccommodations"
          :key="item.id"
          collection="Accommodation"
          :name="item.nombre"
          :images="item.imagenes"
        />
      </div>

      <div class="card-container">
        <ResultCard
          v-for="item in collectionsStore.randomCaves"
          :key="item.id"
          collection="Cave"
          :name="item.nombre"
          :images="item.imagenes"
        />
      </div>

      <div class="card-container">
        <ResultCard
          v-for="item in collectionsStore.randomCulturals"
          :key="item.id"
          collection="Cultural"
          :name="item.nombre"
          :images="item.imagenes"
        />
      </div>

      <div class="card-container">
        <ResultCard
          v-for="item in collectionsStore.randomEvents"
          :key="item.id"
          collection="Event"
          :name="item.nombre"
          :images="item.imagenes"
        />
      </div>

      <div class="card-container">
        <ResultCard
          v-for="item in collectionsStore.randomFairs"
          :key="item.id"
          collection="Fair"
          :name="item.nombre"
          :images="item.imagenes"
        />
      </div>

      <div class="card-container">
        <ResultCard
          v-for="item in collectionsStore.randomMuseums"
          :key="item.id"
          collection="Museum"
          :name="item.nombre"
          :images="item.imagenes"
        />
      </div>

      <div class="card-container">
        <ResultCard
          v-for="item in collectionsStore.randomNaturals"
          :key="item.id"
          collection="Natural"
          :name="item.nombre"
          :images="item.imagenes"
        />
      </div>

      <div class="card-container">
        <ResultCard
          v-for="item in collectionsStore.randomRestaurants"
          :key="item.id"
          collection="Restaurant"
          :name="item.nombre"
          :images="item.imagenes"
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
};

onMounted(() => {
  loadRandomCollections();
});

</script>

<style scoped>
.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
</style>
