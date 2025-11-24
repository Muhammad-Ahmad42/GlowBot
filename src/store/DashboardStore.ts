import { create } from "zustand";
import { LatestScan, StressLevel, DietTip, Expert, ExpertProfile, StressHistoryItem, DietMeal } from "../types/DashboardDataTypes";

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
}

export const useDashboardStore = create<DashboardState>((set) => ({
  latestScan: {
    time: "2 hours ago",
    skinAnalysis: {
      Acne: 50,
      Pigmentation: 15,
      Dullness: 15,
    },
  },
  stressLevel: {
    value: 45,
    connected: true,
  },
  dietTip: {
    title: "Diet Tip of the Day",
    mainTip: "Boost Vitamin C",
    description: "Add citrus fruits to your breakfast for brighter, more radiant skin.",
    category: "Nutrition",
    items: ["Lemon", "Orange", "Kiwi"],
  },
  experts: [
    {
      id: "1",
      name: "Dr. Emma Wilson",
      specialty: "Dermatologist",
      rating: 4.9,
      reviews: 120,
      available: true,
      fee: "$50",
      description: "Specializes in acne and anti-aging treatments with over 10 years of experience.",
    },
    {
      id: "2",
      name: "Dr. James Carter",
      specialty: "Nutritionist",
      rating: 4.8,
      reviews: 85,
      available: false,
      fee: "$40",
      description: "Expert in gut health and skin-friendly diets to help you glow from within.",
    },
    {
      id: "3",
      name: "Dr. Sophia Lee",
      specialty: "Esthetician",
      rating: 4.7,
      reviews: 200,
      available: true,
      fee: "$60",
      description: "Certified esthetician focusing on holistic facial treatments and skincare routines.",
    },
  ],
  stressHistory: [
    { day: "Mon", level: "Low", value: 30, details: "Felt relaxed and productive." },
    { day: "Tue", level: "Med", value: 55, details: "Some work pressure, but manageable." },
    { day: "Wed", level: "High", value: 80, details: "Tight deadlines caused high stress." },
    { day: "Thu", level: "Low", value: 25, details: "Great day, exercised in the morning." },
    { day: "Fri", level: "Med", value: 60, details: "Busy end to the week." },
    { day: "Sat", level: "Low", value: 20, details: "Relaxing weekend vibes." },
    { day: "Sun", level: "Low", value: 15, details: "Prepared for the week ahead." },
  ],
  dietPlan: [
    {
      type: "Breakfast",
      time: "8:00 AM",
      name: "Oatmeal with Berries",
      calories: "350 kcal",
      details: "Ingredients: Oats, Blueberries, Strawberries, Almond Milk, Honey.\n\nBenefits: High in fiber and antioxidants.",
    },
    {
      type: "Lunch",
      time: "1:00 PM",
      name: "Grilled Chicken Salad",
      calories: "450 kcal",
      details: "Ingredients: Chicken Breast, Lettuce, Tomatoes, Cucumber, Olive Oil.\n\nBenefits: Lean protein and essential vitamins.",
    },
    {
      type: "Snack",
      time: "4:00 PM",
      name: "Greek Yogurt & Nuts",
      calories: "200 kcal",
      details: "Ingredients: Greek Yogurt, Walnuts, Honey.\n\nBenefits: Probiotics and healthy fats.",
    },
    {
      type: "Dinner",
      time: "7:30 PM",
      name: "Baked Salmon & Veggies",
      calories: "500 kcal",
      details: "Ingredients: Salmon Fillet, Asparagus, Lemon, Garlic.\n\nBenefits: Omega-3 fatty acids for skin health.",
    },
  ],
  setLatestScan: (latestScan) => set({ latestScan }),
  setStressLevel: (stressLevel) => set({ stressLevel }),
  setDietTip: (dietTip) => set({ dietTip }),
  setExperts: (experts) => set({ experts }),
  setStressHistory: (stressHistory) => set({ stressHistory }),
  setDietPlan: (dietPlan) => set({ dietPlan }),
}));
