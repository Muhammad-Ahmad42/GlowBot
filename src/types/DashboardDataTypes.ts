
export interface LatestScan {
  time: string;
  skinAnalysis: Record<string, number>;
}

export interface StressLevel {
  value: number;
  connected: boolean;
}

export interface DietTip {
  title: string;
  mainTip: string;
  description: string;
  category: string;
  items: string[];
}

export interface Expert {
  id: string;
  name: string;
  subtitle: string;
  online: boolean;
}

export interface ExpertProfile {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  available: boolean;
  fee: string;
  description: string;
}

export interface StressHistoryItem {
  day: string;
  level: "Low" | "Med" | "High";
  value: number;
  details: string;
}

export interface DietMeal {
  type: string;
  time: string;
  name: string;
  calories: string;
  details: string;
}
