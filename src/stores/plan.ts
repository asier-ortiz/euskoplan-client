import { defineStore } from 'pinia';
import axios from 'axios';
import config from '../config';

import type { PlanModel } from '@/models/plan.model';
import type { StepModel } from '@/models/step.model';

axios.defaults.baseURL = config.apiBaseUrl;

export const usePlanStore = defineStore('plan', {
  state: () => ({
    plans: [] as PlanModel[],
    userPlans: [] as PlanModel[],
    currentPlan: null as PlanModel | null,
    loading: false,
  }),

  actions: {
    async fetchPlans(filters: any = {}) {
      this.loading = true;
      try {
        const response = await axios.get('/plan', { params: filters });
        this.plans = response.data;
      } catch (error) {
        console.error('Error fetching plans:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchUserPlans() {
      this.loading = true;
      try {
        const response = await axios.get('/plan/results/user');
        this.userPlans = response.data;
      } catch (error) {
        console.error('Error fetching user plans:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchPlanById(id: number) {
      this.loading = true;
      try {
        const response = await axios.get(`/plan/${id}`);
        this.currentPlan = response.data;
      } catch (error) {
        console.error('Error fetching plan by ID:', error);
      } finally {
        this.loading = false;
      }
    },

    async createPlan(planData: Partial<PlanModel>) {
      this.loading = true;
      try {
        const response = await axios.post('/plan', planData);
        this.plans.push(response.data);
        this.userPlans.push(response.data); // Asegúrate de agregar el nuevo plan a userPlans
        return response.data;
      } catch (error) {
        console.error('Error creating plan:', error);
      } finally {
        this.loading = false;
      }
    },

    async updatePlan(id: number, planData: Partial<PlanModel>) {
      this.loading = true;
      try {
        const response = await axios.put(`/plan/${id}`, planData);
        const index = this.plans.findIndex(plan => plan.id === id);
        if (index !== -1) {
          this.plans[index] = response.data;
        }
        return response.data;
      } catch (error) {
        console.error('Error updating plan:', error);
      } finally {
        this.loading = false;
      }
    },

    async deletePlan(id: number) {
      this.loading = true;
      try {
        await axios.delete(`/plan/${id}`);
        this.plans = this.plans.filter(plan => plan.id !== id);
      } catch (error) {
        console.error('Error deleting plan:', error);
      } finally {
        this.loading = false;
      }
    },

    async upvotePlan(id: number) {
      try {
        await axios.put(`/plan/upvote/${id}`);
        const plan = this.plans.find(plan => plan.id === id);
        if (plan) {
          plan.votos += 1;
        }
      } catch (error) {
        console.error('Error upvoting plan:', error);
      }
    },

    async downvotePlan(id: number) {
      try {
        await axios.put(`/plan/downvote/${id}`);
        const plan = this.plans.find(plan => plan.id === id);
        if (plan) {
          plan.votos -= 1;
        }
      } catch (error) {
        console.error('Error downvoting plan:', error);
      }
    },

    async createStep(stepData: StepModel, planId: number) {
      this.loading = true;
      try {
        const response = await axios.post(`/step/${planId}`, { ...stepData });
        if (this.currentPlan && this.currentPlan.id === planId && this.currentPlan.pasos) {
          this.currentPlan.pasos.push(response.data);
        }
      } catch (error) {
        console.error('Error creating step:', error);
      } finally {
        this.loading = false;
      }
    },

    async updateStep(stepId: number, stepData: Partial<StepModel>) {
      this.loading = true;
      try {
        const response = await axios.put(`/step/${stepId}`, stepData);
        if (this.currentPlan && this.currentPlan.pasos) {
          const stepIndex = this.currentPlan.pasos.findIndex(step => step.id === stepId);
          if (stepIndex !== -1) {
            this.currentPlan.pasos[stepIndex] = response.data;
          }
        }
      } catch (error) {
        console.error('Error updating step:', error);
      } finally {
        this.loading = false;
      }
    },

    async deleteStep(stepId: number, planId: number) {
      this.loading = true;
      try {
        await axios.delete(`/step/${stepId}`);
        if (this.currentPlan && this.currentPlan.id === planId && this.currentPlan.pasos) {
          this.currentPlan.pasos = this.currentPlan.pasos.filter(step => step.id !== stepId);
        }
      } catch (error) {
        console.error('Error deleting step:', error);
      } finally {
        this.loading = false;
      }
    },
  },
});
