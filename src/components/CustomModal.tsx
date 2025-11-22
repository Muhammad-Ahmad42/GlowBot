import React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import { ms, textScale, verticalScale, horizontalScale } from "../utils/SizeScalingUtility";
import Colors from "../utils/Colors";
import { Ionicons } from "@expo/vector-icons";

interface CustomModalProps {
  visible: boolean;
  title?: string;
  message: string;
  onClose: () => void;
  iconName?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  buttonText?: string;
}

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  title = "Details",
  message,
  onClose,
  iconName = "information-circle",
  iconColor = Colors.PrimaryButtonBackgroundColor,
  buttonText = "Close",
}) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <View style={styles.iconContainer}>
            <Ionicons name={iconName} size={ms(40)} color={iconColor} />
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: Colors.WhiteColor,
    borderRadius: ms(20),
    padding: ms(20),
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  iconContainer: {
    marginBottom: verticalScale(10),
  },
  title: {
    fontSize: textScale(20),
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: verticalScale(10),
    textAlign: "center",
  },
  message: {
    fontSize: textScale(14),
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: verticalScale(20),
  },
  button: {
    backgroundColor: Colors.PrimaryButtonBackgroundColor,
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(30),
    borderRadius: ms(25),
  },
  buttonText: {
    color: Colors.WhiteColor,
    fontSize: textScale(16),
    fontWeight: "600",
  },
});

export default CustomModal;
