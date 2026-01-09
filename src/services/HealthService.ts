import {
  initialize,
  requestPermission,
  readRecords,
  getSdkStatus,
  SdkAvailabilityStatus,
} from 'react-native-health-connect';
import { Platform } from 'react-native';

export interface HealthData {
  steps: number;
  calories: number;
  heartRate: number;
  sleepHours: number;
  stressLevel: number; // 0-100
  stressLabel: 'Low' | 'Moderate' | 'High';
}

export const HealthService = {
  checkAvailability: async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return false;
    const status = await getSdkStatus();
    return status === SdkAvailabilityStatus.SDK_AVAILABLE;
  },

  initialize: async (): Promise<boolean> => {
    try {
      const isInitialized = await initialize();
      return isInitialized;
    } catch (error) {
      console.error('Failed to initialize Health Connect:', error);
      return false;
    }
  },

  requestPermissions: async (): Promise<boolean> => {
    try {
      const permissions = await requestPermission([
        { accessType: 'read', recordType: 'Steps' },
        { accessType: 'read', recordType: 'ActiveCaloriesBurned' },
        { accessType: 'read', recordType: 'HeartRate' },
        { accessType: 'read', recordType: 'SleepSession' },
      ]);
      // user might deny, but we return true if the flow completed without error
      return true; 
    } catch (error) {
      console.error('Permission request failed:', error);
      return false;
    }
  },

  getHealthData: async (date: Date = new Date()): Promise<HealthData> => {
    const startTime = new Date(date);
    startTime.setHours(0, 0, 0, 0);
    const endTime = new Date(date);
    endTime.setHours(23, 59, 59, 999);

    const timeRangeFilter = {
      operator: 'between',
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    } as const;

    try {
      // 1. Steps
      const stepsRecords = await readRecords('Steps', { timeRangeFilter });
      const totalSteps = stepsRecords.records.reduce((sum: number, record: any) => sum + record.count, 0);

      // 2. Calories
      const caloriesRecords = await readRecords('ActiveCaloriesBurned', { timeRangeFilter });
      const totalCalories = caloriesRecords.records.reduce((sum: number, record: any) => sum + record.energy.inKilocalories, 0);
      const sleepRecords = await readRecords('SleepSession', { timeRangeFilter });
      let totalSleepMinutes = 0;
      sleepRecords.records.forEach((record: any) => {
         const start = new Date(record.startTime);
         const end = new Date(record.endTime);
         const durationMs = end.getTime() - start.getTime();
         totalSleepMinutes += durationMs / (1000 * 60);
      });
      const sleepHours = totalSleepMinutes / 60;

      // 4. Heart Rate (Avg)
      const heartRateRecords = await readRecords('HeartRate', { timeRangeFilter });
      let avgHeartRate = 70; // Default fallback
      if (heartRateRecords.records.length > 0) {
        let sumHr = 0;
        let countHr = 0;
        heartRateRecords.records.forEach((record: any) => {
           record.samples.forEach((sample: any) => {
             sumHr += sample.beatsPerMinute;
             countHr++;
           });
        });
        if (countHr > 0) {
            avgHeartRate = sumHr / countHr;
        }
      }

      // 5. Stress Calculation (Simplified Heuristic)
      // Logic: High HR + Low Sleep + High Activity = High Stress
      // This is a naive model as requested.
      
      let stressScore = 50; 

      // High HR contributes to stress
      if (avgHeartRate > 85) stressScore += 20;
      else if (avgHeartRate < 60) stressScore -= 10;

      // Low Sleep contributes to stress
      if (sleepHours < 6) stressScore += 25;
      else if (sleepHours > 7.5) stressScore -= 15;

      // High Activity (Physical Stress) 
      // Note: Regular exercise usually REDUCES mental stress, but increases physical load.
      // The prompt says: "High Activity = High Stress" in the context of "High HR + Low Sleep + ...".
      // Let's assume this means physical strain.
      if (totalCalories > 1000) stressScore += 10;
      else if (totalCalories > 500) stressScore += 5;
      
      // Cap score
      stressScore = Math.min(100, Math.max(0, stressScore));
      
      let stressLabel: 'Low' | 'Moderate' | 'High' = 'Moderate';
      if (stressScore < 40) stressLabel = 'Low';
      else if (stressScore > 70) stressLabel = 'High';

      return {
        steps: totalSteps,
        calories: totalCalories,
        heartRate: Math.round(avgHeartRate),
        sleepHours: parseFloat(sleepHours.toFixed(1)),
        stressLevel: stressScore,
        stressLabel,
      };

    } catch (error) {
      console.error('Error reading health records:', error);
      return {
        steps: 0,
        calories: 0,
        heartRate: 0,
        sleepHours: 0,
        stressLevel: 0,
        stressLabel: 'Low',
      };
    }
  }
};
