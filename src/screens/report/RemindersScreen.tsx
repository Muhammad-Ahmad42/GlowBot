import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Platform,
  Alert,
  TextInput,
  Modal,
  KeyboardAvoidingView,
} from "react-native";
import { Header, SafeScreen, Card } from "@/src/components";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { horizontalScale, ms, textScale, verticalScale } from "../../utils/SizeScalingUtility";
import Colors from "../../utils/Colors";
import { useNavigation } from "@react-navigation/native";
import { useReminderStore, Reminder } from "../../store/ReminderStore";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { notificationService } from "../../services/NotificationService";

const REMINDER_TYPES = [
  { id: "skincare", title: "Skincare Routine", icon: "face-woman-shimmer", color: "#FF6B9D" },
  { id: "water", title: "Drink Water", icon: "water", color: "#29B6F6" },
  { id: "sunscreen", title: "Apply Sunscreen", icon: "white-balance-sunny", color: "#FFB300" },
  { id: "medication", title: "Take Medication", icon: "pill", color: "#66BB6A" },
  { id: "exercise", title: "Exercise", icon: "run", color: "#AB47BC" },
  { id: "sleep", title: "Sleep Time", icon: "sleep", color: "#5C6BC0" },
  { id: "custom", title: "Custom Reminder", icon: "bell-ring", color: "#78909C" },
];

type ModalMode = 'none' | 'add' | 'edit' | 'action';

interface FormState {
  selectedType: typeof REMINDER_TYPES[0];
  title: string;
  time: Date;
  reminder: Reminder | null;
}

const initialFormState: FormState = {
  selectedType: REMINDER_TYPES[0],
  title: '',
  time: new Date(),
  reminder: null,
};

