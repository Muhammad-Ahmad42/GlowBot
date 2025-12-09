import { create } from "zustand";
import { scanUserImage } from "../services/ScanUserImageServic";
import { BASE_URL } from "../res/api";

interface ReportState {
  overallScore: number;
  skinAnalysis: Record<string, number>;
  recommendedProducts: {
    id: string;
    name: string;
    description: string;
    rating: number;
    reviews: number;
    category: string;
  }[];
  addedProducts: string[]; 
  scanHistory: any[];
  setOverallScore: (score: number) => void;
  setSkinAnalysis: (analysis: ReportState["skinAnalysis"]) => void;
  setRecommendedProducts: (products: ReportState["recommendedProducts"]) => void;
  setScanHistory: (history: any[]) => void;
  addProduct: (productId: string, userId?: string) => Promise<void>;
  removeProduct: (productId: string, userId?: string) => Promise<void>;
  fetchUserProducts: (userId: string) => Promise<void>;
  fetchLatestReport: (userId: string) => Promise<void>;
  fetchScanHistory: (userId: string) => Promise<void>;
  analyzeSkin: (imageUri: string, userId: string) => Promise<void>;
}

export const useReportStore = create<ReportState>((set) => ({
  overallScore: 0,
  skinAnalysis: {
    Acne: 0,
    Pigmentation: 0,
    Dullness: 0,
    Stress: 0,
    Hydration: 0,
  },
  recommendedProducts: [],
  scanHistory: [],
  setOverallScore: (overallScore) => set({ overallScore }),
  setSkinAnalysis: (skinAnalysis) => set({ skinAnalysis }),
  setRecommendedProducts: (recommendedProducts) => set({ recommendedProducts }),
  setScanHistory: (scanHistory) => set({ scanHistory }),
  addedProducts: [],
  addProduct: async (productId, userId = 'anonymous') => {
    try {
      const response = await fetch(`${BASE_URL}/user-products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId }),
      });
      
      if (response.ok) {
        set((state) => {
          if (!state.addedProducts.includes(productId)) {
            return { addedProducts: [...state.addedProducts, productId] };
          }
          return state;
        });
      }
    } catch (error) {
      console.error('Failed to add product:', error);
    }
  },
  removeProduct: async (productId, userId = 'anonymous') => {
    try {
      const response = await fetch(`${BASE_URL}/user-products?userId=${userId}`);
      const userProducts = await response.json();
      const userProduct = userProducts.find((up: any) => 
        up.productId._id === productId || up.productId === productId
      );
      
      if (userProduct) {
        await fetch(`${BASE_URL}/user-products/${userProduct._id}`, {
          method: 'DELETE',
        });
        
        set((state) => ({
          addedProducts: state.addedProducts.filter((id) => id !== productId),
        }));
      }
    } catch (error) {
      console.error('Failed to remove product:', error);
    }
  },
  fetchUserProducts: async (userId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/user-products?userId=${userId}`);
      const userProducts = await response.json();
      const productIds = userProducts.map((up: any) => 
        (typeof up.productId === 'object' && up.productId !== null) ? up.productId._id.toString() : String(up.productId)
      );
      set({ addedProducts: productIds });
    } catch (error) {
      console.error('Failed to fetch user products:', error);
    }
  },
  fetchLatestReport: async (userId: string) => {
    try {
      // 1. Fetch latest scan
      const response = await fetch(`${BASE_URL}/scans?userId=${userId}`);
      const scans = await response.json();
      
      if (Array.isArray(scans) && scans.length > 0) {
        const latest = scans[0];
        
        set({ 
          overallScore: latest.analysis.overall_score,
          skinAnalysis: latest.analysis 
        });

        // 3. Fetch AI-generated Diet Plan for products
        try {
            const dietResponse = await fetch(`${BASE_URL}/diet-plan?userId=${userId}`);
            const dietPlans = await dietResponse.json();
            // Find the personalized plan related to this scan or the latest one
            const latestPlan = dietPlans.find((p: any) => p.planType === 'personalized') || dietPlans[0];

            if (latestPlan && latestPlan.recommendedProductIds && latestPlan.recommendedProductIds.length > 0) {
                 const dbProducts = latestPlan.recommendedProductIds.map((p: any) => ({
                    id: p._id || p.id,
                    name: p.name,
                    description: p.description || p.reason || "Recommended for you",
                    rating: p.rating || 4.8,
                    reviews: p.reviews || 100,
                    category: p.category || "Treatment" // Fallback
                }));
                set({ recommendedProducts: dbProducts });
            } else if (latestPlan && latestPlan.products && latestPlan.products.length > 0) {
                // Fallback to AI text components if DB products not found
                const aiProducts = latestPlan.products.map((p: any, index: number) => ({
                    id: `ai-${index}`,
                    name: p.name,
                    description: p.reason,
                    rating: 4.8, 
                    reviews: 100, 
                    category: p.type
                }));
                set({ recommendedProducts: aiProducts });
            } else {
                const recResponse = await fetch(`${BASE_URL}/products`);
                const allProducts = await recResponse.json();
                set({ recommendedProducts: allProducts });
            }
        } catch (dietError) {
            console.error("Failed to fetch diet plan for products:", dietError);
            const recResponse = await fetch(`${BASE_URL}/products`);
            const allProducts = await recResponse.json();
            set({ recommendedProducts: allProducts });
        }
      }
    } catch (error) {
      console.error('Failed to fetch latest report:', error);
    }
  },
  fetchScanHistory: async (userId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/scans?userId=${userId}`);
      const scans = await response.json();
      if (Array.isArray(scans)) {
        set({ scanHistory: scans });
      }
    } catch (error) {
      console.error('Failed to fetch scan history:', error);
    }
  },
  analyzeSkin: async (imageUri, userId) => {
    try {
      const result = await scanUserImage(imageUri, userId);
      console.log(result);
      set({
        skinAnalysis: {
          Acne: result.Acne,
          Pigmentation: result.Pigmentation,
          Dullness: result.Dullness,
          Stress: result.Stress,
          Hydration: result.Hydration,
        },
        overallScore: result.overall_score,
      });

      // Fetch ALL products so user can choose from the full catalog
      const response = await fetch(`${BASE_URL}/products`);
      const allProducts = await response.json();
      set({ recommendedProducts: allProducts });

    } catch (error) {
      // console.warn("Skin analysis failed:", error);
      throw error;
    }
  },
}));
