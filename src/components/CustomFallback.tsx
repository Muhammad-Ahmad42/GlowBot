import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Colors from "../utils/Colors";
import { horizontalScale, ms, textScale } from "../utils/SizeScalingUtility";
import { verticalScale } from "react-native-size-matters";

interface CustomErrorModalProps {
  visible: boolean;
  message: string;
  onClose: () => void;
}

const CustomErrorModal: React.FC<CustomErrorModalProps> = ({
  visible,
  message,
  onClose,
}) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Error</Text>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CustomErrorModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "80%",
    backgroundColor: Colors.WhiteColor,
    padding: ms(20),
    borderRadius: ms(12),
    alignItems: "center",
    elevation: 6,
  },
  title: {
    fontSize: textScale(18),
    fontWeight: "700",
    marginBottom: verticalScale(10),
    color: Colors.textPrimary,
  },
  message: {
    fontSize: textScale(14),
    textAlign: "center",
    marginBottom: verticalScale(20),
    color: Colors.textMuted,
  },
  button: {
    backgroundColor: Colors.PrimaryButtonBackgroundColor,
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(20),
    borderRadius: ms(8),
  },
  buttonText: {
    color: Colors.WhiteColor,
    fontWeight: "600",
    fontSize: textScale(14),
  },
});
