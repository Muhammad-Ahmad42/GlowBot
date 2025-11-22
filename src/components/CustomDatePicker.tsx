import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import {
  horizontalScale,
  ms,
  textScale,
  verticalScale,
} from "../utils/SizeScalingUtility";
import Colors from "../utils/Colors";

interface CustomDatePickerProps {
  label: string;
  value: Date | null;
  onDateChange: (date: Date) => void;
  placeholder?: string;
  error?: string;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  label,
  value,
  onDateChange,
  placeholder = "Select Date",
  error,
}) => {
  const [show, setShow] = useState(false);

  const onChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShow(false);
    }
    if (selectedDate) {
      onDateChange(selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-GB"); // DD/MM/YYYY format
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.inputContainer, error ? styles.inputError : null]}
        onPress={() => setShow(true)}
        activeOpacity={0.8}
      >
        <Text style={[styles.inputText, !value && styles.placeholderText]}>
          {value ? formatDate(value) : placeholder}
        </Text>
        <Ionicons
          name="calendar-outline"
          size={ms(20)}
          color={Colors.textMuted}
        />
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onChange}
          maximumDate={new Date()} // Cannot select future dates
        />
      )}

      {/* iOS Specific Modal for Spinner */}
      {Platform.OS === "ios" && show && (
        <Modal transparent={true} animationType="slide">
          <View style={styles.iosModalContainer}>
            <View style={styles.iosPickerContainer}>
              <View style={styles.iosHeader}>
                <TouchableOpacity onPress={() => setShow(false)}>
                  <Text style={styles.iosButtonText}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={value || new Date()}
                mode="date"
                display="spinner"
                onChange={onChange}
                maximumDate={new Date()}
                textColor={Colors.textPrimary}
              />
            </View>
          </View>
        </Modal>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: verticalScale(17),
  },
  label: {
    fontSize: textScale(16),
    marginBottom: verticalScale(5),
    color: Colors.DarkTextColor,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.InputBackgroundColor,
    borderRadius: ms(10),
    paddingHorizontal: horizontalScale(15),
    paddingVertical: verticalScale(14),
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.border,
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: ms(2),
    shadowRadius: horizontalScale(2),
    elevation: ms(4),
  },
  inputError: {
    borderColor: "red",
  },
  inputText: {
    fontSize: textScale(15),
    color: Colors.textPrimary,
  },
  placeholderText: {
    color: Colors.textMuted,
  },
  errorText: {
    color: "red",
    fontSize: textScale(12),
    marginTop: verticalScale(5),
  },
  // iOS Specific Styles
  iosModalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  iosPickerContainer: {
    backgroundColor: Colors.WhiteColor,
    paddingBottom: verticalScale(20),
  },
  iosHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: ms(15),
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.InputBackgroundColor,
  },
  iosButtonText: {
    color: Colors.PrimaryButtonBackgroundColor,
    fontSize: textScale(16),
    fontWeight: "600",
  },
});

export default CustomDatePicker;