const RemindersScreen = () => {
  const navigation = useNavigation();
  const { reminders, toggleReminder, addReminder, removeReminder, updateReminder } = useReminderStore();

  const [modalMode, setModalMode] = useState<ModalMode>('none');
  const [form, setForm] = useState<FormState>(initialFormState);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const resetForm = () => setForm(initialFormState);

  const openAddModal = () => {
    resetForm();
    setModalMode('add');
  };

  const openActionModal = (reminder: Reminder) => {
    setForm({ ...initialFormState, reminder });
    setModalMode('action');
  };

  const openEditModal = () => {
    if (!form.reminder) return;
    const [hours, minutes] = form.reminder.time.split(':').map(Number);
    const timeDate = new Date();
    timeDate.setHours(hours, minutes, 0, 0);
    setForm(prev => ({ ...prev, title: prev.reminder!.title, time: timeDate }));
    setModalMode('edit');
  };

  const closeModal = () => setModalMode('none');

  const handleTestNotification = async () => {
    const result = await notificationService.scheduleTestNotification();
    if (result) {
      Alert.alert('Test Sent!', 'You should receive a notification in 3 seconds.');
    }
  };

  const handleDelete = () => {
    if (!form.reminder) return;
    closeModal();
    Alert.alert(
      'Delete Reminder',
      `Are you sure you want to delete "${form.reminder.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => removeReminder(form.reminder!.id) },
      ]
    );
  };

  const handleSelectType = (type: typeof REMINDER_TYPES[0]) => {
    setForm(prev => ({ 
      ...prev, 
      selectedType: type, 
      title: type.id === 'custom' ? prev.title : '' 
    }));
  };

  const showTimePickerForAdd = () => {
    if (form.selectedType.id === 'custom' && !form.title.trim()) {
      Alert.alert('Title Required', 'Please enter a title for your custom reminder.');
      return;
    }
    closeModal();
    setTimeout(() => setShowTimePicker(true), 300);
  };

  const showTimePickerForEdit = () => {
    if (!form.title.trim()) {
      Alert.alert('Title Required', 'Please enter a title for your reminder.');
      return;
    }
    closeModal();
    setTimeout(() => setShowTimePicker(true), 300);
  };

  const handleTimeSelected = (event: any, date?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (event.type === 'dismissed') return;

    if (date) {
      const timeString = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

      if (form.reminder) {
        updateReminder(form.reminder.id, { title: form.title.trim(), time: timeString });
      } else {
        const title = form.selectedType.id === 'custom' ? form.title.trim() : form.selectedType.title;
        addReminder({
          id: Date.now().toString(),
          title,
          time: timeString,
          enabled: true,
        });
      }
      resetForm();
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const getReminderIcon = (title: string) => {
    const type = REMINDER_TYPES.find(t => t.title === title);
    return type ? type.icon : 'bell-ring';
  };

  const getReminderColor = (title: string) => {
    const type = REMINDER_TYPES.find(t => t.title === title);
    return type ? type.color : '#78909C';
  };

  return (
    <SafeScreen>
      <View style={styles.container}>
        <Header
          heading="Reminders"
          subTitle="Never miss your routine"
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
          centerTitle={true}
          rightIcon={
            <View style={styles.addButton}>
              <Ionicons name="add" size={24} color={Colors.WhiteColor} />
            </View>
          }
          onRightIconPress={openAddModal}
        />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {reminders.length === 0 ? (
            <View style={styles.emptyContainer}>
              <LinearGradient colors={['#FCE4EC', '#F3E5F5']} style={styles.emptyIconContainer}>
                <MaterialCommunityIcons name="bell-sleep" size={64} color={Colors.ButtonPink} />
              </LinearGradient>
              <Text style={styles.emptyTitle}>No Reminders Yet</Text>
              <Text style={styles.emptySubtitle}>
                Stay on track with your skincare routine{'\n'}by setting up helpful reminders
              </Text>
              <TouchableOpacity style={styles.emptyButton} onPress={openAddModal}>
                <LinearGradient
                  colors={[Colors.ButtonPink, '#EC407A']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.emptyButtonGradient}
                >
                  <Ionicons name="add" size={20} color={Colors.WhiteColor} />
                  <Text style={styles.emptyButtonText}>Add Your First Reminder</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.sectionTitle}>Your Reminders</Text>
              <Text style={styles.sectionHint}>Tap a reminder to edit or delete</Text>
              {reminders.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.7}
                  onPress={() => openActionModal(item)}
                >
                  <Card style={styles.reminderCard}>
                    <View style={[styles.iconContainer, { backgroundColor: `${getReminderColor(item.title)}20` }]}>
                      <MaterialCommunityIcons
                        name={getReminderIcon(item.title) as any}
                        size={24}
                        color={getReminderColor(item.title)}
                      />
                    </View>
                    <View style={styles.infoContainer}>
                      <Text style={styles.reminderTitle}>{item.title}</Text>
                      <View style={styles.timeRow}>
                        <Ionicons name="time-outline" size={14} color={Colors.textSecondary} />
                        <Text style={styles.reminderTime}>{formatTime(item.time)}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: item.enabled ? '#E8F5E9' : '#FFEBEE' }]}>
                          <Text style={[styles.statusText, { color: item.enabled ? '#43A047' : '#E53935' }]}>
                            {item.enabled ? 'Active' : 'Paused'}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <Switch
                      trackColor={{ false: '#E0E0E0', true: `${getReminderColor(item.title)}80` }}
                      thumbColor={item.enabled ? getReminderColor(item.title) : '#BDBDBD'}
                      ios_backgroundColor="#E0E0E0"
                      onValueChange={(val) => toggleReminder(item.id, val)}
                      value={item.enabled}
                    />
                  </Card>
                </TouchableOpacity>
              ))}

              <TouchableOpacity style={styles.addMoreButton} onPress={openAddModal}>
                <Ionicons name="add-circle-outline" size={20} color={Colors.ButtonPink} />
                <Text style={styles.addMoreText}>Add Another Reminder</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.testButton} onPress={handleTestNotification}>
                <Ionicons name="notifications-outline" size={18} color={Colors.textSecondary} />
                <Text style={styles.testButtonText}>Test Notification</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>

        <Modal
          transparent={true}
          visible={modalMode === 'action'}
          animationType="fade"
          onRequestClose={closeModal}
        >
          <TouchableOpacity style={styles.actionModalBackground} activeOpacity={1} onPress={closeModal}>
            <View style={styles.actionModalContainer}>
              <Text style={styles.actionModalTitle}>{form.reminder?.title}</Text>
              <Text style={styles.actionModalTime}>{form.reminder ? formatTime(form.reminder.time) : ''}</Text>

              <View style={styles.actionButtonsRow}>
                <TouchableOpacity style={styles.actionButton} onPress={openEditModal}>
                  <View style={[styles.actionButtonIcon, { backgroundColor: '#E3F2FD' }]}>
                    <Ionicons name="create-outline" size={24} color="#1976D2" />
                  </View>
                  <Text style={styles.actionButtonText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
                  <View style={[styles.actionButtonIcon, { backgroundColor: '#FFEBEE' }]}>
                    <Ionicons name="trash-outline" size={24} color="#E53935" />
                  </View>
                  <Text style={[styles.actionButtonText, { color: '#E53935' }]}>Delete</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        <Modal
          transparent={true}
          visible={modalMode === 'add'}
          animationType="slide"
          onRequestClose={closeModal}
        >
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add Reminder</Text>
                <TouchableOpacity onPress={closeModal}>
                  <Ionicons name="close-circle" size={28} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <Text style={styles.modalSubtitle}>Choose reminder type</Text>

              <ScrollView style={styles.typeList} showsVerticalScrollIndicator={false}>
                {REMINDER_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.typeItem,
                      form.selectedType.id === type.id && { borderColor: type.color, borderWidth: 2 },
                    ]}
                    onPress={() => handleSelectType(type)}
                  >
                    <View style={[styles.typeIconContainer, { backgroundColor: `${type.color}20` }]}>
                      <MaterialCommunityIcons name={type.icon as any} size={24} color={type.color} />
                    </View>
                    <Text style={styles.typeTitle}>{type.title}</Text>
                    {form.selectedType.id === type.id && (
                      <Ionicons name="checkmark-circle" size={24} color={type.color} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {form.selectedType.id === 'custom' && (
                <TextInput
                  style={styles.customInput}
                  placeholder="Enter reminder title..."
                  placeholderTextColor={Colors.textSecondary}
                  value={form.title}
                  onChangeText={(text) => setForm((prev) => ({ ...prev, title: text }))}
                  maxLength={50}
                />
              )}

              <TouchableOpacity style={styles.nextButton} onPress={showTimePickerForAdd}>
                <LinearGradient
                  colors={[Colors.ButtonPink, '#EC407A']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.nextButtonGradient}
                >
                  <Text style={styles.nextButtonText}>Set Time</Text>
                  <Ionicons name="arrow-forward" size={20} color={Colors.WhiteColor} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        <Modal
          transparent={true}
          visible={modalMode === 'edit'}
          animationType="slide"
          onRequestClose={closeModal}
        >
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Reminder</Text>
                <TouchableOpacity onPress={closeModal}>
                  <Ionicons name="close-circle" size={28} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <Text style={styles.modalSubtitle}>Update your reminder details</Text>

              <Text style={styles.inputLabel}>Title</Text>
              <TextInput
                style={styles.editInput}
                placeholder="Enter reminder title..."
                placeholderTextColor={Colors.textSecondary}
                value={form.title}
                onChangeText={(text) => setForm((prev) => ({ ...prev, title: text }))}
                maxLength={50}
              />

              <Text style={styles.inputLabel}>Current Time</Text>
              <View style={styles.currentTimeContainer}>
                <Ionicons name="time-outline" size={20} color={Colors.textSecondary} />
                <Text style={styles.currentTimeText}>
                  {form.reminder ? formatTime(form.reminder.time) : ''}
                </Text>
              </View>

              <TouchableOpacity style={styles.nextButton} onPress={showTimePickerForEdit}>
                <LinearGradient
                  colors={['#1976D2', '#2196F3']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.nextButtonGradient}
                >
                  <Text style={styles.nextButtonText}>Update Time</Text>
                  <Ionicons name="checkmark" size={20} color={Colors.WhiteColor} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        {showTimePicker && (
          <DateTimePicker
            value={form.time}
            mode="time"
            is24Hour={false}
            display="default"
            onChange={handleTimeSelected}
          />
        )}
      </View>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.DashboardBackground,
    paddingHorizontal: horizontalScale(20),
  },
  scrollContent: {
    paddingBottom: verticalScale(100),
  },
  addButton: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    backgroundColor: Colors.ButtonPink,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: textScale(18),
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginTop: verticalScale(10),
  },
  sectionHint: {
    fontSize: textScale(13),
    color: Colors.textSecondary,
    marginBottom: verticalScale(15),
    marginTop: verticalScale(4),
  },
  reminderCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: ms(16),
    marginBottom: verticalScale(12),
    borderRadius: ms(16),
  },
  iconContainer: {
    width: ms(48),
    height: ms(48),
    borderRadius: ms(14),
    justifyContent: "center",
    alignItems: "center",
    marginRight: horizontalScale(14),
  },
  infoContainer: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: textScale(16),
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: verticalScale(4),
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  reminderTime: {
    fontSize: textScale(13),
    color: Colors.textSecondary,
    marginLeft: horizontalScale(4),
  },
  statusBadge: {
    paddingHorizontal: horizontalScale(8),
    paddingVertical: verticalScale(2),
    borderRadius: ms(10),
    marginLeft: horizontalScale(8),
  },
  statusText: {
    fontSize: textScale(11),
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: verticalScale(60),
    paddingHorizontal: horizontalScale(20),
  },
  emptyIconContainer: {
    width: ms(120),
    height: ms(120),
    borderRadius: ms(60),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(24),
  },
  emptyTitle: {
    fontSize: textScale(22),
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: verticalScale(10),
  },
  emptySubtitle: {
    fontSize: textScale(14),
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: textScale(22),
    marginBottom: verticalScale(30),
  },
  emptyButton: {
    borderRadius: ms(25),
    overflow: "hidden",
  },
  emptyButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: verticalScale(14),
    paddingHorizontal: horizontalScale(24),
  },
  emptyButtonText: {
    color: Colors.WhiteColor,
    fontSize: textScale(16),
    fontWeight: "600",
    marginLeft: horizontalScale(8),
  },
  addMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(16),
    marginTop: verticalScale(10),
  },
  addMoreText: {
    color: Colors.ButtonPink,
    fontSize: textScale(15),
    fontWeight: "600",
    marginLeft: horizontalScale(6),
  },
  testButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(12),
    marginBottom: verticalScale(10),
  },
  testButtonText: {
    color: Colors.textSecondary,
    fontSize: textScale(13),
    marginLeft: horizontalScale(6),
  },
  actionModalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  actionModalContainer: {
    backgroundColor: Colors.WhiteColor,
    borderRadius: ms(20),
    padding: ms(24),
    width: "85%",
    alignItems: "center",
  },
  actionModalTitle: {
    fontSize: textScale(20),
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: verticalScale(4),
  },
  actionModalTime: {
    fontSize: textScale(14),
    color: Colors.textSecondary,
    marginBottom: verticalScale(24),
  },
  actionButtonsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: verticalScale(20),
  },
  actionButton: {
    alignItems: "center",
    marginHorizontal: horizontalScale(20),
  },
  actionButtonIcon: {
    width: ms(56),
    height: ms(56),
    borderRadius: ms(16),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(8),
  },
  actionButtonText: {
    fontSize: textScale(14),
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  cancelButton: {
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(40),
  },
  cancelButtonText: {
    fontSize: textScale(15),
    color: Colors.textSecondary,
    fontWeight: "600",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: Colors.WhiteColor,
    borderTopLeftRadius: ms(24),
    borderTopRightRadius: ms(24),
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(40),
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(16),
  },
  modalTitle: {
    fontSize: textScale(22),
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  modalSubtitle: {
    fontSize: textScale(14),
    color: Colors.textSecondary,
    marginBottom: verticalScale(16),
  },
  typeList: {
    maxHeight: verticalScale(300),
  },
  typeItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.DashboardBackground,
    borderRadius: ms(14),
    padding: ms(14),
    marginBottom: verticalScale(10),
    borderWidth: 2,
    borderColor: "transparent",
  },
  typeIconContainer: {
    width: ms(44),
    height: ms(44),
    borderRadius: ms(12),
    justifyContent: "center",
    alignItems: "center",
    marginRight: horizontalScale(12),
  },
  typeTitle: {
    flex: 1,
    fontSize: textScale(15),
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  customInput: {
    backgroundColor: Colors.DashboardBackground,
    borderRadius: ms(12),
    padding: ms(14),
    fontSize: textScale(15),
    color: Colors.textPrimary,
    marginTop: verticalScale(10),
    marginBottom: verticalScale(10),
  },
  inputLabel: {
    fontSize: textScale(14),
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: verticalScale(8),
    marginTop: verticalScale(10),
  },
  editInput: {
    backgroundColor: Colors.DashboardBackground,
    borderRadius: ms(12),
    padding: ms(14),
    fontSize: textScale(15),
    color: Colors.textPrimary,
  },
  currentTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.DashboardBackground,
    borderRadius: ms(12),
    padding: ms(14),
  },
  currentTimeText: {
    fontSize: textScale(15),
    color: Colors.textPrimary,
    marginLeft: horizontalScale(8),
  },
  nextButton: {
    borderRadius: ms(14),
    overflow: "hidden",
    marginTop: verticalScale(20),
  },
  nextButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(16),
  },
  nextButtonText: {
    color: Colors.WhiteColor,
    fontSize: textScale(16),
    fontWeight: "600",
    marginRight: horizontalScale(8),
  },
});

export default RemindersScreen;
