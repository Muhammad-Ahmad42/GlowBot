import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { notificationService } from '../services/NotificationService';

export interface Reminder {
  id: string;
  title: string;
  time: string; // ISO string or specific format
  enabled: boolean;
  notificationId?: string;
  repeat?: string; // e.g., 'daily', 'weekly'
}

interface ReminderState {
  reminders: Reminder[];
  addReminder: (reminder: Reminder) => void;
  toggleReminder: (id: string, value: boolean) => Promise<void>;
  removeReminder: (id: string) => void;
  updateReminder: (id: string, updates: Partial<Reminder>) => void;
}

export const useReminderStore = create<ReminderState>()(
  persist(
    (set, get) => ({
      reminders: [],
      
      addReminder: async (reminder) => {
        if (reminder.enabled) {
             const [hours, minutes] = reminder.time.split(':').map(Number);
             const trigger = { hour: hours, minute: minutes, repeats: true };
             const notifId = await notificationService.scheduleAlarm(
                reminder.title, 
                "It's time for your routine!", 
                trigger
            );
            if (notifId) reminder.notificationId = notifId;
        }
        set((state) => ({ reminders: [...state.reminders, reminder] }));
      },

      toggleReminder: async (id, value) => {
        const { reminders } = get();
        const reminderIndex = reminders.findIndex(r => r.id === id);
        if (reminderIndex === -1) return;

        const updatedReminders = [...reminders];
        const reminder = updatedReminders[reminderIndex];
        
        // Handle Notification Scheduling
        if (value) {
            // Calculate trigger based on time string (Assuming HH:mm for now)
            // This needs parsing logic. For now, we assume simple daily trigger.
            const [hours, minutes] = reminder.time.split(':').map(Number);
            const trigger = { hour: hours, minute: minutes, repeats: true };
            
            const notifId = await notificationService.scheduleAlarm(
                reminder.title, 
                "It's time for your routine!", 
                trigger
            );
            if (notifId) reminder.notificationId = notifId;
        } else {
            if (reminder.notificationId) {
                await notificationService.cancelAlarm(reminder.notificationId);
                reminder.notificationId = undefined;
            }
        }
        
        reminder.enabled = value;
        set({ reminders: updatedReminders });
      },

      removeReminder: async (id) => {
        const { reminders } = get();
        const reminder = reminders.find(r => r.id === id);
        if (reminder?.notificationId) {
            await notificationService.cancelAlarm(reminder.notificationId);
        }
        set((state) => ({ 
            reminders: state.reminders.filter((r) => r.id !== id) 
        }));
      },
      
      updateReminder: (id, updates) => {
          set((state) => ({
              reminders: state.reminders.map(r => r.id === id ? { ...r, ...updates } : r)
          }));
      }
    }),
    {
      name: 'reminder-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
