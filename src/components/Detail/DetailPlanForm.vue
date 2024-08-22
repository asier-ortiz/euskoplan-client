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
              Crear un Nuevo Plan
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
                  v-model="title"
                  @input="validateTitle"
                  @blur="onBlurTitle"
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
                  v-model="description"
                  :maxlength="500"
                  placeholder="Describe brevemente el plan"
                ></textarea>
                <div class="char-counter">{{ description.length }}/500</div>
              </div>

              <div class="form-group switch-container">
                <div class="switch-row">
                  <label for="publicoSwitch">Plan {{ publicLabel }}</label>
                  <label class="switch">
                    <input
                      type="checkbox"
                      id="publicoSwitch"
                      v-model="newPlan.publico"
                      @change="togglePublicPrivateLabel"
                    />
                    <span class="slider round"></span>
                  </label>
                </div>
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
                  :disabled="!isFormValid || loading"
                >
                  <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
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
                  :disabled="!selectedPlan || loading"
                  @click="addToSelectedPlan"
                >
                  <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
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
import Swal from 'sweetalert2';

const emit = defineEmits(['close']);
const props = defineProps({
  showModal: Boolean,
  idRecurso: {
    type: Number,
    required: true,
  },
  coleccion: {
    type: String,
    required: true,
  },
});

const activeTab = ref<'new' | 'existing'>('new');
const title = ref('');
const description = ref('');
const filterTerm = ref('');
const publicLabel = ref('Privado');
const loadingPlans = ref(true);
const selectedPlan = ref(null);
const loading = ref(false);  // Track loading state

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
      id_recurso: props.idRecurso,
      tipo_recurso: props.coleccion,
    },
  ],
});

const errors = ref<{ titulo?: string }>({});
const isTouched = ref(false);

const schema = yup.object({
  titulo: yup
    .string()
    .required('El título es obligatorio')
    .min(5, 'El título debe tener al menos 5 caracteres'),
});

const onBlurTitle = () => {
  isTouched.value = true;
  validateTitle();
};

const validateTitle = () => {
  if (!isTouched.value) {
    return;
  }

  if (title.value === '') {
    errors.value.titulo = 'El título es obligatorio';
  } else if (title.value.length < 5) {
    errors.value.titulo = 'El título debe tener al menos 5 caracteres';
  } else {
    errors.value.titulo = undefined;
  }
};

const toggleTab = (tab: 'new' | 'existing') => {
  activeTab.value = tab;
};

const togglePublicPrivateLabel = () => {
  publicLabel.value = newPlan.value.publico ? 'Público' : 'Privado';
};

const isFormValid = computed(() => {
  return title.value.length >= 5 && !errors.value.titulo;
});

const onSubmit = async () => {
  try {
    validateTitle();

    if (errors.value.titulo) {
      throw new Error('Validation failed');
    }

    loading.value = true;  // Start loading

    // Construct the payload for creating a new plan
    const newPlanPayload = {
      idioma: 'es',
      titulo: title.value,
      descripcion: description.value || null,
      publico: newPlan.value.publico,
      pasos: [
        {
          indice: 0,
          indicaciones: null,
          id_recurso: props.idRecurso,
          tipo_recurso: props.coleccion,
        },
      ],
    };

    await planStore.createPlan(newPlanPayload);

    // Reset form fields
    title.value = '';
    description.value = '';
    newPlan.value.publico = false;
    togglePublicPrivateLabel();

    // Reset errors after successful submission
    errors.value = {};
    isTouched.value = false;

    // Refresh user plans
    await planStore.fetchUserPlans();

    emit('close');

    await Swal.fire('Success', '¡Plan creado con éxito!', 'success');
  } catch (error) {
    await Swal.fire('Error', 'Error al crear el plan.', 'error');
  } finally {
    loading.value = false;  // Stop loading after submission
  }
};

const selectPlan = (plan: any) => {
  if (selectedPlan.value && selectedPlan.value.id === plan.id) {
    selectedPlan.value = null;
  } else {
    selectedPlan.value = plan;
  }
};

const addToSelectedPlan = async () => {
  if (!selectedPlan.value) return;

  const lastIndex = selectedPlan.value.pasos.length;
  const stepData = {
    indice: lastIndex,
    indicaciones: "",
    id_recurso: newPlan.value.pasos[0].id_recurso,
    tipo_recurso: newPlan.value.pasos[0].tipo_recurso,
  };

  try {
    loading.value = true;  // Start loading

    await planStore.createStep(stepData, selectedPlan.value.id);

    // Clear the form inputs and the selected plan
    title.value = '';
    description.value = '';
    newPlan.value.publico = false;
    selectedPlan.value = null;  // Clear the selected plan after submission
    togglePublicPrivateLabel();

    // Reset errors after adding to an existing plan
    errors.value = {};
    isTouched.value = false;

    emit('close');

    Swal.fire('Success', '¡Recurso añadido al plan con éxito!', 'success');
  } catch (error) {
    Swal.fire('Error', 'Error al añadir el paso al plan.', 'error');
  } finally {
    loading.value = false;  // Stop loading after submission
  }
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
  min-height: 400px;
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
  font-weight: bold;
}

.modal-header button.active {
  border-bottom: 2px solid #007bff;
}

.close-btn {
  position: absolute;
  top: 5px;
  right: 0px;
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
  min-height: 300px;
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
  flex-direction: column;
  background-color: #f0f8ff;
  padding: 10px;
  border-radius: 8px;
}

.switch-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px; /* Space between the row and the description */
}

.switch-description {
  font-size: 0.8rem;
  color: #666;
  margin-left: 0;
  margin-top: 5px;
  display: block;
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
  height: 200px;
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

@media (max-width: 400px) {
  .switch-container {
    gap: 5px;
    padding: 5px;
  }

  .switch-description {
    font-size: 0.75rem;
  }

  .switch {
    width: 30px;
    height: 15px;
  }

  .slider:before {
    height: 11px;
    width: 11px;
    left: 2px;
    bottom: 2px;
  }

  input:checked + .slider:before {
    transform: translateX(15px);
  }
}
</style>
