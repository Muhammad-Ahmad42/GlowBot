import { ENDPOINTS } from '../res/api';

export interface Product {
  id: string;
  name: string;
  description: string;
  rating: number;
  reviews: number;
  category: string;
  price?: string;
  image?: string;
}

export const ProductService = {
  getRecommendations: async (analysisResult: any): Promise<Product[]> => {
    try {
      const response = await fetch(ENDPOINTS.RECOMMENDATIONS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(analysisResult),
      });
      if (!response.ok) throw new Error('Failed to fetch recommendations');
      return await response.json();
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw error;
    }
  },

  getRoutine: async (): Promise<Product[]> => {
    return []; 
  },

  getUserProducts: async (userId: string): Promise<any[]> => {
    try {
      const response = await fetch(`${ENDPOINTS.USER_PRODUCTS}?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch user products');
      return await response.json();
    } catch (error) {
      console.error('Error fetching user products:', error);
      throw error;
    }
  }
};
