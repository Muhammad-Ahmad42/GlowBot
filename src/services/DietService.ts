import { BASE_URL } from '../res/api';

export interface DietMeal {
  type: string;
  time: string;
  name: string;
  calories: string;
  details: string;
}

export interface DietTip {
  title: string;
  mainTip: string;
  description: string;
  category: string;
  items: string[];
}

export interface DietPlan {
  _id?: string;
  userId: string;
  title: string;
  description: string;
  tip: DietTip;
  meals: DietMeal[];
  foodCategories?: {
    icon: string;
    title: string;
    items: string;
    color: string;
  }[];
  createdAt?: Date;
}

export const DietService = {
  // Fetch all diet plans for a user
  async fetchDietPlans(userId: string): Promise<DietPlan[]> {
    try {
      const response = await fetch(`${BASE_URL}/diet-plan?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch diet plans');
      const data = await response.json();
      console.log("DietService fetched plans:", JSON.stringify(data, null, 2));
      return data;
    } catch (error) {
      console.error('Error fetching diet plans:', error);
      throw error;
    }
  },

  // Create a new diet plan
  async createDietPlan(plan: Omit<DietPlan, '_id' | 'createdAt'>): Promise<DietPlan> {
    try {
      const response = await fetch(`${BASE_URL}/diet-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plan),
      });
      if (!response.ok) throw new Error('Failed to create diet plan');
      return await response.json();
    } catch (error) {
      console.error('Error creating diet plan:', error);
      throw error;
    }
  },

  // Update an existing diet plan
  async updateDietPlan(planId: string, updates: Partial<DietPlan>): Promise<DietPlan> {
    try {
      const response = await fetch(`${BASE_URL}/diet-plan/${planId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update diet plan');
      return await response.json();
    } catch (error) {
      console.error('Error updating diet plan:', error);
      throw error;
    }
  },

  // Delete a diet plan
  async deleteDietPlan(planId: string): Promise<void> {
    try {
      const response = await fetch(`${BASE_URL}/diet-plan/${planId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete diet plan');
    } catch (error) {
      console.error('Error deleting diet plan:', error);
      throw error;
    }
  },

  // Update a specific meal in a plan
  async updateMeal(planId: string, mealIndex: number, meal: DietMeal): Promise<DietPlan> {
    try {
      const response = await fetch(`${BASE_URL}/diet-plan/${planId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [`meals.${mealIndex}`]: meal }),
      });
      if (!response.ok) throw new Error('Failed to update meal');
      return await response.json();
    } catch (error) {
      console.error('Error updating meal:', error);
      throw error;
    }
  },
};
