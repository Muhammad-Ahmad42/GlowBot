import { create } from 'zustand';
import { DietService, DietPlan, DietMeal } from '../services/DietService';

interface DietState {
  plans: DietPlan[];
  activePlan: DietPlan | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchPlans: (userId: string) => Promise<void>;
  createPlan: (plan: Omit<DietPlan, '_id' | 'createdAt'>) => Promise<void>;
  updatePlan: (planId: string, updates: Partial<DietPlan>) => Promise<void>;
  updateMeal: (planId: string, mealIndex: number, meal: DietMeal) => Promise<void>;
  deletePlan: (planId: string) => Promise<void>;
  setActivePlan: (plan: DietPlan | null) => void;
}

export const useDietStore = create<DietState>((set, get) => ({
  plans: [],
  activePlan: null,
  loading: false,
  error: null,

  fetchPlans: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const plans = await DietService.fetchDietPlans(userId);
      console.log("DietStore received plans:", plans);
      set({ 
        plans, 
        activePlan: plans.length > 0 ? plans[plans.length - 1] : null,
        loading: false 
      });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  createPlan: async (plan) => {
    set({ loading: true, error: null });
    try {
      const newPlan = await DietService.createDietPlan(plan);
      set((state) => ({ 
        plans: [...state.plans, newPlan],
        activePlan: newPlan,
        loading: false 
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updatePlan: async (planId, updates) => {
    set({ loading: true, error: null });
    try {
      const updatedPlan = await DietService.updateDietPlan(planId, updates);
      set((state) => ({
        plans: state.plans.map(p => p._id === planId ? updatedPlan : p),
        activePlan: state.activePlan?._id === planId ? updatedPlan : state.activePlan,
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updateMeal: async (planId, mealIndex, meal) => {
    set({ loading: true, error: null });
    try {
      const plan = get().plans.find(p => p._id === planId);
      if (!plan) throw new Error('Plan not found');
      
      const updatedMeals = [...plan.meals];
      updatedMeals[mealIndex] = meal;
      
      const updatedPlan = await DietService.updateDietPlan(planId, { meals: updatedMeals });
      set((state) => ({
        plans: state.plans.map(p => p._id === planId ? updatedPlan : p),
        activePlan: state.activePlan?._id === planId ? updatedPlan : state.activePlan,
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  deletePlan: async (planId) => {
    set({ loading: true, error: null });
    try {
      await DietService.deleteDietPlan(planId);
      set((state) => ({
        plans: state.plans.filter(p => p._id !== planId),
        activePlan: state.activePlan?._id === planId ? null : state.activePlan,
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  setActivePlan: (plan) => set({ activePlan: plan }),
}));
