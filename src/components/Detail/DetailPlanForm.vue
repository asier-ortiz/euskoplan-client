<template>
  <div class="modal-overlay" v-if="showModal">
    <div class="modal-container">
      <div class="modal-header">
        <button @click="toggleTab('new')" :class="{ active: activeTab === 'new' }">Crear Nuevo Plan</button>
        <button @click="toggleTab('existing')" :class="{ active: activeTab === 'existing' }">Añadir a Plan Existente</button>
        <button class="close-button" @click="emit('close')">&times;</button>
      </div>

      <div class="modal-body">
        <form v-if="activeTab === 'new'" @submit.prevent="createNewPlan">
          <div class="form-group">
            <label for="titulo">Título del Plan</label>
            <input type="text" id="titulo" v-model="newPlan.titulo" required />
          </div>

          <div class="form-group">
            <label for="descripcion">Descripción (Opcional)</label>
            <textarea id="descripcion" v-model="newPlan.descripcion"></textarea>
          </div>

          <div class="form-group">
            <label for="publico">Público</label>
            <input type="checkbox" id="publico" v-model="newPlan.publico" />
          </div>

          <button type="submit" class="submit-button">Crear Plan</button>
        </form>

        <div v-if="activeTab === 'existing'">
          <input type="text" placeholder="Filtrar planes por título" v-model="filterTerm" />
          <ul class="plan-list">
            <li v-for="plan in filteredPlans" :key="plan.id" @click="addToExistingPlan(plan)">
              {{ plan.titulo }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { usePlanStore } from '@/stores/plan';
import { useAuthStore } from '@/stores/auth';
import { useCollectionsStore } from '@/stores/collections';
import Swal from 'sweetalert2';

const emit = defineEmits(['close']);

const props = defineProps({
  showModal: Boolean,
});

const activeTab = ref<'new' | 'existing'>('new');
const newPlan = ref({ titulo: '', descripcion: '', publico: false });
const filterTerm = ref('');
const planStore = usePlanStore();
const authStore = useAuthStore();
const collectionsStore = useCollectionsStore();

const currentDetail = computed(() => collectionsStore.currentDetail);

const filteredPlans = computed(() => {
  if (!filterTerm.value) return planStore.userPlans;
  return planStore.userPlans.filter(plan =>
    plan.titulo.toLowerCase().includes(filterTerm.value.toLowerCase())
  );
});

const toggleTab = (tab: 'new' | 'existing') => {
  activeTab.value = tab;
};

const createNewPlan = async () => {
  if (!currentDetail.value) {
    Swal.fire('Error', 'No se pudo obtener el recurso actual.', 'error');
    return;
  }

  const planData = {
    ...newPlan.value,
    idioma: 'es',
    pasos: [
      {
        indice: 0,
        indicaciones: '',
        id_recurso: currentDetail.value.id,
        tipo_recurso: currentDetail.value.tipo_recurso
      }
    ]
  };

  await planStore.createPlan(planData);
  Swal.fire('¡Plan creado!', 'El plan se ha creado exitosamente.', 'success');
  emit('close');
};

const addToExistingPlan = async (plan: any) => {
  if (!currentDetail.value) {
    Swal.fire('Error', 'No se pudo obtener el recurso actual.', 'error');
    return;
  }

  const lastIndex = plan.pasos.length;
  const stepData = {
    indice: lastIndex,
    indicaciones: null,
    id_recurso: currentDetail.value.id,
    tipo_recurso: currentDetail.value.tipo_recurso
  };

  await planStore.createStep(stepData, plan.id);
  Swal.fire('¡Recurso añadido!', 'El recurso se ha añadido al plan.', 'success');
  emit('close');
};

onMounted(async () => {
  if (authStore.isLoggedIn()) {
    await planStore.fetchUserPlans();
  }
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-sizing: border-box;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-header button {
  padding: 10px;
  border: none;
  background-color: transparent;
  cursor: pointer;
}

.modal-header button.active {
  border-bottom: 2px solid #007bff;
}

.close-button {
  background-color: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.submit-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.plan-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.plan-list li {
  padding: 10px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
}

.plan-list li:hover {
  background-color: #f1f1f1;
}
</style>
