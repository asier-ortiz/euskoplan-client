import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import Home from '@/views/HomeView.vue';
import Login from '@/views/Auth/LoginView.vue';
import Signup from '@/views/Auth/SignupView.vue';
import EmailVerify from '@/views/Auth/EmailVerifyView.vue';
import PasswordReset from '@/views/Auth/PasswordResetView.vue';
import PasswordRecovery from '@/views/Auth/PasswordRecoveryView.vue';
import Results from '@/views/ResultsView.vue';
import Detail from '@/views/DetailView.vue';
import Account from '@/views/AccountView.vue';
import PlanEdit from '@/views/PlanEditView.vue';
import { useAuthStore } from '@/stores/auth';

const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'Home', component: Home },
  { path: '/auth/login', name: 'Login', component: Login },
  { path: '/auth/signup', name: 'Signup', component: Signup },
  { path: '/auth/email-verify', name: 'EmailVerify', component: EmailVerify },
  { path: '/auth/password-reset', name: 'PasswordReset', component: PasswordReset },
  { path: '/auth/password-recovery', name: 'PasswordRecovery', component: PasswordRecovery },
  { path: '/results', name: 'Results', component: Results },
  { path: '/detail/:id', name: 'Detail', component: Detail },
  { path: '/account', name: 'Account', component: Account },
  { path: '/plan-edit/:id', name: 'PlanEdit', component: PlanEdit },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Add navigation guard
// TODO: Mirar esto que no va muy bien
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.name === 'Login' && authStore.isLoggedIn()) {
    next({ path: '/' });
  } else {
    next();
  }
});

export default router;
