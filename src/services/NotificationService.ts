import { Platform, Alert } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';

class NotificationService {
  private _notifications: any = null;
  private _isConfigured: boolean = false;

  constructor() {
    this.configure();
  }

  private getNotifications = () => {
    if (this._notifications) {
      return this._notifications;
    }

    const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
    if (Platform.OS === 'android' && isExpoGo) {
      console.warn('Expo Notifications are disabled in Expo Go on Android (SDK 53+ limitation). Use a Development Build to test notifications.');
      return null;
    }

    try {
      this._notifications = require('expo-notifications');
      return this._notifications;
    } catch (error) {
      console.warn('Failed to load expo-notifications:', error);
      return null;
    }
  };

  configure = async () => {
    if (this._isConfigured) return;
    
    const Notifications = this.getNotifications();
    if (!Notifications) return;

    try {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('reminders', {
          name: 'Reminders',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF6B9D',
          sound: 'alarm.mp3',
          lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
          bypassDnd: true,
          enableVibrate: true,
          enableLights: true,
        });
      }

      this._isConfigured = true;
      console.log('NotificationService configured successfully');
    } catch (error) {
      console.error('Failed to configure notifications:', error);
    }
  };

  requestPermissions = async (): Promise<boolean> => {
    const Notifications = this.getNotifications();
    if (!Notifications) {
      console.log('Notifications not available');
      return false;
    }

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Notification permission denied');
        return false;
      }

      console.log('Notification permission granted');
      return true;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  };

  scheduleAlarm = async (title: string, body: string, trigger: { hour: number; minute: number; repeats?: boolean }): Promise<string | null> => {
    const Notifications = this.getNotifications();
    if (!Notifications) {
      console.log('Cannot schedule alarm: Notifications not available');
      return null;
    }

    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      console.log('Cannot schedule alarm: No permission');
      return null;
    }

    try {
      const now = new Date();
      let scheduledDate = new Date();
      scheduledDate.setHours(trigger.hour, trigger.minute, 0, 0);

      if (scheduledDate <= now) {
        scheduledDate.setDate(scheduledDate.getDate() + 1);
      }

      console.log(`[NotificationService] Current time: ${now.toLocaleString()}`);
      console.log(`[NotificationService] Scheduling for: ${scheduledDate.toLocaleString()}`);

      const notificationTrigger: any = trigger.repeats
        ? {
            type: 'daily',
            hour: trigger.hour,
            minute: trigger.minute,
          }
        : {
            type: 'calendar',
            date: scheduledDate, 
            year: scheduledDate.getFullYear(),
            month: scheduledDate.getMonth() + 1, 
          };


      
      const finalTrigger = trigger.repeats
      ? {
          type: 'daily',
          hour: trigger.hour,
          minute: trigger.minute,
          channelId: 'reminders', 
        }
      : {
          type: 'calendar',
          year: scheduledDate.getFullYear(),
          month: scheduledDate.getMonth() + 1, 
          day: scheduledDate.getDate(),
          hour: scheduledDate.getHours(),
          minute: scheduledDate.getMinutes(),
          channelId: 'reminders',
        };

      console.log('[NotificationService] Final Trigger:', JSON.stringify(finalTrigger));

      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: 'default',
          data: { type: 'reminder' },
          priority: Notifications.AndroidNotificationPriority?.MAX || 'max',
          categoryIdentifier: 'reminder',
        },
        trigger: finalTrigger,
      });

      console.log(`Alarm scheduled with ID: ${id} for ${trigger.hour}:${trigger.minute}`);
      return id;
    } catch (error) {
      console.error('Failed to schedule alarm:', error);
      return null;
    }
  };

  scheduleTestNotification = async (): Promise<string | null> => {
    const Notifications = this.getNotifications();
    if (!Notifications) {
      Alert.alert('Notifications Unavailable', 'Notifications are not available in Expo Go on Android. Please use a Development Build.');
      return null;
    }

    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      Alert.alert('Permission Required', 'Please enable notifications in your device settings.');
      return null;
    }

    try {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: '🔔 Test Notification',
          body: 'Your reminders are working correctly!',
          sound: 'default',
          data: { type: 'test' },
        },
        trigger: {
          seconds: 3,
        },
      });

      console.log('Test notification scheduled:', id);
      return id;
    } catch (error) {
      console.error('Failed to schedule test notification:', error);
      Alert.alert('Error', 'Failed to schedule test notification');
      return null;
    }
  };

  getScheduledNotifications = async (): Promise<any[]> => {
    const Notifications = this.getNotifications();
    if (!Notifications) return [];

    try {
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      console.log('Scheduled notifications:', scheduled);
      return scheduled;
    } catch (error) {
      console.error('Failed to get scheduled notifications:', error);
      return [];
    }
  };

  cancelAlarm = async (notificationId: string): Promise<void> => {
    const Notifications = this.getNotifications();
    if (!Notifications) return;

    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log(`Alarm cancelled: ${notificationId}`);
    } catch (error) {
      console.error('Failed to cancel alarm:', error);
    }
  };

  cancelAll = async (): Promise<void> => {
    const Notifications = this.getNotifications();
    if (!Notifications) return;

    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('All alarms cancelled');
    } catch (error) {
      console.error('Failed to cancel all alarms:', error);
    }
  };

  isAvailable = (): boolean => {
    return this.getNotifications() !== null;
  };
}

export const notificationService = new NotificationService();
