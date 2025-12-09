import { create } from 'zustand';
import { Expert, ExpertService } from '../services/ExpertService';

interface ExpertState {
  experts: Expert[];
  isLoading: boolean;
  error: string | null;

  fetchExperts: () => Promise<void>;
}

export const useExpertStore = create<ExpertState>((set) => ({
  experts: [],
  isLoading: false,
  error: null,

  fetchExperts: async () => {
    set({ isLoading: true, error: null });
    try {
      const experts = await ExpertService.getExperts();
      set({ experts, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
