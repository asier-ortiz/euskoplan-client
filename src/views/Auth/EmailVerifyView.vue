<template>
  <div class="container mt-5">
    <h2>Email Verification</h2>
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p>Verifying your email...</p>
    </div>
    <div v-else>
      <p v-if="error">{{ error }}</p>
      <p v-else-if="success">{{ success }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const loading = ref(true);
const success = ref<string | null>(null);
const error = ref<string | null>(null);

onMounted(async () => {
  const token = route.query.token as string;
  if (!token) {
    error.value = 'Invalid token';
    loading.value = false;
    return;
  }

  try {
    await authStore.verifyEmail(token);
    success.value = 'Your email has been verified. You will be redirected to the home page.';
    setTimeout(() => {
      router.push('/');
    }, 3000);
  } catch (err) {
    error.value = 'There was an error verifying your email. A new verification email has been sent to you.';
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.spinner-border {
  margin-bottom: 20px;
}
</style>
