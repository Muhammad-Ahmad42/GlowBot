import { ENDPOINTS } from '../res/api';

interface SkinAnalysisResult {
  Acne: number;
  Pigmentation: number;
  Dullness: number;
  Stress: number;
  Hydration: number;
  overall_score: number;
}

export const scanUserImage = async (imageUri: string, userId: string): Promise<SkinAnalysisResult> => {
  try {
    const formData = new FormData();
    
    formData.append('userId', userId);
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
    });
    
    if (!response.ok) {
      try {
        const text = await response.text();
        try {
            const errorData = JSON.parse(text);
            const error: any = new Error(errorData.error || `HTTP error! status: ${response.status}`);
            error.response = { data: errorData };
            throw error;
        } catch (jsonError) {
            throw new Error(text || `HTTP error! status: ${response.status}`);
        }
      } catch (parseError) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }
    
    const data = await response.json();
    if (data.error) {
      const error: any = new Error(data.error);
      error.response = { data };
      throw error;
    }
    const result: SkinAnalysisResult = data.analysis || data; 
    return result;
  } catch (error) {
    console.error('Error scanning user image:', error);
    throw error;
  }
};
