<template>
  <div class="container mt-5">
    <h2>Login</h2>
    <form @submit.prevent="onSubmit">
      <div class="mb-3">
        <label for="email" class="form-label">Email address</label>
        <input
          type="email"
          class="form-control"
          id="email"
          v-model="email"
          @blur="touched.email = true"
          :class="{ 'is-invalid': touched.email && errors.email }"
        />
        <div class="invalid-feedback" v-if="touched.email && errors.email">{{ errors.email }}</div>
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input
          type="password"
          class="form-control"
          id="password"
          v-model="password"
          @blur="touched.password = true"
          :class="{ 'is-invalid': touched.password && errors.password }"
        />
        <div class="invalid-feedback" v-if="touched.password && errors.password">{{ errors.password }}</div>
      </div>
      <button type="submit" class="btn btn-primary">Login</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import Swal from 'sweetalert2';
import * as yup from 'yup';
import { useForm } from 'vee-validate';
import router from '@/router';

const authStore = useAuthStore();

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const { handleSubmit, errors, validate } = useForm({
  validationSchema: schema,
});

const email = ref('');
const password = ref('');
const touched = ref({
  email: false,
  password: false,
});

const onSubmit = async () => {
  try {
    await validate(); // Realiza la validación antes de enviar
    const values = { email: email.value, password: password.value };
    console.log('Submitting:', values); // Log para depuración
    await authStore.login(values);
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: 'Login successful!',
    }).then(() => {
      router.push('/');
    });
  } catch (error) {
    if (error.message === 'Invalid credentials') {
      Swal.fire({
        icon: 'error',
        title: 'Login failed',
        text: 'Invalid email or password. Please try again.',
      });
    } else {
      console.error('Unexpected error:', error);
    }
  }
};
</script>

<style scoped>
.is-invalid {
  border-color: #dc3545;
}

.invalid-feedback {
  display: block;
}
</style>
