import { BASE_URL } from '../res/api';
import { HealthData } from './HealthService';

export const StressService = {
  /**
   * Log stress data to the backend
   */
  logStressData: async (
    userId: string,
    healthData: HealthData,
    source: 'health_connect' | 'camera_scan' = 'health_connect'
  ): Promise<boolean> => {
    try {
      const response = await fetch(`${BASE_URL}/stress/log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          stressLevel: healthData.stressLevel,
          stressLabel: healthData.stressLabel,
          healthData: {
            steps: healthData.steps,
            calories: healthData.calories,
            heartRate: healthData.heartRate,
            sleepHours: healthData.sleepHours,
          },
          source,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Stress data logged successfully:', data);
      return true;
    } catch (error) {
      console.error('Failed to log stress data:', error);
      return false;
    }
  },

  /**
   * Get stress history for a user
   */
  getStressHistory: async (userId: string, limit: number = 30): Promise<any[]> => {
    try {
      const response = await fetch(`${BASE_URL}/stress?userId=${userId}&limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch stress history:', error);
      return [];
    }
  },
};
