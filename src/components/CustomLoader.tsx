import React from "react";
import { View, ActivityIndicator, StyleSheet, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ms,
  verticalScale,
  horizontalScale,
} from "../utils/SizeScalingUtility";
import Colors from "../utils/Colors";

interface CustomLoaderProps {
  visible: boolean;
  size?: "small" | "large" | number;
  color?: string;
}

const CustomLoader: React.FC<CustomLoaderProps> = ({
  visible,
  size = "large",
  color = Colors.ButtonPink, // Brand color instead of generic loader color
}) => {
  if (!visible) return null;
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      statusBarTranslucent
      presentationStyle="overFullScreen"
      hardwareAccelerated
      onRequestClose={() => {}}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size={size} color={color} />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.ModalOverlayColor,
    ...StyleSheet.absoluteFillObject,
  },
  loaderContainer: {
    height: verticalScale(60),
    width: horizontalScale(60),
    borderRadius: horizontalScale(10),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.WhiteColor,
    shadowColor: Colors.ModalOverlayColor,
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.8,
    shadowRadius: horizontalScale(1),
    elevation: ms(5),
  },
});

export default CustomLoader;
