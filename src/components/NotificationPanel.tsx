import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Animated,
  Dimensions,
  ScrollView,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { horizontalScale, ms, textScale, verticalScale } from '../utils/SizeScalingUtility';
import Colors from '../utils/Colors';
import { useReminderStore } from '../store/ReminderStore';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PANEL_WIDTH = SCREEN_WIDTH * 0.85;

interface NotificationPanelProps {
  visible: boolean;
  onClose: () => void;
}

const REMINDER_ICONS: Record<string, string> = {
  'Skincare Routine': 'face-woman-shimmer',
  'Drink Water': 'water',
  'Apply Sunscreen': 'white-balance-sunny',
  'Take Medication': 'pill',
  'Exercise': 'run',
  'Sleep Time': 'sleep',
};

const REMINDER_COLORS: Record<string, string> = {
  'Skincare Routine': '#FF6B9D',
  'Drink Water': '#29B6F6',
  'Apply Sunscreen': '#FFB300',
  'Take Medication': '#66BB6A',
  'Exercise': '#AB47BC',
  'Sleep Time': '#5C6BC0',
};

const NotificationPanel: React.FC<NotificationPanelProps> = ({ visible, onClose }) => {
  const navigation = useNavigation<any>();
  const { reminders, toggleReminder } = useReminderStore();
  const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: SCREEN_WIDTH - PANEL_WIDTH,
          useNativeDriver: true,
          damping: 20,
          stiffness: 90,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SCREEN_WIDTH,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const getIcon = (title: string) => REMINDER_ICONS[title] || 'bell-ring';
  const getColor = (title: string) => REMINDER_COLORS[title] || '#78909C';

  const activeReminders = reminders.filter((r) => r.enabled);

  const handleViewAll = () => {
    onClose();
    setTimeout(() => navigation.navigate('Report', { screen: 'Reminders' }), 300);
  };

  if (!visible) return null;

  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: 1000 }]}>
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} />
      </TouchableWithoutFeedback>

      <Animated.View style={[styles.panelContainer, { transform: [{ translateX: slideAnim }] }]}>
        <LinearGradient
          colors={[Colors.WhiteColor, '#FFF0F5', '#F8F8FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBackground}
        >
          <View style={styles.header}>
            <View>
                <Text style={styles.headerTitle}>Notifications</Text>
                <Text style={styles.headerSubtitle}>Stay consistent with your routine</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            {reminders.length === 0 ? (
              <View style={styles.emptyContainer}>
                <View style={[styles.emptyIconInfo, { backgroundColor: Colors.ButtonPink + '10' }]}>
                    <MaterialCommunityIcons name="bell-sleep-outline" size={48} color={Colors.ButtonPink} />
                </View>
                <Text style={styles.emptyText}>No reminders set yet</Text>
                <Text style={styles.emptySubText}>Add reminders to stay on track!</Text>
                <TouchableOpacity style={styles.addButton} onPress={handleViewAll}>
                  <Text style={styles.addButtonText}>Add Reminder</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Text style={styles.sectionLabel}>
                  TODAY'S SCHEDULE
                </Text>
                {reminders.map((item) => (
                  <View key={item.id} style={[styles.reminderCard, !item.enabled && styles.disabledCard]}>
                    <View style={[styles.iconContainer, { backgroundColor: item.enabled ? getColor(item.title) : '#E0E0E0' }]}>
                      <MaterialCommunityIcons
                        name={getIcon(item.title) as any}
                        size={22}
                        color={Colors.WhiteColor}
                      />
                    </View>
                    <View style={styles.reminderInfo}>
                      <Text style={[styles.reminderTitle, !item.enabled && styles.disabledText]} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text style={styles.reminderTime}>{formatTime(item.time)}</Text>
                    </View>
                    <Switch
                      value={item.enabled}
                      onValueChange={(val) => toggleReminder(item.id, val)}
                      trackColor={{ false: '#E0E0E0', true: getColor(item.title) + '60' }}
                      thumbColor={item.enabled ? getColor(item.title) : '#BDBDBD'}
                      style={{ transform: [{ scale: 0.8 }] }}
                    />
                  </View>
                ))}
            <TouchableOpacity style={styles.viewAllButton} onPress={handleViewAll}>
                <Text style={styles.viewAllText}>Manage Reminders</Text>
                <Ionicons name="arrow-forward" size={16} color={Colors.ButtonPink} />
            </TouchableOpacity>
              </>
            )}
          </ScrollView>


        </LinearGradient>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(5px)', // iOS only equivalent visually via opacity
  },
  panelContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: PANEL_WIDTH,
    borderTopLeftRadius: ms(30),
    borderBottomLeftRadius: ms(30),
    shadowColor: '#000',
    shadowOffset: { width: -5, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 20,
    overflow: 'hidden', // Ensure gradient respects border radius
  },
  gradientBackground: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: horizontalScale(24),
    paddingTop: verticalScale(60),
    paddingBottom: verticalScale(20),
  },
  headerTitle: {
    fontSize: textScale(24),
    fontWeight: '800', // Extra bold
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
      fontSize: textScale(13),
      color: Colors.textSecondary,
      marginTop: verticalScale(2),
  },
  closeButton: {
    padding: ms(5),
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: ms(20),
  },
  content: {
    paddingHorizontal: horizontalScale(24),
    paddingBottom: verticalScale(40),
  },
  sectionLabel: {
    fontSize: textScale(12),
    fontWeight: '700',
    color: Colors.textMuted,
    marginBottom: verticalScale(16),
    marginTop: verticalScale(10),
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent
    borderRadius: ms(20),
    padding: ms(16),
    marginBottom: verticalScale(12),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    shadowColor: Colors.ButtonPink, // Tinted shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  disabledCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      shadowOpacity: 0,
      elevation: 0,
  },
  iconContainer: {
    width: ms(44),
    height: ms(44),
    borderRadius: ms(16),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: horizontalScale(14),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  reminderInfo: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: textScale(16),
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: verticalScale(3),
  },
  disabledText: {
      color: Colors.textMuted,
  },
  reminderTime: {
    fontSize: textScale(13),
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: verticalScale(80),
  },
  emptyIconInfo:{
      width: ms(80),
      height: ms(80),
      borderRadius: ms(40),
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: verticalScale(20),
  },
  emptyText: {
    fontSize: textScale(18),
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: verticalScale(6),
  },
  emptySubText: {
    fontSize: textScale(14),
    color: Colors.textSecondary,
    marginBottom: verticalScale(30),
  },
  addButton: {
    backgroundColor: Colors.ButtonPink,
    paddingVertical: verticalScale(14),
    paddingHorizontal: horizontalScale(32),
    borderRadius: ms(30),
    shadowColor: Colors.ButtonPink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addButtonText: {
    color: Colors.WhiteColor,
    fontSize: textScale(15),
    fontWeight: '700',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(10),
    paddingVertical: verticalScale(12),
  },
  viewAllText: {
    fontSize: textScale(14),
    fontWeight: '700',
    color: Colors.ButtonPink,
    marginRight: horizontalScale(6),
  },
});

export default NotificationPanel;
