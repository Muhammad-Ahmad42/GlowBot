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
    
    // Append userId
    formData.append('userId', userId);

    // Extract file extension from URI or default to jpg
    const uriParts = imageUri.split('.');
    const fileType = uriParts[uriParts.length - 1] || 'jpg';
    
    // React Native FormData structure - simpler than web
    formData.append('image', {
      uri: imageUri,
      type: `image/${fileType}`,
      name: `photo.${fileType}`,
    } as any);
    
    // Use fetch instead of axios for better React Native FormData support
    // NOTE: Do NOT set Content-Type header for FormData, fetch will set it with boundary
    const response = await fetch(ENDPOINTS.ANALYZE, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      // Try to parse error response from backend
      try {
        const text = await response.text();
        try {
            const errorData = JSON.parse(text);
            const error: any = new Error(errorData.error || `HTTP error! status: ${response.status}`);
            error.response = { data: errorData };
            throw error;
        } catch (jsonError) {
            // If JSON parse fails, use the text body
            throw new Error(text || `HTTP error! status: ${response.status}`);
        }
      } catch (parseError) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }
    
    const data = await response.json();
    
    // Check if backend returned an error (shouldn't happen with 200, but just in case)
    if (data.error) {
      const error: any = new Error(data.error);
      error.response = { data };
      throw error;
    }
    
    // Backend returns the full scan object, we need the analysis part
    const result: SkinAnalysisResult = data.analysis || data; 
    return result;
  } catch (error) {
    console.error('Error scanning user image:', error);
    throw error;
  }
};
