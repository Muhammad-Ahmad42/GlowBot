import { create } from "zustand";

interface ReportState {
  overallScore: number;
  skinAnalysis: Record<string, number>;
  recommendedProducts: {
    id: string;
    name: string;
    description: string;
    rating: number;
    reviews: number;
    imageIcon: string;
    imageIconType: "Ionicons" | "MaterialCommunityIcons" | "FontAwesome5";
    imageBg: string;
    iconColor: string;
  }[];
  addedProducts: string[]; // Store IDs of added products
  // Actions
  setOverallScore: (score: number) => void;
  setSkinAnalysis: (analysis: ReportState["skinAnalysis"]) => void;
  setRecommendedProducts: (products: ReportState["recommendedProducts"]) => void;
  addProduct: (productId: string) => void;
  removeProduct: (productId: string) => void;
}

export const useReportStore = create<ReportState>((set) => ({
  overallScore: 0,
  skinAnalysis: {
    Acne: 25,
    Pigmentation: 15,
    Dullness: 15,
    Stress: 45,
    Hydration: 85,
  },
  recommendedProducts: [
    {
      id: "1",
      name: "Gentle Cleanser",
      description: "For acne-prone skin",
      rating: 4.8,
      reviews: 120,
      imageIcon: "bottle-tonic",
      imageIconType: "MaterialCommunityIcons",
      imageBg: "#E3F2FD",
      iconColor: "#1976D2",
    },
    {
      id: "2",
      name: "Brightening Serum",
      description: "Reduces pigmentation",
      rating: 4.5,
      reviews: 89,
      imageIcon: "flask",
      imageIconType: "FontAwesome5",
      imageBg: "#F3E5F5",
      iconColor: "#7B1FA2",
    },
    {
      id: "3",
      name: "Hydrating Moisturizer",
      description: "Deep hydration",
      rating: 4.9,
      reviews: 210,
      imageIcon: "water",
      imageIconType: "Ionicons",
      imageBg: "#E0F7FA",
      iconColor: "#0097A7",
    },
     {
      id: "4",
      name: "Sunscreen SPF 50",
      description: "UV Protection",
      rating: 4.7,
      reviews: 150,
      imageIcon: "sunny",
      imageIconType: "Ionicons",
      imageBg: "#FFF3E0",
      iconColor: "#FF9800",
    },
  ],
  setOverallScore: (overallScore) => set({ overallScore }),
  setSkinAnalysis: (skinAnalysis) => set({ skinAnalysis }),
  setRecommendedProducts: (recommendedProducts) => set({ recommendedProducts }),
  addedProducts: [],
  addProduct: (productId) =>
    set((state) => {
      if (!state.addedProducts.includes(productId)) {
        return { addedProducts: [...state.addedProducts, productId] };
      }
      return state;
    }),
  removeProduct: (productId) =>
    set((state) => ({
      addedProducts: state.addedProducts.filter((id) => id !== productId),
    })),
}));
