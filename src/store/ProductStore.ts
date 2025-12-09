import { create } from 'zustand';
import { Product, ProductService } from '../services/ProductService';

interface ProductState {
  recommendedProducts: Product[];
  userRoutine: Product[];
  isLoading: boolean;
  error: string | null;

  fetchRecommendations: (analysisResult: any) => Promise<void>;
  fetchUserProducts: (userId: string) => Promise<void>;
  addToRoutine: (product: Product) => void;
  removeFromRoutine: (productId: string) => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  recommendedProducts: [],
  userRoutine: [],
  isLoading: false,
  error: null,

  fetchRecommendations: async (analysisResult) => {
    set({ isLoading: true, error: null });
    try {
      const products = await ProductService.getRecommendations(analysisResult);
      set({ recommendedProducts: products, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchUserProducts: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const userProducts = await ProductService.getUserProducts(userId);
      // Extract the actual product details from the UserProduct wrapper
      const products = userProducts.map((up: any) => ({
        ...up.productId,
        userProductId: up._id,
        status: up.status,
        notes: up.notes
      }));
      set({ userRoutine: products, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addToRoutine: (product) => {
    const { userRoutine } = get();
    if (!userRoutine.find(p => p.id === product.id)) {
      set({ userRoutine: [...userRoutine, product] });
    }
  },

  removeFromRoutine: (productId) => {
    set(state => ({
      userRoutine: state.userRoutine.filter(p => p.id !== productId)
    }));
  },
}));
