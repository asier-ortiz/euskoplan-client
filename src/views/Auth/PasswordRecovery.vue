<template>
  <div class="container mt-5">
    <h2>Request Password Recovery</h2>
    <form @submit.prevent="requestPasswordReset">
      <div class="mb-3">
        <label for="email" class="form-label">Email address</label>
        <input type="email" class="form-control" id="email" v-model="email" required>
      </div>
      <button type="submit" class="btn btn-primary">Send Recovery Email</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

export default defineComponent({
  setup() {
    const email = ref('');
    const authStore = useAuthStore();

    const requestPasswordReset = () => {
      authStore.requestPasswordReset(email.value);
    };

    return {
      email,
      requestPasswordReset,
    };
  },
});
</script>
