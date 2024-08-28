import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import Home from '@/views/HomeView.vue';
import Login from '@/views/Auth/LoginView.vue';
import Signup from '@/views/Auth/SignupView.vue';
import EmailVerify from '@/views/Auth/EmailVerifyView.vue';
import PasswordReset from '@/views/Auth/PasswordResetView.vue';
import PasswordRecovery from '@/views/Auth/PasswordRecoveryView.vue';
import Detail from '@/views/DetailView.vue';
import Account from '@/views/AccountView.vue';
import Landing from '@/views/LandingView.vue';
import Plans from '@/views/PlanListView.vue';
import PlanGenerate from '@/views/PlanGenerateView.vue'
import { useAuthStore } from '@/stores/auth';
import { useScrollStore } from '@/stores/scroll';
import { useMapStore } from '@/stores/map';
import { useCollectionsStore } from '@/stores/collections';
import { useFilterStore } from '@/stores/filter';

const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'Home', component: Home },
  { path: '/landing', name: 'Landing', component: Landing },

  { path: '/plans', name: 'Plans', component: Plans },
  { path: '/plan-generate', name: 'PlanGenerate', component: PlanGenerate, meta: { requiresAuth: true }  },

  { path: '/auth/login', name: 'Login', component: Login },
  { path: '/auth/signup', name: 'Signup', component: Signup },
  { path: '/auth/email-verify', name: 'EmailVerify', component: EmailVerify },
  { path: '/auth/password-reset', name: 'PasswordReset', component: PasswordReset },
  { path: '/auth/password-recovery', name: 'PasswordRecovery', component: PasswordRecovery },

  { path: '/detail/:category/:id', name: 'Detail', component: Detail },
  { path: '/account', name: 'Account', component: Account, meta: { requiresAuth: true } },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    const scrollStore = useScrollStore();

    if (savedPosition) {
      return savedPosition;
    }

    if (to.name === 'Home' && from.name === 'Detail') {
      // Restore the saved scroll position when returning to Home from Detail
      return { left: 0, top: scrollStore.getScrollPosition() };
    }

    // For all other routes, scroll to top
    return { top: 0 };
  },
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const scrollStore = useScrollStore();
  const mapStore = useMapStore();

  // Save the scroll position when leaving the home view
  if (from.name === 'Home') {
    scrollStore.setScrollPosition(window.scrollY);
  }

  // Handle map state when navigating away from or to Detail
  if (from.name === 'Detail' && to.name === 'Home') {
    mapStore.setReturningFromDetail(true);
  } else {
    mapStore.resetReturningFromDetail();
  }

  // Initiate fetch on first load of HomeView, but do not block rendering
  if (to.name === 'Home' && !from.name) {
    const collectionsStore = useCollectionsStore();
    const filterStore = useFilterStore();
    collectionsStore.fetchResults(collectionsStore.selectedCategory, collectionsStore.searchQuery, filterStore.getFilters());
  }

  // Redirect to login if the route requires auth and the user isn't logged in
  if (to.matched.some((record) => record.meta.requiresAuth) && !authStore.isLoggedIn()) {
    return next({ name: 'Login' });
  }

  // Continue navigation if no conditions match
  next();
});

export default router;
