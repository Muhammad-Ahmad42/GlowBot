import { create } from "zustand";
import { LatestScan, StressLevel, DietTip, Expert, ExpertProfile, StressHistoryItem, DietMeal } from "../types/DashboardDataTypes";
import { BASE_URL } from "../res/api";

export interface DashboardState {
  latestScan: LatestScan;
  stressLevel: StressLevel;
  dietTip: DietTip;
  experts: ExpertProfile[];
  stressHistory: StressHistoryItem[];
  dietPlan: DietMeal[];
  setLatestScan: (scan: LatestScan) => void;
  setStressLevel: (stress: StressLevel) => void;
  setDietTip: (tip: DietTip) => void;
  setExperts: (experts: ExpertProfile[]) => void;
  setStressHistory: (history: StressHistoryItem[]) => void;
  setDietPlan: (plan: DietMeal[]) => void;
  fetchScanHistory: (userId: string) => Promise<void>;
  fetchExperts: () => Promise<void>;
  fetchDietPlan: (userId: string) => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  latestScan: {
    time: "",
    skinAnalysis: {
      Acne: 0,
      Pigmentation: 0,
      Dullness: 0,
    },
  },
  stressLevel: {
    value: 0,
    connected: false,
  },
  dietTip: {
    title: "",
    mainTip: "",
    description: "",
    category: "",
    items: [],
  },
  experts: [],
  stressHistory: [],
  dietPlan: [],
  
  setLatestScan: (latestScan) => set({ latestScan }),
  setStressLevel: (stressLevel) => set({ stressLevel }),
  setDietTip: (dietTip) => set({ dietTip }),
  setExperts: (experts) => set({ experts }),
  setStressHistory: (stressHistory) => set({ stressHistory }),
  setDietPlan: (dietPlan) => set({ dietPlan }),

  // Actions to fetch data from backend
  fetchScanHistory: async (userId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/scans?userId=${userId}`);
      const scans = await response.json();
      
      if (scans && scans.length > 0) {
        const latest = scans[0]; // Assuming sorted by createdAt desc
        
        // Update latest scan
        set((state) => ({
          latestScan: {
            time: new Date(latest.createdAt).toLocaleDateString(),
            skinAnalysis: latest.analysis || { Acne: 0, Pigmentation: 0, Dullness: 0 },
          },
          // Derive stress history from scans (with null checks)
          stressHistory: scans.slice(0, 7).map((scan: any) => {
            const stressValue = scan?.analysis?.Stress || 0;
            return {
              day: new Date(scan.createdAt).toLocaleDateString('en-US', { weekday: 'short' }),
              level: stressValue > 70 ? "High" : stressValue > 40 ? "Med" : "Low",
              value: stressValue,
              details: "Recorded from scan"
            };
          }).reverse(),
          stressLevel: {
            value: latest?.analysis?.Stress || 0,
            connected: true
          }
        }));
      }
    } catch (error) {
      console.error("Failed to fetch scan history:", error);
    }
  },

  fetchExperts: async () => {
    try {
      const response = await fetch(`${BASE_URL}/experts`);
      const data = await response.json();
      // Map _id to id for frontend consumption
      const formattedData = data.map((expert: any) => ({
        ...expert,
        id: expert._id || expert.id
      }));
      set({ experts: formattedData });
    } catch (error) {
      console.error("Failed to fetch experts:", error);
    }
  },

  fetchDietPlan: async (userId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/diet-plan?userId=${userId}`);
      const data = await response.json();
      set({ dietPlan: data.length > 0 ? data[0].meals : [] });   
      if (data.length > 0 && data[0].tip) {
         set({ dietTip: data[0].tip });
      }
    } catch (error) {
      console.error("Failed to fetch diet plan:", error);
    }
  },
}));
