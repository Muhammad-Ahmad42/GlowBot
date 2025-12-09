import { create } from 'zustand';
import { DietService, DietPlan, DietMeal } from '../services/DietService';

// Centralized meal type configuration for colors and icons
export const MEAL_TYPE_CONFIG: Record<string, { color: string; icon: string }> = {
  Breakfast: { color: '#FFB347', icon: 'food-croissant' },
  Lunch: { color: '#77DD77', icon: 'food' },
  Dinner: { color: '#AEC6CF', icon: 'food-variant' },
  Snack: { color: '#FDFD96', icon: 'food-apple' },
  Default: { color: '#E0E0E0', icon: 'food' },
};

// Centralized diet items configuration for food items (Dashboard DietTipSection)
export const DIET_ITEMS_CONFIG: Record<string, { icon: string; color: string }> = {
  // Fruits
  Lemon: { icon: 'fruit-citrus', color: '#FDD835' },
  Orange: { icon: 'fruit-citrus', color: '#FF9800' },
  Kiwi: { icon: 'leaf', color: '#8BC34A' },
  Apple: { icon: 'food-apple', color: '#E53935' },
  Berries: { icon: 'fruit-grapes', color: '#9C27B0' },
  Watermelon: { icon: 'fruit-watermelon', color: '#EF5350' },
  Mango: { icon: 'fruit-citrus', color: '#FFB300' },
  Papaya: { icon: 'fruit-citrus', color: '#FF7043' },
  Banana: { icon: 'fruit-citrus', color: '#FFEB3B' },
  Grapes: { icon: 'fruit-grapes', color: '#7B1FA2' },
  Avocado: { icon: 'fruit-citrus', color: '#689F38' },
  // Vegetables
  Spinach: { icon: 'leaf', color: '#43A047' },
  Cucumber: { icon: 'food', color: '#66BB6A' },
  Carrot: { icon: 'carrot', color: '#FF7043' },
  Broccoli: { icon: 'flower', color: '#4CAF50' },
  Tomato: { icon: 'food-apple', color: '#F44336' },
  Kale: { icon: 'leaf', color: '#2E7D32' },
  // Proteins
  Salmon: { icon: 'fish', color: '#FF8A65' },
  Eggs: { icon: 'egg', color: '#FFE082' },
  Chicken: { icon: 'food-drumstick', color: '#BCAAA4' },
  Almonds: { icon: 'peanut', color: '#A1887F' },
  Walnuts: { icon: 'peanut', color: '#8D6E63' },
  // Hydration
  Water: { icon: 'water', color: '#29B6F6' },
  'Green Tea': { icon: 'tea', color: '#81C784' },
  // Default
  Default: { icon: 'food', color: '#9E9E9E' },
};

// Centralized category configuration for diet tips
export const CATEGORY_CONFIG: Record<string, string> = {
  Nutrition: 'carrot',
  Health: 'heart-pulse',
  Lifestyle: 'run',
  Hydration: 'water',
  General: 'food-apple',
};

// Get config for a diet item
export const getDietItemConfig = (itemName: string): { icon: string; color: string } => {
  return DIET_ITEMS_CONFIG[itemName] || DIET_ITEMS_CONFIG.Default;
};

// Get color for a meal type
export const getMealColor = (mealType: string): string => {
  const config = MEAL_TYPE_CONFIG[mealType] || MEAL_TYPE_CONFIG.Default;
  return config.color;
};

// Get icon for a meal type
export const getMealIcon = (mealType: string): string => {
  const config = MEAL_TYPE_CONFIG[mealType] || MEAL_TYPE_CONFIG.Default;
  return config.icon;
};

// Normalize meals by assigning default colors and icons if missing
const normalizeMeals = (meals: DietMeal[]): DietMeal[] => {
  return meals.map(meal => ({
    ...meal,
    color: meal.color || getMealColor(meal.type),
    icon: meal.icon || getMealIcon(meal.type),
  }));
};

// Normalize a diet plan by applying normalizeMeals
const normalizePlan = (plan: DietPlan): DietPlan => ({
  ...plan,
  meals: normalizeMeals(plan.meals),
});

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
      const rawPlans = await DietService.fetchDietPlans(userId);
      const plans = rawPlans.map(normalizePlan);
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
      const rawPlan = await DietService.createDietPlan(plan);
      const newPlan = normalizePlan(rawPlan);
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
      const rawPlan = await DietService.updateDietPlan(planId, updates);
      const updatedPlan = normalizePlan(rawPlan);
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
      
      const rawPlan = await DietService.updateDietPlan(planId, { meals: updatedMeals });
      const updatedPlan = normalizePlan(rawPlan);
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
