import { create } from 'zustand';
import { ScanService, SkinAnalysisResult } from '../services/ScanService';

interface ScanState {
  latestScan: SkinAnalysisResult | null;
  scanHistory: any[];
  isScanning: boolean;
  error: string | null;
  
  analyzeSkin: (imageUri: string) => Promise<void>;
  fetchHistory: () => Promise<void>;
  clearError: () => void;
}

export const useScanStore = create<ScanState>((set) => ({
  latestScan: null,
  scanHistory: [],
  isScanning: false,
  error: null,

  analyzeSkin: async (imageUri: string) => {
    set({ isScanning: true, error: null });
    try {
      const result = await ScanService.analyzeImage(imageUri);
      set({ latestScan: result, isScanning: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to analyze skin', isScanning: false });
    }
  },

  fetchHistory: async () => {
    try {
      const history = await ScanService.getScanHistory();
      set({ scanHistory: history });
    } catch (error: any) {
      console.error('Failed to fetch history:', error);
      // Optional: set error state if critical
    }
  },

  clearError: () => set({ error: null }),
}));
