// import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
//
// const router = createRouter({
//   history: createWebHistory(import.meta.env.BASE_URL),
//   routes: [
//     {
//       path: '/',
//       name: 'home',
//       component: HomeView
//     },
//     {
//       path: '/about',
//       name: 'about',
//       // route level code-splitting
//       // this generates a separate chunk (About.[hash].js) for this route
//       // which is lazy-loaded when the route is visited.
//       component: () => import('../views/AboutView.vue')
//     }
//   ]
// })
//
// export default router

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
  { path: '/login', name: 'Login', component: Login },
  { path: '/signup', name: 'Signup', component: Signup },
  { path: '/email-verify', name: 'EmailVerify', component: EmailVerify },
  { path: '/password-reset', name: 'PasswordReset', component: PasswordReset },
  { path: '/password-recovery', name: 'PasswordRecovery', component: PasswordRecovery },
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
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.name === 'Login' && authStore.isLoggedIn()) {
    next({ path: '/' });
  } else {
    next();
  }
});

export default router;



