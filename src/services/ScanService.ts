import { ENDPOINTS } from '../res/api';

export interface SkinAnalysisResult {
  Acne: number;
  Pigmentation: number;
  Dullness: number;
  Stress: number;
  Hydration: number;
  overall_score: number;
}

export const ScanService = {
  analyzeImage: async (imageUri: string): Promise<SkinAnalysisResult> => {
    try {
      const formData = new FormData();
      
      const uriParts = imageUri.split('.');
      const fileType = uriParts[uriParts.length - 1] || 'jpg';
      
      formData.append('image', {
        uri: imageUri,
        type: `image/${fileType}`,
        name: `photo.${fileType}`,
      } as any);
      
      const response = await fetch(ENDPOINTS.ANALYZE, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error scanning user image:', error);
      throw error;
    }
  },

  getScanHistory: async () => {
    try {
      const response = await fetch(ENDPOINTS.SCANS);
      if (!response.ok) throw new Error('Failed to fetch scan history');
      return await response.json();
    } catch (error) {
      console.error('Error fetching scan history:', error);
      throw error;
    }
  }
};
