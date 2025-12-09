import { ENDPOINTS } from '../res/api';

export interface Expert {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  available: boolean;
  fee: string;
  description: string;
}

export const ExpertService = {
  getExperts: async (): Promise<Expert[]> => {
    try {
      const response = await fetch(ENDPOINTS.EXPERTS);
      if (!response.ok) throw new Error('Failed to fetch experts');
      return await response.json();
    } catch (error) {
      console.error('Error fetching experts:', error);
      throw error;
    }
  }
};
