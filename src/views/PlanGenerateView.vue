<template>
  <div :style="containerStyle" class="plan-generate-container">
    <div class="section first-section">
      <h3>¿Qué provincia quieres visitar?</h3>
      <div class="button-row">
        <button
          v-for="province in provinces"
          :key="province"
          :class="{ selected: selectedProvince === province }"
          @click="selectProvince(province)"
        >
          {{ displayProvince(province) }}
        </button>
      </div>
    </div>
    <div class="section">
      <h3>¿En qué mes quieres viajar?</h3>
      <div class="button-row">
        <button
          v-for="month in months"
          :key="month"
          :class="{ selected: selectedMonth === month }"
          @click="selectMonth(month)"
        >
          {{ month }}
        </button>
      </div>
    </div>
    <div class="section">
      <h3>¿Cuántos días quieres viajar?</h3>
      <div class="button-row">
        <button
          v-for="day in days"
          :key="day"
          :class="{ selected: selectedDays === day }"
          @click="selectDays(day)"
        >
          {{ day }} día{{ day > 1 ? 's' : '' }}
        </button>
      </div>
    </div>
    <div class="section">
      <h3>¿Qué tipo de viaje prefieres?</h3>
      <div class="button-row">
        <button
          v-for="type in tripTypes"
          :key="type"
          :class="{ selected: selectedTripType === type }"
          @click="selectTripType(type)"
        >
          {{ type }}
        </button>
      </div>
    </div>
    <button
      class="generate-button"
      :disabled="isButtonDisabled || loading"
      @click="generatePlan"
    >
      <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      <span v-else>Generar Itinerario</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { usePlanStore } from '@/stores/plan';

const planStore = usePlanStore();
const loading = ref(false);

const containerStyle = ref({ minHeight: '100vh' });

const calculateContainerHeight = () => {
  const navbar = document.querySelector('.navbar-main');
  const footer = document.querySelector('.footer-main');

  let navbarHeight = navbar ? navbar.clientHeight : 0;
  let footerHeight = footer ? footer.clientHeight : 0;

  containerStyle.value.minHeight = `calc(100vh - ${navbarHeight + footerHeight}px)`;
};

onMounted(() => {
  calculateContainerHeight();
  window.addEventListener('resize', calculateContainerHeight);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', calculateContainerHeight);
});

// Mapear los nombres visuales con los valores correctos para enviar en la solicitud
const provinces = ['Araba/Álava', 'Bizkaia', 'Gipuzkoa'];
const currentMonth = new Date().getMonth();
const currentYear = new Date().getFullYear();
const months = Array.from({ length: 12 }, (_, i) => {
  const date = new Date(currentYear, currentMonth + i);
  const formattedDate = date.toLocaleString('es-ES', { month: 'long', year: 'numeric' }).replace(' de ', ' ');
  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
});
const days = [1, 2, 3]; // Mantener como enteros para enviar correctamente
const tripTypes = ['Cultura', 'Aventura', 'Familiar'];

const selectedProvince = ref('');
const selectedMonth = ref('');
const selectedDays = ref(0);
const selectedTripType = ref('');

const selectProvince = (province: string) => {
  selectedProvince.value = province;
};

const selectMonth = (month: string) => {
  selectedMonth.value = month;
};

const selectDays = (days: number) => {
  selectedDays.value = days;
};

const selectTripType = (type: string) => {
  selectedTripType.value = type;
};

const isButtonDisabled = computed(() => {
  return !selectedProvince.value || !selectedMonth.value || !selectedDays.value || !selectedTripType.value;
});

// Para mostrar los nombres de las provincias sin la parte "Araba/"
const displayProvince = (province: string) => {
  return province.includes('/') ? province.split('/')[1] : province;
};

const generatePlan = async () => {
  loading.value = true;
  try {
    const monthParts = selectedMonth.value.split(' ');
    const monthIndex = months.findIndex(month => month === selectedMonth.value) + 1;
    const year = parseInt(monthParts[1], 10);

    const itineraryData = {
      provincia: selectedProvince.value,
      mes: monthIndex,
      año: year,
      dias: selectedDays.value, // Asegurarse de que `dias` se envía como un entero
      tipo_viaje: selectedTripType.value.toLowerCase(),
      idioma: 'es' // Idioma fijo para pruebas
    };

    const response = await planStore.suggestItinerary(itineraryData);
    console.log('Plan generated:', response);
  } catch (error) {
    console.error('Error generating plan:', error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.plan-generate-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 1.5rem;
  background-image: url('/images/gaztelugatxe.webp');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
}

.first-section {
  margin-top: 0.75rem;
}

.section {
  margin-bottom: 1.5rem;
  width: 100%;
  max-width: 800px;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
}

h3 {
  margin-bottom: 1rem;
  font-family: 'Arial', sans-serif;
  color: #fff;
  font-size: 1.25rem;
}

.button-row {
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  flex-wrap: wrap;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 25px;
  background-color: #e0e0e0;
  color: #333;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s, color 0.3s;
  flex: 1 1 calc(33.333% - 10px);
  max-width: 150px;
  height: 40px;
  font-size: 0.875rem;
}

button.selected, button.active {
  background-color: #007bff;
  color: #fff;
}

button:hover {
  background-color: #0056b3;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  color: #fff;
}

.generate-button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background-color: #ff9800;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
  margin-top: 1rem;
  width: 300px;
  height: 50px;
  max-width: 300px;
  max-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.generate-button[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}

.generate-button .spinner-border {
  margin-right: 5px;
}

.generate-button:hover {
  background-color: #e68900;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

@media (max-width: 600px) {
  .section {
    max-width: 100%;
  }

  button {
    flex: 1 1 calc(50% - 10px);
    max-width: calc(50% - 10px);
  }
}
</style>
