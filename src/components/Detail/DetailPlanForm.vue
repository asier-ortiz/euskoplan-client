<template>
  <div class="modal-overlay" v-if="showModal">
    <div class="modal-container">
      <LoadingSpinner v-if="loadingPlans" :visible="loadingPlans" />

      <transition name="fade">
        <div v-show="!loadingPlans" class="modal-content">
          <button class="close-btn" @click="$emit('close')">×</button>

          <div class="modal-header">
            <button
              :class="{ active: activeTab === 'new' }"
              @click="toggleTab('new')"
            >
              Crear Nuevo Plan
            </button>
            <button
              :class="{ active: activeTab === 'existing' }"
              @click="toggleTab('existing')"
            >
              Añadir a Plan Existente
            </button>
          </div>

          <div class="modal-body">
            <form
              v-if="activeTab === 'new'"
              @submit.prevent="onSubmit"
              class="fade-in"
            >
              <div class="form-group">
                <label for="titulo">Título del Plan</label>
                <input
                  type="text"
                  id="titulo"
                  v-model="titulo"
                  :class="{ 'is-invalid': errors.titulo }"
                  placeholder="Introduce el título del plan"
                />
                <div v-if="errors.titulo" class="error-message">
                  {{ errors.titulo }}
                </div>
              </div>

              <div class="form-group">
                <label for="descripcion">Descripción (Opcional)</label>
                <textarea
                  id="descripcion"
                  v-model="descripcion"
                  :maxlength="500"
                  :class="{ 'is-invalid': errors.descripcion }"
                  placeholder="Describe brevemente el plan"
                ></textarea>
                <div class="char-counter">{{ descripcion.length }}/500</div>
              </div>

              <div class="form-group switch-container">
                <label for="publicoSwitch">Plan {{ publicoLabel }}</label>
                <label class="switch">
                  <input
                    type="checkbox"
                    id="publicoSwitch"
                    v-model="newPlan.publico"
                    @change="togglePublicoLabel"
                  />
                  <span class="slider round"></span>
                </label>
                <span class="switch-description">
                  {{ newPlan.publico
                  ? 'Cualquier persona podrá ver este plan.'
                  : 'Solo tú podrás ver este plan.' }}
                </span>
              </div>

              <div class="form-actions">
                <button
                  type="submit"
                  class="submit-button"
                  :disabled="!isFormValid"
                >
                  Crear Plan
                </button>
              </div>
            </form>

            <div v-if="activeTab === 'existing'" class="fade-in">
              <div class="form-group">
                <label for="filterTerm">Filtrar planes por título</label>
                <input
                  type="text"
                  id="filterTerm"
                  v-model="filterTerm"
                  placeholder="Buscar..."
                />
              </div>

              <div class="plan-list-container">
                <ul class="plan-list">
                  <li
                    v-for="plan in filteredPlans"
                    :key="plan.id"
                    :class="{ selected: selectedPlan && selectedPlan.id === plan.id }"
                    @click="selectPlan(plan)"
                  >
                    {{ plan.titulo }}
                  </li>
                  <li v-if="filteredPlans.length === 0">
                    No tienes planes disponibles
                  </li>
                </ul>
              </div>

              <div class="form-actions">
                <button
                  class="submit-button"
                  :disabled="!selectedPlan"
                  @click="addToSelectedPlan"
                >
                  Añadir a Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import * as yup from 'yup';
import { usePlanStore } from '@/stores/plan';
import LoadingSpinner from '@/components/Misc/LoadingSpinner.vue';

const emit = defineEmits(['close']);
const props = defineProps({
  showModal: Boolean,
});

const activeTab = ref<'new' | 'existing'>('new');
const titulo = ref('');
const descripcion = ref('');
const filterTerm = ref('');
const publicoLabel = ref('Privado');
const loadingPlans = ref(true);
const selectedPlan = ref(null);

const planStore = usePlanStore();

const newPlan = ref({
  titulo: '',
  descripcion: '',
  publico: false,
  idioma: 'es',
  pasos: [
    {
      indice: 0,
      indicaciones: null,
      id_recurso: 1,
      tipo_recurso: 'cave',
    },
  ],
});

const schema = yup.object({
  titulo: yup.string().required('El título es obligatorio'),
});

const errors = ref<{ titulo?: string }>({});

const toggleTab = (tab: 'new' | 'existing') => {
  activeTab.value = tab;
};

const togglePublicoLabel = () => {
  publicoLabel.value = newPlan.value.publico ? 'Público' : 'Privado';
};

const isFormValid = computed(() => {
  return titulo.value !== '' && !errors.value.titulo;
});

const onSubmit = async () => {
  try {
    await schema.validateSync({ titulo: titulo.value }, { abortEarly: false });

    errors.value = {};
    newPlan.value.titulo = titulo.value;
    newPlan.value.descripcion = descripcion.value;

    await planStore.createPlan(newPlan.value);
    emit('close');
  } catch (validationErrors: any) {
    validationErrors.inner.forEach((error: any) => {
      errors.value[error.path] = error.message;
    });
  }
};

const selectPlan = (plan: any) => {
  selectedPlan.value = plan;
};

const addToSelectedPlan = async () => {
  if (!selectedPlan.value) return;

  const lastIndex = selectedPlan.value.pasos.length;
  const stepData = {
    indice: lastIndex,
    indicaciones: null,
    id_recurso: newPlan.value.pasos[0].id_recurso,
    tipo_recurso: newPlan.value.pasos[0].tipo_recurso,
  };

  await planStore.createStep(stepData, selectedPlan.value.id);
  emit('close');
};

const filteredPlans = computed(() => {
  if (!filterTerm.value) {
    return planStore.userPlans;
  }
  return planStore.userPlans.filter((plan) =>
    plan.titulo.toLowerCase().includes(filterTerm.value.toLowerCase())
  );
});

onMounted(async () => {
  await planStore.fetchUserPlans();
  loadingPlans.value = false;
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
  position: relative;
  animation: slide-down 0.3s ease-out;
  min-height: 400px; /* Tamaño mínimo para evitar cambios de tamaño */
}

@keyframes slide-down {
  0% {
    transform: translateY(-50px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  padding-top: 50px;
}

.modal-header button {
  flex: 1;
  padding: 10px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  transition: background-color 0.3s;
}

.modal-header button.active {
  border-bottom: 2px solid #007bff;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  font-size: 1.2rem;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 10;
}

.close-btn:hover {
  background-color: #0056b3;
}

.modal-body {
  display: flex;
  flex-direction: column;
  min-height: 300px; /* Altura mínima para evitar cambios de tamaño */
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

.form-group input.is-invalid,
.form-group textarea.is-invalid {
  border-color: #dc3545;
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 5px;
}

.char-counter {
  font-size: 0.875rem;
  color: #555;
  text-align: right;
  margin-top: 5px;
}

.switch-container {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: #f0f8ff;
  padding: 10px;
  border-radius: 8px;
}

.switch-container label {
  margin: 0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
}

.submit-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #0056b3;
}

.submit-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.plan-list-container {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
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
  transition: background-color 0.2s;
}

.plan-list li.selected,
.plan-list li:hover {
  background-color: #f0f8ff;
}

.fade-in {
  animation: fade-in 0.5s ease-in-out;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: '';
  height: 14px;
  width: 14px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #007bff;
}

input:checked + .slider:before {
  transform: translateX(20px);
}

.switch-label {
  font-size: 0.9rem;
  color: #333;
}

.switch-description {
  font-size: 0.8rem;
  color: #666;
  margin-left: 10px;
}
</style>
